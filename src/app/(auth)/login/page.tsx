// /login page

import { redirect } from "next/navigation";

import LoginForm from "@/features/auth/components/LoginForm";
import { getWhitelistedDashboardUser } from "@/features/auth/services/serverAuthAccess";

export default async function LoginPage() {
  const user = await getWhitelistedDashboardUser();

  if (user) {
    redirect("/dashboard");
  }

  return <LoginForm />;
}
