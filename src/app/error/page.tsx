import { Metadata } from "next";

import ErrorHomeLink from "@/components/error/ErrorHomeLink";
import ErrorPanel from "@/components/error/ErrorPanel";

export const metadata: Metadata = {
  title: "Error - Something went wrong",
};

export default function ErrorPage() {
  return (
    <main>
      <ErrorPanel
        title="Oops! Something went wrong."
        description="We encountered an unexpected error while processing your request. Please try again later or contact support if the problem persists."
        titleAs="h1"
        cardClassName="flex max-w-md flex-col items-center rounded-2xl bg-white p-8 shadow-xl"
        action={<ErrorHomeLink />}
      />
    </main>
  );
}
