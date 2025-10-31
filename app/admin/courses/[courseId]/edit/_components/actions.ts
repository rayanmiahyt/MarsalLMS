"use server";

import { requireAdmin } from "@/app/data/admin/require-user";
import { prisma } from "@/lib/db";
import { ApiResponce } from "@/lib/types";
import {
  chapterSchema,
  chapterSchemaType,
  courseSchema,
  CourseSchemaType,
  lessionSchema,
} from "@/lib/zodSchemas";
import arcjet, {  fixedWindow } from "@/lib/arcjet";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";

const aj = arcjet
  
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

export async function createChapter(
  values: chapterSchemaType
): Promise<ApiResponce> {
  await requireAdmin();

  try {
    const result = chapterSchema.safeParse(values);

    if (!result.success) {
      return {
        status: "error",
        message: "Invalid Data",
      };
    }

    await prisma.$transaction(async (tx) => {
      const maxPos = await tx.chapter.findFirst({
        where: {
          courseId: result.data.courseId,
        },
        select: {
          position: true,
        },
        orderBy: {
          position: "desc",
        },
      });

      await tx.chapter.create({
        data: {
          title: result.data.name,
          courseId: result.data.courseId,
          position: (maxPos?.position ?? 0) + 1,
        },
      });
    });

    revalidatePath(`/admin/courses/${result.data.courseId}/edit`);

    return { status: "sucess", message: "Chapter Created Sucessfully" };
  } catch {
    return { status: "error", message: "Chapter creation field" };
  }
}

export async function createLesson(
  values: chapterSchemaType
): Promise<ApiResponce> {
  await requireAdmin();

  try {
    const result = lessionSchema.safeParse(values);

    if (!result.success) {
      return {
        status: "error",
        message: "Invalid Data",
      };
    }

    await prisma.$transaction(async (tx) => {
      const maxPos = await tx.lesson.findFirst({
        where: {
          chapterId: result.data.chapterId,
        },
        select: {
          position: true,
        },
        orderBy: {
          position: "desc",
        },
      });

      await tx.lesson.create({
        data: {
          title: result.data.name,
          chapterId: result.data.chapterId,
          position: (maxPos?.position ?? 0) + 1,
          discription: result.data.discription,
          thumbnailKey: result.data.thumbnailKey,
          videoKey: result.data.videoKey,
        },
      });
    });

    revalidatePath(`/admin/courses/${result.data.courseId}/edit`);

    return { status: "sucess", message: "Lession Created Sucessfully" };
  } catch {
    return { status: "error", message: "Chapter Lession field" };
  }
}

export async function deleteLesson({
  chapterId,
  courseId,
  lestionId,
}: {
  chapterId: string;
  courseId: string;
  lestionId: string;
}): Promise<ApiResponce> {
  await requireAdmin();
  try {
    const chapterWithLestion = await prisma.chapter.findUnique({
      where: {
        id: chapterId,
      },
      select: {
        lesson: {
          orderBy: {
            position: "asc",
          },
          select: {
            id: true,
            position: true,
          },
        },
      },
    });

    if (!chapterWithLestion) {
      return {
        status: "error",
        message: "Chapter not fount",
      };
    }

    const lesson = chapterWithLestion.lesson;

    const lestionToDelete = lesson.find((lestion) => lestion.id === lestionId);

    if (!lestionToDelete) {
      return {
        status: "error",
        message: "Lesson not fount",
      };
    }

    const remaningLestions = lesson.filter(
      (lestion) => lestion.id !== lestionId
    );

    const updates = remaningLestions.map((lession, index) => {
      return prisma.lesson.update({
        where: {
          id: lession.id,
        },
        data: {
          position: index + 1,
        },
      });
    });

    await prisma.$transaction([
      ...updates,
      prisma.lesson.delete({
        where: {
          id: lestionId,
          chapterId: chapterId,
        },
      }),
    ]);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "sucess",
      message: "Lession deleted sucessfully",
    };
  } catch {
    return {
      status: "error",
      message: "Lession deletion error",
    };
  }
}

export async function deleteChapter({
  chapterId,
  courseId,
  
}: {
  chapterId: string;
  courseId: string;
  
}): Promise<ApiResponce> {
  await requireAdmin();
  try {
    const chourseWithChapter = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
     
      select:{
        chapter:{
          orderBy:{
            position:"asc"
          },
          select:{
            id:true,
            position:true
          }
        }
      }
    });

    if (!chourseWithChapter) {
      return {
        status: "error",
        message: "Chorse not fount",
      };
    }

    const chapters = chourseWithChapter.chapter;

    const chapterToDelete = chapters.find((chapter) => chapter.id === chapterId);

    if (!chapterToDelete) {
      return {
        status: "error",
        message: "Chapter not fount",
      };
    }

    const remaningChapters= chapters.filter(
      (chapter) => chapter.id !== chapterId
    );
   
    

    const updates = remaningChapters.map((chap, index) => {
      return prisma.chapter.update({
        where: {
          id: chap.id,
        },
        data: {
          position: index + 1,
        },
      });
    });

    await prisma.$transaction([
      ...updates,
      prisma.chapter.delete({
        where: {
          id: chapterId,
        },
      }),
    ]);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "sucess",
      message: "Chapter deleted sucessfully",
    };
  } catch {
    return {
      status: "error",
      message: "Chapter deletion error",
    };
  }
}