import "server-only";
import { requireAdmin } from "./require-user";
import { prisma } from "@/lib/db";

import { notFound } from "next/navigation";

export async function adminGetCourse({ courseId }: { courseId: string }) {
  await requireAdmin();
  const data = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
    select: {
      id: true,
      title: true,
      discription: true,
      fileKey: true,
      price: true,
      duretion: true,
      lavel: true,
      status: true,
      slag: true,
      smollDiscription: true,
      Catagory: true,
      chapter: {
        select: {
          id: true,
          title: true,
          position: true,
          lesson: {
            select: {
              id: true,
              title: true,
              discription: true,
              thumbnailKey: true,
              position: true,
              videoKey: true,
            },
          },
        },
      },
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}

export type AdminCourseSingulerType = Awaited<
  ReturnType<typeof adminGetCourse>
>;
