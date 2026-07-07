import { Metadata } from "next";

import ErrorHomeLink from "@/components/error/ErrorHomeLink";
import ErrorPanel from "@/components/error/ErrorPanel";

export const metadata: Metadata = {
  title: "Error - Something went wrong",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ErrorPage() {
  return (
    <main>
      <ErrorPanel
        title="Error"
        description="500 Internal Service Error"
        titleAs="h1"
        action={<ErrorHomeLink label="Back to Home" />}
      />
    </main>
  );
}
