"use server";

import { requireAdmin } from "@/app/data/admin/require-user";
import { prisma } from "@/lib/db";
import { ApiResponce } from "@/lib/types";
import { courseSchema, CourseSchemaType } from "@/lib/zodSchemas";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";

const aj = arcjet
  .withRule(
    detectBot({
      mode: "LIVE",
      allow: [],
    })
  )
  .withRule(
    fixedWindow({
      mode: "LIVE",
      window: "1m",
      max: 5,
    })
  );

export async function editCourse(
  data: CourseSchemaType,
  courseId: string
): Promise<ApiResponce> {
  const user = await requireAdmin();

  try {
    const req = await request();
    const decision = await aj.protect(req, {
      fingerprint: user.user.id,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return {
          status: "error",
          message: "Too many requiest plige slowdown the req",
        };
      } else {
        return {
          status: "error",
          message: "You are a bot! if it is a mistake plige contact",
        };
      }
    }
    const result = courseSchema.safeParse(data);

    if (!result) {
      return { status: "error", message: "Invalid Data" };
    }

    await prisma.course.update({
      where: {
        id: courseId,
        userId: user.user.id,
      },
      data: {
        ...data,
      },
    });

    return {
      status: "sucess",
      message: "Course updated sucessfully",
    };
  } catch {
    return {
      status: "error",
      message: "Feild to update the Course",
    };
  }
}

export async function reorderLestions(
  chapterId: string,
  lesstions: { id: string; position: number }[],
  courseId: string
): Promise<ApiResponce> {
  try {
    await requireAdmin();

    if (!lesstions || lesstions.length === 0) {
      return { status: "error", message: "no lestion provided for reordring" };
    }

    const updates = lesstions.map((lesstion) =>
      prisma.lesson.update({
        where: {
          id: lesstion.id,
          chapterId: chapterId,
        },
        data: {
          position: lesstion.position,
        },
      })
    );

    await prisma.$transaction(updates);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "sucess",
      message: "Lestion reordered sucessfullt",
    };
  } catch {
    return { status: "error", message: "fuiled to reorder lestions" };
  }
}

export async function reorderChapters(
  chourseId: string,
  chapter: { id: string; position: number }[]
): Promise<ApiResponce> {
  await requireAdmin();
  if (!chapter || chapter.length === 0) {
    return { status: "error", message: "No chapter fount to reorder" };
  }

  try {
    const updateChapter = chapter.map((chap) =>
      prisma.chapter.update({
        where: {
          id: chap.id,
        },
        data: {
          position: chap.position,
        },
      })
    );

    await prisma.$transaction(updateChapter);

    revalidatePath(`/admin/courses/${chourseId}/edit`);

    return {
      status: "sucess",
      message: "Chapter reordered sucessfully",
    };
  } catch {
    return { status: "error", message: "chapter reordered filed" };
  }
}
