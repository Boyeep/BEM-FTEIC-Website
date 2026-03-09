type BadgeVariant = "published" | "archived" | "ongoing" | "ended";

interface BadgeProps {
  label: string;
  variant: BadgeVariant;
}

const VARIANT_CLASS: Record<BadgeVariant, string> = {
  published: "border-blue-600 text-blue-600 bg-blue-50",
  archived: "border-gray-500 text-gray-700 bg-gray-100",
  ongoing: "border-blue-600 text-blue-600 bg-blue-50",
  ended: "border-zinc-700 text-zinc-700 bg-zinc-100",
};

export default function Badge({ label, variant }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${VARIANT_CLASS[variant]}`}
    >
      {label}
    </span>
  );
}
