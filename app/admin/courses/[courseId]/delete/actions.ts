"use server"

import { requireAdmin } from "@/app/data/admin/require-user"
import { prisma } from "@/lib/db"
import { ApiResponce } from "@/lib/types"
import { revalidatePath } from "next/cache"

export async function deleteCourse(courseId:string):Promise<ApiResponce> {
    await requireAdmin()

    try {
        
        await prisma.course.delete({
            where:{
                id:courseId
            }
        })

        revalidatePath("/admin/courses")

        return {
            status:"sucess",
            message:"course deleted sucessfully"
        }
        



    } catch  {
        return {
            status:"error",
            message:"Filed to delete Course"
        }
    }
}