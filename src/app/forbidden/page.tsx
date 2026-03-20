import { Metadata } from "next";

import ErrorHomeLink from "@/components/error/ErrorHomeLink";
import ErrorPanel from "@/components/error/ErrorPanel";

export const metadata: Metadata = {
  title: "403",
};

export default function ForbiddenPage() {
  return (
    <main>
      <ErrorPanel
        title="Error"
        description="403 Forbidden"
        titleAs="h1"
        iconVariant="forbidden"
        action={<ErrorHomeLink label="Back to Home" />}
      />
    </main>
  );
}
