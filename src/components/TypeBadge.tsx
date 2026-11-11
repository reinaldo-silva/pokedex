import { getTypeInfo, tint } from "../lib/pokemon";

export function TypeBadge({ type, size = "sm" }: { type: string; size?: "sm" | "md" }) {
  const { label, color } = getTypeInfo(type);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium text-white ${
        size === "md" ? "px-3 py-1 text-sm" : "px-2.5 py-0.5 text-xs"
      }`}
      style={{
        backgroundColor: tint(color, 28),
        boxShadow: `inset 0 0 0 1px ${tint(color, 55)}`,
      }}
    >
      <span className="size-1.5 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}
