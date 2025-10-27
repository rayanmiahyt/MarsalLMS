import { z } from "zod";

export const courseLabel = ["Beginner", "Intermidiate", "Advanced"] as const;
export const courseStatus = ["Draft", "Published", "Archived"] as const;

export const courseCatagory = [
  "Devolpment",
  "Bigness",
  "Finace",
  "It & Sofware",
  "Office Prodactybaty",
  "Parsonal devolopment",
  "Desing",
  "Merketing",
  "Helth & fitnell",
  "Music",
  "Teaching & Academics",
] as const;

export const courseSchema = z.object({
  title: z
    .string()
    .min(3, { message: "title must be at least 3 caracter " })
    .max(100, { message: "title shoud not be moreten 100  caracter " }),
  discription: z
    .string()
    .min(3, { message: "discription must be at least 3 caracter " }),
  fileKey: z
    .string()
    .min(1, { message: "fileKey must be at least 1 caracter " }),
  price: z.coerce.number().min(1, { message: "price must be at least 1 usd " }),
  duretion: z.coerce
    .number()
    .min(1, { message: "duretion must be at least 1 hour " })
    .max(500, { message: "duretion shoud not be moreten 500  hour " }),
  lavel: z.enum(courseLabel),
  Catagory: z.enum(courseCatagory),
  smollDiscription: z
    .string()
    .min(3, { message: "smollDiscription must be at least 3 caracter " })
    .max(200, {
      message: "smollDiscription shoud not be moreten 200  caracter ",
    }),
  slag: z.string().min(3, { message: "slag must be at least 3 caracter " }),
  status: z.enum(courseStatus),
});

export const chapterSchema = z.object({
  name: z.string().min(3, { message: "name must be 3 caracter long" }),
  courseId: z.string().uuid({ message: "Invalid course Id" }),
});

export const lessionSchema = z.object({
  name: z.string().min(3, { message: "name must be 3 caracter long" }),
  courseId: z.string().uuid({ message: "Invalid course Id" }),
  chapterId: z.string().uuid({ message: "Invalid chapter Id" }),
  discription: z
    .string()
    .min(3, { message: "Discription must be 3 caracter long" })
    .optional(),
  thumbnailKey: z
    .string()
    .min(3, { message: "thumbnailKey must be 3 caracter long" })
    .optional(),
  videoKey: z
    .string()
    .min(3, { message: "videoKey must be 3 caracter long" })
    .optional(),
});

export type CourseSchemaType = z.infer<typeof courseSchema>;

export type chapterSchemaType = z.infer<typeof chapterSchema>;
export type LessionSchemaType = z.infer<typeof lessionSchema>;
