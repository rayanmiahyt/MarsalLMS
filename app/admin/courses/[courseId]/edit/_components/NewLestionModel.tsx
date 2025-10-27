"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FormControl,
  FormField,
  Form,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { tryCatch } from "@/lib/try-chatch";
import { lessionSchema, LessionSchemaType } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { createLesson } from "./actions";
import { toast } from "sonner";

export default function NewLessonModel({
  courseId,
  chapterId,
}: {
  courseId: string;
  chapterId: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [panding, startTransition] = useTransition();
  const form = useForm<LessionSchemaType>({
    resolver: zodResolver(lessionSchema),
    defaultValues: {
      name: "",
      courseId: courseId,
      chapterId: chapterId,
    },
  });

  async function onSubmit(value: LessionSchemaType) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(createLesson(value));

      if (error) {
        toast.error("an unexpected error occrred. please try again leater");
        return;
      }

      if (result.status === "sucess") {
        toast.success(result.message);
        form.reset();
        setIsOpen(false);
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  }

  function handaleOpentChange(open: boolean) {

    if (!open) {
      form.reset()
    }
    setIsOpen(open);
  }
  return (
    <Dialog open={isOpen} onOpenChange={handaleOpentChange}>
      <DialogTrigger asChild>
        <Button variant={"outline"} className="w-full justify-center items-center" >
          <Plus className="size-4" /> New Lession
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Create New Lession</DialogTitle>
          <DialogDescription>
            What would you like to neme your Lession
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Lession Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button disabled={panding} type="submit">
                {panding ? "Saveing..." : "Save Change"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
