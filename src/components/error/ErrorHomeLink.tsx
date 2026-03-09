import Link from "next/link";

type ErrorHomeLinkProps = {
  href?: string;
  label?: string;
};

export default function ErrorHomeLink({
  href = "/",
  label = "Return to Home",
}: ErrorHomeLinkProps) {
  return (
    <Link
      href={href}
      className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
    >
      {label}
    </Link>
  );
}
