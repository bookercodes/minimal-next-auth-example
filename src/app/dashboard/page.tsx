import { findSession } from "@/auth"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default function Page() {
  const sessionId = cookies().get("session")?.value
  const session: any = findSession(sessionId)
  console.log("session", session)

  if (!session) {
    return redirect("/sign-in")
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Hello {session.user_name}</p>
    </div>
  )
}
