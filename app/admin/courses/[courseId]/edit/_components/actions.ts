"use server";

import { requireAdmin } from "@/app/data/admin/require-user";
import { prisma } from "@/lib/db";
import { ApiResponce } from "@/lib/types";
import { courseSchema, CourseSchemaType } from "@/lib/zodSchemas";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { request } from "@arcjet/next";

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
