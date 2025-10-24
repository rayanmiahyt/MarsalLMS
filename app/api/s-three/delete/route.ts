import { env } from "@/lib/env";
import { S3 } from "@/lib/S3Client";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { requireAdmin } from "@/app/data/admin/require-user";

const aj = arcjet
  .withRule(
    detectBot({
      mode: "LIVE",
      allow: [],
    })
  )
  .withRule(
    fixedWindow({
      mode: "LIVE",
      window: "1m",
      max: 5,
    })
  );

export async function DELETE(req: NextRequest) {
  const sesstion = await requireAdmin();
  try {
    const disition = await aj.protect(req, {
      fingerprint: sesstion?.user.id as string,
    });

    if (disition.isDenied()) {
      return NextResponse.json(
        {
          error: "Too many request Plige wait few minite to delete file agian",
        },
        { status: 429 }
      );
    }
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
