"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { submitContactAction, type ContactState } from "@/app/actions/contact-actions";

export function ContactForm() {
  const t = useTranslations("contact");
  const [state, formAction, pending] = useActionState<ContactState, FormData>(
    submitContactAction,
    undefined
  );

  if (state?.success) {
    return (
      <p className="rounded-card bg-green-50 p-6 text-sm font-medium text-green-800">
        {t("formSuccess")}
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-brand-ink">
          {t("formName")}
        </label>
        <input
          id="name"
          name="name"
          required
          minLength={2}
          className="mt-1 w-full rounded-lg border border-brand-gray-light px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-brand-ink">
          {t("formPhone")}
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          minLength={6}
          className="mt-1 w-full rounded-lg border border-brand-gray-light px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-brand-ink">
          {t("formMessage")}
        </label>
        <textarea
          id="message"
          name="message"
          required
          minLength={5}
          rows={4}
          className="mt-1 w-full rounded-lg border border-brand-gray-light px-3 py-2 text-sm"
        />
      </div>
      {state?.error && (
        <p role="alert" className="text-sm font-medium text-brand-red">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-brand-red px-6 py-3 text-sm font-bold text-white hover:bg-brand-red-dark disabled:opacity-60"
      >
        {pending ? "..." : t("formSubmit")}
      </button>
    </form>
  );
}
