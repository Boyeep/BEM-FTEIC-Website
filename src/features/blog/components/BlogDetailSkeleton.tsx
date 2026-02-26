export default function BlogDetailSkeleton() {
  return (
    <div className="mx-auto w-full max-w-3xl animate-pulse px-4 py-10">
      <div className="h-4 w-28 rounded bg-slate-200" />
      <div className="mt-8 h-4 w-24 rounded bg-slate-200" />
      <div className="mt-3 h-10 w-5/6 rounded bg-slate-200" />
      <div className="mt-4 h-4 w-48 rounded bg-slate-200" />
      <div className="mt-8 h-64 rounded-2xl bg-slate-200" />
      <div className="mt-8 space-y-3">
        <div className="h-4 w-full rounded bg-slate-200" />
        <div className="h-4 w-full rounded bg-slate-200" />
        <div className="h-4 w-11/12 rounded bg-slate-200" />
      </div>
    </div>
  );
}
