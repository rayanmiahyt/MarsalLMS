import { prisma } from "@/lib/db";

export async function getAllCourses() {
    const data = await prisma.course.findMany({
        where:{
            status:"Published"
        },
        select:{
            title:true,
            price:true,
            smollDiscription:true,
            slag:true,
            fileKey:true,
            id:true,
            lavel:true,
            duretion:true,
            Catagory:true
        },
        orderBy:{
            createdAt:"desc"
        }
    })

    return data
}


export type PublicCourseType = Awaited<ReturnType<typeof getAllCourses>>[0]