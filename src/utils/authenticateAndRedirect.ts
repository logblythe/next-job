import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export function authenticateAndRedirect(): string {
  const { userId } = auth();
  console.log("🚀 ~ authenticateAndRedirect ~ userId:", userId);
  if (!userId) {
    redirect("/");
  }
  return userId;
}
