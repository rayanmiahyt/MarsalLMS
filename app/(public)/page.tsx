import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface featuresProps {
  title: string;
  description: string;
  icon: string;
}

const features: featuresProps[] = [
  {
    title: "Comprehensive Courses ",
    description:
      "Access a wide range of carefully curated courses desined by industry experts.",
    icon: "📚",
  },
  {
    title: "Interactive Learning ",
    description:
      "Engage with interactive content, quizzes, and assignment to enhance your learning exprience.",
    icon: "🎧",
  },
  {
    title: "Progress Tracking",
    description:
      "Monitor your progress and achivements with detailed analytics and personalized dashboards.",
    icon: "🏟",
  },
  {
    title: "Community Support ",
    description:
      "Join on vibrant community of learners and instructors to collaborate and share knowledge .",
    icon: "👥",
  },
];

export default function Home() {
  return (
    <>
      <section className="relative py-20 ">
        <div className="flex flex-col items-center text-center space-y-6">
          <Badge variant={"outline"}>The future of Online Education</Badge>

          <h1 className="text-4xl md:text-6xl font-bold">
            Elevate your Loarning Experience
          </h1>

          <p className="max-w-[700px] text-muted-foreground md:text-xl">
            Discover a new wey to learn with our modern, interactive learning
            managment system. Access high-quality courses anytime, anywhere.
          </p>

          <div className="flex flex-col sm:flex-row  gap-4 mt-3">
            <Link
              className={buttonVariants({
                size: "lg",
              })}
              href={"/courses"}
            >
              Explore Courses
            </Link>
            <Link
              className={buttonVariants({
                size: "lg",
                variant: "outline",
              })}
              href={"/login"}
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
        {features.map((feature) => (
          <Card
            key={feature.title}
            className="hover:shadow-lg transition-shadow"
          >
            <CardHeader>
              <div className="text-4xl mb-4">{feature.icon}</div>
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </>
  );
}
