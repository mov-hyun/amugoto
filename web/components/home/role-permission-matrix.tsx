import { SectionCard } from "@/components/home/section-card";
import type { RolePermissionRule } from "@/types/amugoto";

export function RolePermissionMatrix({
  items,
}: {
  items: RolePermissionRule[];
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <SectionCard title="역할별 권한 매트릭스">
      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={`${item.role}-${index}`}
            className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4"
          >
            <p className="text-sm font-semibold text-white">{item.role}</p>

            <div className="mt-3 grid gap-3 md:grid-cols-3">
              <MatrixList
                title="볼 수 있는 것"
                color="text-emerald-200"
                items={item.canView}
              />
              <MatrixList
                title="수정/실행 가능한 것"
                color="text-sky-200"
                items={item.canEdit}
              />
              <MatrixList
                title="보면 안 되는 것"
                color="text-rose-200"
                items={item.mustNotAccess}
              />
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function MatrixList({
  title,
  items,
  color,
}: {
  title: string;
  items: string[];
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-3">
      <p className={`text-xs font-semibold ${color}`}>{title}</p>
      <ul className="mt-2 space-y-2">
        {items.map((entry, index) => (
          <li key={index} className="text-sm leading-6 text-zinc-300">
            • {entry}
          </li>
        ))}
      </ul>
    </div>
  );
}
