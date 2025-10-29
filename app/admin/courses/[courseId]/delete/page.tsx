"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { tryCatch } from "@/lib/try-chatch";
import Link from "next/link";
import { useTransition } from "react";
import { toast } from "sonner";
import { deleteCourse } from "./actions";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";

export default function DeleteCoursePage() {
  const [isPanding, startTrangition] = useTransition();
  const router = useRouter();
  const { courseId } = useParams<{ courseId: string }>();

  function onSubmit() {
    startTrangition(async () => {
      const { data, error } = await tryCatch(deleteCourse(courseId));
      if (error) {
        return toast.error(
          "An unexpectet error occurred.Plese try agin leater"
        );
      }
      if (data.status === "sucess") {
        toast.success(data.message);

        router.push("/admin/courses");
        return;
      } else if (data.status === "error") {
        toast.error(data.message);
        return;
      }
    });
  }

  return (
    <div className="max-w-xl mx-auto w-full">
      <Card className="mt-42">
        <CardHeader>
          <CardTitle>Are you sure you wont to Delete This Course</CardTitle>
          <CardDescription>This action can not be Undone</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between ">
          <Link
            className={buttonVariants({
              variant: "outline",
            })}
            href={"/admin/courses"}
          >
            Cancel
          </Link>
          <Button
            variant={"destructive"}
            onClick={onSubmit}
            disabled={isPanding}
          >
            {isPanding ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Deleteing...
              </>
            ) : (
              <>
                <Trash2 className="size-4" />
                Delete
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
