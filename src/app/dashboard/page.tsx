import { auth } from "@/auth"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import LogoutButton from "./sign-out-btn"

export default function Page() {
  const { username, isSignedIn } = auth()

  if (!isSignedIn) {
    return redirect("/sign-in")
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Hello {username}</p>
      <LogoutButton />
    </div>
  )
}
