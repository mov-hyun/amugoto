import { SectionCard } from "@/components/home/section-card";

export function ListCard({
  title,
  items,
  checklist = false,
}: {
  title: string;
  items?: string[];
  checklist?: boolean;
}) {
  return (
    <SectionCard title={title}>
      <ul className="space-y-2">
        {(items || []).map((item, index) => (
          <li
            key={index}
            className="flex gap-3 rounded-xl bg-zinc-950 px-4 py-3 text-sm leading-6 text-zinc-200"
          >
            <span className="mt-0.5 text-violet-300">
              {checklist ? "☐" : "•"}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}
