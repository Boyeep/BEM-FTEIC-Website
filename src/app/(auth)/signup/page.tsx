// /signup page

import { redirect } from "next/navigation";

import SignupForm from "@/features/auth/components/SignupForm";
import { getAdminDashboardUser } from "@/features/auth/services/serverAuthAccess";

export default async function SignupPage() {
  const user = await getAdminDashboardUser();

  if (user) {
    redirect("/dashboard");
  }

  return <SignupForm />;
}
