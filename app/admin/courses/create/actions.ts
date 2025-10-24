"use server";

import { requireAdmin } from "@/app/data/admin/require-user";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";

import { prisma } from "@/lib/db";
import { ApiResponce } from "@/lib/types";
import { courseSchema, CourseSchemaType } from "@/lib/zodSchemas";
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

export async function CreateCourse(
  data: CourseSchemaType
): Promise<ApiResponce> {
  const sesstion = await requireAdmin();
  try {
    const req = await request();
    const decision = await aj.protect(req, {
      fingerprint: sesstion.user.id,
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
    const validation = courseSchema.safeParse(data);

    if (!validation.success) {
      return {
        status: "error",
        message: "Invalid from data",
      };
    }

    await prisma.course.create({
      data: {
        ...validation.data,
        userId: sesstion?.user.id as string,
      },
    });

    return {
      status: "sucess",
      message: "Course created sucessfully",
    };
  } catch {
    return {
      status: "error",
      message: "Internal server error",
    };
  }
}
