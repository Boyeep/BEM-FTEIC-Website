import { Metadata } from "next";

import ErrorPanel from "@/components/error/ErrorPanel";

export const metadata: Metadata = {
  title: "404",
};

export default function NotFound() {
  return (
    <main>
      <ErrorPanel
        title="Error"
        description="404 Not Found"
        titleAs="h1"
        iconVariant="notFound"
      />
    </main>
  );
}
