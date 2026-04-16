import { QuestionarioFlow } from "@/components/questionario/flow";

export const metadata = {
  title: "Questionario",
  description:
    "Rispondi a poche domande per aiutarci a trovare il sessuologo giusto per te.",
  robots: { index: false },
};

export default function QuestionarioPage() {
  return <QuestionarioFlow />;
}
