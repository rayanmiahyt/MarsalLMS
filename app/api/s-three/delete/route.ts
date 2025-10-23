import { env } from "@/lib/env";
import { S3 } from "@/lib/S3Client";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const { key } = await req.json();

    console.log("helo", key);

    if (!key) {
      return NextResponse.json(
        { error: "Missing or invalid object key" },
        { status: 400 }
      );
    }

    const command = new DeleteObjectCommand({
      Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
      Key: key,
    });

    await S3.send(command);

    return NextResponse.json(
      { massage: "File deleted sucessfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error on delete route ", error);

    return NextResponse.json(
      { error: "Internal server Error" },
      { status: 500 }
    );
  }
}
