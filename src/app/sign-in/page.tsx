import { cookies } from "next/headers"
import { findSession } from "@/auth"
import { redirect } from "next/navigation"
import { SignInForm } from "./sign-in-form"

export default function Page() {
  const sessionId = cookies().get("session")?.value
  const session: any = findSession(sessionId)
  if (session) {
    return redirect("/dashboard")
  }

  return <SignInForm />
}
