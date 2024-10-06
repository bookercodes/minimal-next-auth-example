"use server"

import { z } from "zod"
import db from "@/db"
import { compare, hash } from "bcrypt"
import { deleteSession, startSession } from "./auth"
import { redirect } from "next/navigation"

const SignUpSchema = z.object({
  username: z.string(),
  password: z
    .string()
    .min(8, { message: "Be at least 8 characters long" })
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    .regex(/[0-9]/, { message: "Contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Contain at least one special character."
    })
    .trim()
})

const SignInSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1)
})

export type ActionState = {
  errors?: {
    username?: string[]
    password?: string[]
  }
  message?: string
}

export async function signIn(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const validatedFields = SignInSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password")
  })
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors
    }
  }

  const user: any = db
    .prepare("SELECT * FROM users WHERE name = ?")
    .get(validatedFields.data.username)

  if (!user) {
    return { message: "Invalid login credentials." }
  }

  const passwordIsValid = await compare(
    validatedFields.data.password,
    user.password
  )
  if (!passwordIsValid) {
    return { message: "Invalid login credentials." }
  }

  startSession(user.user_id)
  redirect("/dashboard")
}

export async function signUp(
  _prevState: ActionState,
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

  const hashedPassword = await hash(validatedFields.data.password, 10)

  try {
    const userId = db
      .prepare("INSERT INTO users (name, password) VALUES (?, ?)")
      .run(validatedFields.data.username, hashedPassword).lastInsertRowid
    startSession(userId)
  } catch (error) {
    console.error(error)
    return {
      message: "An unexpected error occured."
    }
  }
  redirect("/dashboard")
}

export async function signOut() {
  deleteSession()
}
