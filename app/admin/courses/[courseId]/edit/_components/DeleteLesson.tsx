import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { tryCatch } from "@/lib/try-chatch";
import { AlertDialogCancel } from "@radix-ui/react-alert-dialog";
import { Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { deleteLesson } from "./actions";
import { toast } from "sonner";

export function DeleteLesson({
  chapterId,
  courseId,
  lestionId,
}: {
  chapterId: string;
  courseId: string;
  lestionId: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [panding, startTransition] = useTransition();

  const onSubmit = async () => {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        deleteLesson({ chapterId, courseId, lestionId })
      );

      if (error) {
        toast.error("an unexpected error occrred. please try again leater");
        return;
      }

      if (result.status === "sucess") {
        toast.success(result.message);

        setIsOpen(false);
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={"ghost"} size={"icon"}>
          <Trash2 className="size-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you apsolotly sure</AlertDialogTitle>
          <AlertDialogDescription>
            This action can not be undone.This will permanently delete this
            lesson
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button onClick={onSubmit} disabled={panding}>
            {panding ? "Deleteing..." : "Delete"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
