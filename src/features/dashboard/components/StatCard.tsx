interface StatCardProps {
  label: string;
  value: string;
  large?: boolean;
}

export default function StatCard({
  label,
  value,
  large = false,
}: StatCardProps) {
  return (
    <article
      className={`border border-[#E5E7EB] bg-white p-6 ${large ? "min-h-[186px]" : "min-h-[152px]"}`}
    >
      <p
        className={`${large ? "text-[52px]" : "text-[44px]"} font-bold leading-none text-black`}
      >
        {value}
      </p>
      <p className="mt-3 text-xl font-bold uppercase leading-tight text-black">
        {label}
      </p>
    </article>
  );
}
