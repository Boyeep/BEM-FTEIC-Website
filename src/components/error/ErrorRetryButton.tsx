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
      className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
    >
      {label}
    </button>
  );
}
