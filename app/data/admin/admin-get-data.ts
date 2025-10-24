import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-user";

export async function adminGetData() {
  await requireAdmin();
  const data = await prisma.course.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      smollDiscription: true,
      duretion: true,
      lavel: true,
      status: true,
      price: true,
      fileKey: true,
      slag: true,
    },
  });

  return data;
}


export type AdminCourseType = Awaited<ReturnType<typeof adminGetData>>[0]