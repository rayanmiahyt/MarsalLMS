"use client";

import { Button } from "@/components/ui/button";

import {
  courseCatagory,
  courseLabel,
  courseSchema,
  CourseSchemaType,
  courseStatus,
} from "@/lib/zodSchemas";
import { Loader2, PlusIcon, SparkleIcon } from "lucide-react";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import slugify from "slugify";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RichTextEditor } from "@/components/rich-text-editor/Editor";
import Uploader from "@/components/file-uploader/Uploader";
import { tryCatch } from "@/lib/try-chatch";
import { useTransition } from "react";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { editCourse } from "./actions";
import { AdminCourseSingulerType } from "@/app/data/admin/admin-get-course";

interface IAppProps {
  deta: AdminCourseSingulerType;
}

export function EditCourseFrom({ deta }: IAppProps) {
  const [isPanding, startTrangition] = useTransition();
  const router = useRouter();
  const form = useForm<CourseSchemaType>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: deta.title,
      discription: deta.discription,
      lavel: deta.lavel,
      fileKey: deta.fileKey,
      price: deta.price,
      Catagory: deta.Catagory as CourseSchemaType["Catagory"],
      status: deta.status,
      duretion: deta.duretion,
      slag: deta.slag,
      smollDiscription: deta.smollDiscription,
    },
  });

  function onSubmit(values: CourseSchemaType) {
    startTrangition(async () => {
      const { data, error } = await tryCatch(editCourse(values, deta.id));
      if (error) {
        return toast.error(
          "An unexpectet error occurred.Plese try agin leater"
        );
      }
      if (data.status === "sucess") {
        toast.success(data.message);
        form.reset();
        router.push("/admin/courses");
        return;
      } else if (data.status === "error") {
        toast.error(data.message);
        return;
      }
    });
  }

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gsp-4 items-end ">
          <FormField
            control={form.control}
            name="slag"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Slag</FormLabel>
                <FormControl>
                  <Input placeholder="Slag" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="button"
            className="w-fit"
            onClick={() => {
              const titleValue = form.getValues("title");
              const slag = slugify(titleValue);

              form.setValue("slag", slag, { shouldValidate: true });
            }}
          >
            Ganarate Slag <SparkleIcon className="ml-1" size={16} />
          </Button>
        </div>
        <FormField
          control={form.control}
          name="smollDiscription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Small Discription</FormLabel>
              <FormControl>
                <Textarea
                  className="min-h-[120px]"
                  placeholder="Smoll Discription"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="discription"
          render={({ field }) => (
            <FormItem>
              <FormLabel> Discription</FormLabel>
              <FormControl>
                <RichTextEditor field={field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fileKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thumbnail Image</FormLabel>
              <FormControl>
                <Uploader onChange={field.onChange} value={field.value} />
                {/* <Input placeholder=" Thumbnail Image" {...field} /> */}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4 ">
          <FormField
            control={form.control}
            name="Catagory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Catagory</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Catagory" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {courseCatagory.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lavel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lavel</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Lavel" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {courseLabel.map((lavel) => (
                      <SelectItem key={lavel} value={lavel}>
                        {lavel}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="duretion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (hours)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Douration (Hours)"
                    type="number"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>price (Usd)</FormLabel>
                <FormControl>
                  <Input placeholder="price (usd)" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {courseStatus.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPanding}>
          {isPanding ? (
            <>
              Updating...
              <Loader2 className="animate-spin ml-1" />
            </>
          ) : (
            <>
              Update Course <PlusIcon className="ml-1" size={14} />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
