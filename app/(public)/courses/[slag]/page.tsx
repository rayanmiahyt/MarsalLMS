import { getInduvidualCourse } from "@/app/data/course/get-course";
import { ReanderDiscription } from "@/components/rich-text-editor/ReanderDiscription";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";

import { env } from "@/lib/env";
import {
  IconBook,
  IconCategory,
  IconChartBar,
  IconChevronDown,
  IconClock,
  IconPlayerPlay,
} from "@tabler/icons-react";
import { CheckIcon } from "lucide-react";
import Image from "next/image";

type Params = Promise<{ slag: string }>;

export default async function SlugPage({ params }: { params: Params }) {
  const { slag } = await params;

  const course = await getInduvidualCourse(slag);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 mt-5">
      <div className="order-1 lg:col-span-2">
        <div className="relative aspect-video w-full overflow-hidden rounded-md shadow-lg">
          <Image
            src={`https://${env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES}.t3.storage.dev/${course.fileKey}`}
            alt={course.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
        <div className="mt-8 space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight ">
              {course.title}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed line-clamp-2 ">
              {course.smollDiscription}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Badge className="flex items-center gap-1 px-3 py-1">
              <IconChartBar className="size-4" />
              <span>{course.lavel}</span>
            </Badge>
            <Badge className="flex items-center gap-1 px-3 py-1">
              <IconCategory className="size-4" />
              <span>{course.Catagory}</span>
            </Badge>
            <Badge className="flex items-center gap-1 px-3 py-1">
              <IconClock className="size-4" />
              <span>{course.duretion}h</span>
            </Badge>
          </div>
          <Separator className="my-8" />
          <div className="space-y-6">
            <h2 className="text-3-xl font-semibold tracking-tighter">
              Course Discription
            </h2>

            <ReanderDiscription json={JSON.parse(course.discription)} />
          </div>
        </div>
        <div className="mt-12 space-y-6 ">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-semibold tracking-tight">
              Course Content
            </h2>
            <div>
              {course.chapter.length} chapters |{" "}
              {course.chapter.reduce(
                (total, chapter) => total + chapter.lesson.length,
                0
              ) || 0}{" "}
              Lessons
            </div>
          </div>
          <div className="space-y-4">
            {course.chapter.map((chap, index) => (
              <Collapsible key={chap.id} defaultOpen={index === 0}>
                <Card className="p-0 overflow-hidden border-2 transition-all duration-200 hover:shadow-md gap-0">
                  <CollapsibleTrigger>
                    <div>
                      <CardContent className="p-6 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <p className="flex justify-center items-center size-10 rounded-full bg-primary/10 font-semibold text-primary">
                              {index + 1}
                            </p>
                            <div>
                              <h3 className="text-xl font-semibold text-left">
                                {chap.title}
                              </h3>
                              <p className="text-sm text-muted-foreground mt-1 text-left">
                                {chap.lesson.length} Lesson
                                {chap.lesson.length !== 1 ? "s" : ""}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant={"outline"} className="text-xs">
                              {chap.lesson.length} Lesson
                              {chap.lesson.length !== 1 ? "s" : ""}
                            </Badge>
                            <IconChevronDown className="size-5 text-muted-foreground" />
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="border-top bg-muted/20">
                      <div className="pt-4 p-6 space-y-3">
                        {chap.lesson.map((less, index) => (
                          <div
                            key={less.id}
                            className="flex items-center gap-4 rounded-lg p-3 hover:bg-accent transition-colors group"
                          >
                            <div className="flex size-8 items-center justify-center rounded-full bg-background border-2 border-primary/20">
                              <IconPlayerPlay className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm">
                                {less.title}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Lesson{index + 1}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            ))}
          </div>
        </div>
      </div>
      {/* enrolment Card  */}

      <div className="order-2 lg:col-span-1">
        <div className="sticky top-20">
          <Card className="py-0">
            <CardContent className="p-6 ">
              <div className="flex items-center justify-between mb-6">
                <span className="text-lg font-medium">Price:</span>
                <span className="text-2xl font-bold text-primary">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(course.price)}
                </span>
              </div>
              <div className="mb-6 space-y-3 rounded-lg bg-muted p-4">
                <h4 className="font-medium">What you will get:</h4>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <IconClock className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Course Duration</p>
                      <p className="text-sm text-muted-foreground">
                        {course.duretion}h
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <IconChartBar className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Course Lavel</p>
                      <p className="text-sm text-muted-foreground">
                        {course.lavel}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <IconCategory className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Course Catagory</p>
                      <p className="text-sm text-muted-foreground">
                        {course.Catagory}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <IconBook className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Total Chapters </p>
                      <p className="text-sm text-muted-foreground">
                        {course.chapter.reduce(
                          (total, chapter) => total + chapter.lesson.length,
                          0
                        ) || 0}{" "}
                        lessons
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mg-6 space-y-3">
                <h4>This course Includes:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <div className="rounded-full bg-green-500/10 text-green-500 p-1">
                      <CheckIcon className="size-4" />
                    </div>
                    <span> Full Lifetime Access</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <div className="rounded-full bg-green-500/10 text-green-500 p-1">
                      <CheckIcon className="size-4" />
                    </div>
                    <span>Access on mobile and desktop</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <div className="rounded-full bg-green-500/10 text-green-500 p-1">
                      <CheckIcon className="size-4" />
                    </div>
                    <span>Certifecate on completion</span>
                  </li>
                </ul>
              </div>

              <Button className="w-full">Enroll Now!</Button>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                30-day money-back gurantee
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
