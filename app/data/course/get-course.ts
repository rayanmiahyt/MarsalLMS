import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export async function getInduvidualCourse(slag:string) {




    const course = await prisma.course.findUnique({
      where: {
        slag: slag,
      },
      select: {
        id: true,
        title: true,
        discription: true,
        fileKey: true,
        price: true,
        duretion: true,
        lavel: true,
        Catagory: true,
        smollDiscription: true,
        chapter: {
          select: {
            id: true,
            title: true,
            lesson: {
              select: {
                id: true,
                title: true,
              },
              orderBy:{
                position:"asc"
              }
            },
          },
          orderBy: {
            position: "asc",
          },
        },
      },
    });

    if (!course) {
        return notFound()
    }

    return course
}