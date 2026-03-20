type ErrorRetryButtonProps = {
  onRetry: () => void;
  label?: string;
};

export default function ErrorRetryButton({
  onRetry,
  label = "Try again",
}: ErrorRetryButtonProps) {
  return (
    <button
      onClick={onRetry}
      className="inline-flex items-center justify-center bg-[#D9D9D9] px-6 py-3 font-semibold text-[#2450DB] transition hover:brightness-95 focus:outline-none focus:ring-4 focus:ring-white/30"
    >
      {label}
    </button>
  );
}
