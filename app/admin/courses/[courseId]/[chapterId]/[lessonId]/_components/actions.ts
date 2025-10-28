"use server"

import { requireAdmin } from "@/app/data/admin/require-user"
import { prisma } from "@/lib/db"
import { ApiResponce } from "@/lib/types"
import { lessionSchema, LessionSchemaType } from "@/lib/zodSchemas"

export async function updateLesson (values:LessionSchemaType,lessonId:string):Promise<ApiResponce>{
    await requireAdmin()
    try {

        const result = lessionSchema.safeParse(values)

        if (!result.success) {
            return {
                status:"error",
                message:"Invalid data"
            }
        }

        await prisma.lesson.update({
            where:{
                id:lessonId
            },
            data:{
                title:result.data.name,
                discription:result.data.discription,
                thumbnailKey:result.data.thumbnailKey,
                videoKey:result.data.videoKey,
            }
        })

        return {
            status:"sucess",
            message:"Course updated sucessfully"
        }
        
    } catch {
        return {
            status:"error",
            message:"Lesson updated filed"
        }
    }
}