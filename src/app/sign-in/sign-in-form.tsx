"use client"

import { useFormState, useFormStatus } from "react-dom"
import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import { signIn, ActionState } from "@/actions"

const initialState: ActionState = {}

function Submit() {
  const status = useFormStatus()
  return <Button disabled={status.pending}>winp</Button>
}

export function SignInForm() {
  const [state, action] = useFormState(signIn, initialState)
  const formRef = useRef<HTMLFormElement>(null)
  const { pending } = useFormStatus()

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
        <CardDescription>Authenticate to continue G</CardDescription>
      </CardHeader>
      <form ref={formRef} action={action}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="Enter your username"
              required
            />
            {state.errors?.username && (
              <p className="text-sm text-red-500">{state.errors.username}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              required
            />
            {state.errors?.password && (
              <p className="text-sm text-red-500">{state.errors.password}</p>
            )}
          </div>
          {state.message && (
            <div className="text-green-500 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>{state.message}</span>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Submit />
        </CardFooter>
      </form>
    </Card>
  )
}
