import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

// const protectedRoutes = ["/dashboard"]

export default async function middleware(req: NextRequest) {
  // const path = req.nextUrl.pathname
  // const isProtectedRoute = protectedRoutes.includes(path)
  // // const sessionId = cookies().get("session")?.value
  // // const session: any = findSession(sessionId)
  // // todo check if session is expired
  // console.log("session", session)
  // if (isProtectedRoute && !session.userId) {
  //   return NextResponse.redirect("/login")
  // }
  // check if session exists in database and is still valid
}
