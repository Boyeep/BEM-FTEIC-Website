export default function NewsCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-input-grey bg-white p-5">
      <div className="h-4 w-20 rounded bg-slate-200" />
      <div className="mt-4 h-7 w-4/5 rounded bg-slate-200" />
      <div className="mt-3 h-4 w-full rounded bg-slate-200" />
      <div className="mt-2 h-4 w-11/12 rounded bg-slate-200" />
      <div className="mt-6 flex items-center justify-between">
        <div className="h-3 w-24 rounded bg-slate-200" />
        <div className="h-3 w-16 rounded bg-slate-200" />
      </div>
      <div className="mt-5 h-4 w-28 rounded bg-slate-200" />
    </div>
  );
}
