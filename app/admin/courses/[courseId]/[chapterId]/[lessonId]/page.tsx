import { adminGetLesson } from "@/app/data/admin/admin-get-lesson";
import { LessonFrom } from "./_components/LessionFrom";

interface PageProps {
  params: {
    courseId: string;
    chapterId: string;
    lessonId: string;
  };
}

export default async function LessonIdPage({ params }: PageProps) {
  const { courseId, chapterId, lessonId } = params;

  console.log("Lesson params:", params);

  const lesson = await adminGetLesson(lessonId);

  return <LessonFrom chapterId={chapterId} data={lesson} courseId={courseId} />;
}
