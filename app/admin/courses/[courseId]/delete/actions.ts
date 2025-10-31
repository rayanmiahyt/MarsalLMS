"use server";

import { requireAdmin } from "@/app/data/admin/require-user";
import { prisma } from "@/lib/db";
import { ApiResponce } from "@/lib/types";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { revalidatePath } from "next/cache";
import { request } from "@arcjet/next";

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 5,
  })
);

export async function deleteCourse(courseId: string): Promise<ApiResponce> {
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

    await prisma.course.delete({
      where: {
        id: courseId,
      },
    });

    revalidatePath("/admin/courses");

    return {
      status: "sucess",
      message: "course deleted sucessfully",
    };
  } catch {
    return {
      status: "error",
      message: "Filed to delete Course",
    };
  }
}
