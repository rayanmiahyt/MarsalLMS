import { env } from "@/lib/env";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3 } from "@/lib/S3Client";

export const fileUploadSchema = z.object({
  fileName: z.string().min(1, "file name is requred"),
  contentType: z.string().min(1, "content type is required"),
  size: z.number().min(1, "size is required"),

  isImage: z.boolean(),
});

export async function POST(req: Request) {
  try {
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
