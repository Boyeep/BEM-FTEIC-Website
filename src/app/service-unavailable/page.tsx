import { Metadata } from "next";

import ErrorHomeLink from "@/components/error/ErrorHomeLink";
import ErrorPanel from "@/components/error/ErrorPanel";

export const metadata: Metadata = {
  title: "503",
};

export default function ServiceUnavailablePage() {
  return (
    <main>
      <ErrorPanel
        title="Error"
        description="503 Service Unavailable"
        titleAs="h1"
        iconVariant="serviceUnavailable"
        action={<ErrorHomeLink label="Back to Home" />}
      />
    </main>
  );
}
