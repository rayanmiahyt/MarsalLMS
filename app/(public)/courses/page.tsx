import { getAllCourses } from "@/app/data/course/get-all-courses";
import {
  PublicCourseCardSkrleton,
  PublicCoursesCard,
} from "./_components/PublicCourseCard";
import { Suspense } from "react";

export default function PublicCoursesPage() {
  return (
    <div className="mt-5">
      <div className="flex flex-col space-y-2 mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tighter">
          Explore Courses
        </h1>
        <p className="text-muted-foreground">
          Discover our wiede rang of courses desined to help you achieve your
          learning goals.
        </p>
      </div>
      <Suspense fallback={<LoadingSkelitonLayout />}>
        <RenderCourses />
      </Suspense>
    </div>
  );
}

async function RenderCourses() {
  const courses = await getAllCourses();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <PublicCoursesCard key={course.id} data={course} />
      ))}
    </div>
  );
}

function LoadingSkelitonLayout() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 9 }).map((_, index) => (
        <PublicCourseCardSkrleton key={index} />
      ))}
    </div>
  );
}
