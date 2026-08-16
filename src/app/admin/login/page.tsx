"use client";

import { useActionState } from "react";
import { adminLoginAction, type LoginState } from "@/app/actions/admin-auth-actions";
import { TextField } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    adminLoginAction,
    undefined
  );

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-card border border-brand-gray-light bg-white p-8">
        <h1 className="font-display text-xl font-extrabold text-brand-ink">Maybee Admin</h1>
        <p className="mt-1 text-sm text-brand-gray">Sign in to manage the store.</p>

        <form action={formAction} className="mt-6 space-y-4">
          <TextField id="email" name="email" type="email" label="Email" required />
          <TextField id="password" name="password" type="password" label="Password" required minLength={6} />
          {state?.error && <p className="text-sm font-medium text-brand-red">{state.error}</p>}
          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}
