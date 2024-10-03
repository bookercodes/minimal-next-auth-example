"use server"

import { z } from "zod"
import db from "@/db"
import bcrypt from "bcrypt"

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

  try {
    const stmt = db.prepare("INSERT INTO users (name, password) VALUES (?, ?)")
    stmt.run(username, password)
  } catch (error) {
    console.error(error)
    return {
      message: `An unexpected error occured.`
    }
  }

  return {
    message: `User ${username} signed up successfully!`
  }
}
