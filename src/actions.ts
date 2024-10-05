"use server"

import { z } from "zod"
import db from "@/db"
import bcrypt from "bcrypt"
import { createSession } from "./auth"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { error } from "console"

const SignUpSchema = z.object({
  username: z.string(),
  password: z.string()
})

const SignInSchema = z.object({
  username: z.string(),
  password: z.string()
})

export type ActionState = {
  errors?: {
    username?: string[]
    password?: string[]
  }
  message?: string
}

export async function signIn(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const validatedFields = SignInSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password")
  })

  const errorMessage = { message: "Invalid login credentials." }

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors
    }
  }

  const stmt = db.prepare("SELECT * FROM users WHERE name = ?")
  const user: any = stmt.get(validatedFields.data.username)

  if (!user) {
    return errorMessage
  }

  const passwordMatch = await bcrypt.compare(
    validatedFields.data.password,
    user.password
  )

  if (!passwordMatch) {
    return errorMessage
  }

  const sesh = createSession(user.user_id)
  console.log("sesh", sesh)
  const sesh_id = sesh?.id

  cookies().set("session", `${sesh_id}`, {
    httpOnly: true,
    secure: true,
    expires: sesh?.endTime,
    sameSite: "lax",
    path: "/"
  })

  redirect("/dashboard")
  return { message: "success" }
}

export async function signUp(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const validatedFields = SignUpSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password")
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors
    }
  }

  let { username, password } = validatedFields.data

  password = await bcrypt.hash(password, 10) // Hash the password

  await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call

  try {
    const stmt = db.prepare("INSERT INTO users (name, password) VALUES (?, ?)")
    const res = stmt.run(username, password)
    const userId = res.lastInsertRowid

    const sesh = createSession(userId)
    const sesh_id = sesh?.id

    cookies().set("session", `${sesh_id}`, {
      httpOnly: true,
      secure: true,
      expires: sesh?.endTime,
      sameSite: "lax",
      path: "/"
    })
  } catch (error) {
    console.error(error)
    return {
      message: `An unexpected error occured.`
    }
  }

  redirect("/dashboard")
}

export async function signOut() {
  cookies().delete("session")
  redirect("/")
}
