"use server"

import { z } from "zod"
import db from "@/db"
import bcrypt from "bcrypt"
import { createSession } from "./auth"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const SignUpSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(8, "Password must be at least 8 characters")
})

export type ActionState = {
  errors?: {
    username?: string[]
    password?: string[]
  }
  message?: string
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
