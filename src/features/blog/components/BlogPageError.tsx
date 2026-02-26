interface BlogPageErrorProps {
  message: string;
  onRetry: () => void;
}

export default function BlogPageError({
  message,
  onRetry,
}: BlogPageErrorProps) {
  return (
    <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-5">
      <p className="text-sm text-red-700">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 rounded-md bg-brand-blue px-4 py-2 text-sm font-semibold text-white hover:bg-brand-blue/90"
      >
        Retry
      </button>
    </div>
  );
}
