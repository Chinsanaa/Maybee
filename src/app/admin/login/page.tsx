"use client";

import { useActionState } from "react";
import { adminLoginAction, type LoginState } from "@/app/actions/admin-auth-actions";

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
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-brand-ink">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 w-full rounded-lg border border-brand-gray-light px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-brand-ink">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              className="mt-1 w-full rounded-lg border border-brand-gray-light px-3 py-2 text-sm"
            />
          </div>
          {state?.error && <p className="text-sm font-medium text-brand-red">{state.error}</p>}
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-full bg-brand-red px-6 py-3 text-sm font-bold text-white hover:bg-brand-red-dark disabled:opacity-60"
          >
            {pending ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
