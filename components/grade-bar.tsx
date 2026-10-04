import { gradeSegments } from "@/lib/home/project-presentation";
import type { StackGrade } from "@/types/database";
import "@/styles/claws-home.css";

export function GradeBar({ grade, ar, node = false }: { grade?: StackGrade; ar: boolean; node?: boolean }) {
  const label = grade ? `${ar ? "التقييم" : "Grade"} ${grade}` : ar ? "غير مقيّم" : "Ungraded";
  return <span className={`claws-grade ${node ? "claws-grade-node" : ""}`} title={label}>
    <span className="claws-segments" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((segment) => <span key={segment} data-filled={segment <= gradeSegments(grade)} />)}
    </span>
    <span className={node || !grade ? "claws-grade-label" : "sr-only"}>{label}</span>
  </span>;
}

