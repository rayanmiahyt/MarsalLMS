import { PublicCourseType } from "@/app/data/course/get-all-courses";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useConstractUrl } from "@/hooks/use-constract-url";
import { School, TimerIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface iAppProps {
  data: PublicCourseType;
}

export function PublicCoursesCard ({data}:iAppProps){

    const thumbailUrl = useConstractUrl(data.fileKey)

    return (

        <Card className="group relative py-0 gap-0">

            <Badge className="absolute top-2 right-2 z-10">{data.lavel}</Badge>
            <Image src={thumbailUrl} alt="Thumbail Image of Course" width={600} height={400} className="w-full rounded-t-xl aspect-video h-full object-cover"/>
            <CardContent className="p-4">
                <Link href={`/courses/${data.slag}`} className="font-medium text-lg line-clamp-2  hover:underline group-hover:text-primary transition-colors">{data.title}</Link>
            <p className="line-clamp-2 text-sm text-muted-foreground leading-tightmt-2">{data.smollDiscription}</p>

            <div className="flex mt-4 items-center gap-x-5">
                <div className="flex items-center gap-x-2">
                    <TimerIcon className="size-6 p-1 rounded-md text-primary bg-primary/10 "/>
                    <p className="text-sm text-muted-foreground">{data.duretion}h</p>
                </div>
                <div className="flex items-center gap-x-2">
                    <School className="size-6 p-1 rounded-md text-primary bg-primary/10 "/>
                    <p className="text-sm text-muted-foreground">{data.Catagory}h</p>
                </div>
            </div>
            <Link href={`/courses/${data.slag}`} className={buttonVariants({
                className:"w-full mt-4"
            })}>Learn More</Link>
            </CardContent>
        </Card>
    )
}


export function PublicCourseCardSkrleton (){
    return (
      <Card className="group relative py-0 gap-0">
        <div className="absolute top-2 right-2 z-10 flex items-center">
          <Skeleton className="h-6 w-10 rounded-full" />
        </div>

        <div className="w-full relative h-fit">
          <Skeleton className="w-full rounded-t-xl aspect-video" />
        </div>
        <CardContent className="p-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/6" />
          </div>
          
          <div className="mt-4 flex items-center gap-x-5">
            <div className="flex items-center gap-x-2">
              <Skeleton className="size-6 rounded-md" />
              <Skeleton className="h-4 w-8 " />
            </div>
            <div className="flex items-center gap-x-2">
              <Skeleton className="size-6 rounded-md" />
              <Skeleton className="h-4 w-8 " />
            </div>
          </div>
          <Skeleton className="mt-4 w-full h-10 rounded-md" />
        </CardContent>
      </Card>
    );
}