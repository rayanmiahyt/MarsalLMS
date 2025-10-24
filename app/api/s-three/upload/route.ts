import { env } from "@/lib/env";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3 } from "@/lib/S3Client";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { requireAdmin } from "@/app/data/admin/require-user";


export const fileUploadSchema = z.object({
  fileName: z.string().min(1, "file name is requred"),
  contentType: z.string().min(1, "content type is required"),
  size: z.number().min(1, "size is required"),

  isImage: z.boolean(),
});

const aj = arcjet.withRule(detectBot({
  mode:"LIVE",
  allow:[]
})

).withRule(fixedWindow({
  mode:"LIVE",
  window:"1m",
  max:5
}))

export async function POST(req: Request) {
  const sesstion = await requireAdmin()
  try {

    const disition = await aj.protect(req, {
      fingerprint: sesstion?.user.id as string,
    });

    if (disition.isDenied()) {
      return NextResponse.json({error:"Too many request Plige wait few minite to upload file agian"},{status:429})
    }


    const body = await req.json();

    const validation = fileUploadSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid Request body" },
        { status: 400 }
      );
    }

    const { fileName, contentType ,size} = validation.data;

    const uniceKey = `${uuidv4()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
      ContentType: contentType,
      Key: uniceKey,
      ContentLength:Number(size)
    });

    const presignedUrl = await getSignedUrl(S3, command, { expiresIn: 3600 });

    const responce = {
      presignedUrl,
      key: uniceKey,
    };

    return NextResponse.json(responce, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Feiled to generate presigned url" },
      { status: 500 }
    );
  }
}
