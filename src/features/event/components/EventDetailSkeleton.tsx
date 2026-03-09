export default function EventDetailSkeleton() {
  return (
    <article className="mx-auto w-full max-w-6xl bg-white px-6 py-6 md:py-10">
      <div className="mb-6 h-56 w-full animate-pulse bg-slate-200 md:h-[360px]" />
      <div className="h-5 w-24 animate-pulse bg-slate-200" />
      <div className="mt-4 h-12 w-3/4 animate-pulse bg-slate-200 md:h-16" />
      <div className="mt-5 h-8 w-48 animate-pulse bg-slate-200" />
      <div className="mt-5 space-y-3">
        <div className="h-6 w-full animate-pulse bg-slate-200" />
        <div className="h-6 w-11/12 animate-pulse bg-slate-200" />
        <div className="h-6 w-4/5 animate-pulse bg-slate-200" />
      </div>
      <div className="mt-7 h-8 w-52 animate-pulse bg-slate-200" />
    </article>
  );
}
