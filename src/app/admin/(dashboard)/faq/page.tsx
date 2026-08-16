import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createFaqAction, updateFaqAction, deleteFaqAction } from "@/app/actions/admin-faq-actions";

const inputCls = "mt-1 w-full rounded-lg border border-brand-gray-light px-3 py-2 text-sm";
const textareaCls = `${inputCls} min-h-20`;

export default async function AdminFaqPage() {
  const supabase = await createServerSupabaseClient();
  const { data: faqs } = await supabase
    .from("faq")
    .select("*")
    .order("category", { ascending: true })
    .order("sort_order", { ascending: true });

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-brand-ink">FAQ</h1>
      <p className="mt-1 text-sm text-brand-gray">Manage the questions shown on the site-wide FAQ page.</p>

      <div className="mt-6 rounded-card border border-brand-gray-light bg-white p-6">
        <h2 className="font-semibold text-brand-ink">Add question</h2>
        <form action={createFaqAction} className="mt-4 grid gap-3 sm:grid-cols-2">
          <input name="question_mn" placeholder="Question (MN)" required className={`sm:col-span-2 ${inputCls}`} />
          <input name="question_en" placeholder="Question (EN)" className={`sm:col-span-2 ${inputCls}`} />
          <textarea name="answer_mn" placeholder="Answer (MN)" required className={`sm:col-span-2 ${textareaCls}`} />
          <textarea name="answer_en" placeholder="Answer (EN)" className={`sm:col-span-2 ${textareaCls}`} />
          <input name="category" placeholder="Category (general / ordering / products)" defaultValue="general" className={inputCls} />
          <input name="sort_order" type="number" placeholder="Sort order" defaultValue={0} className={inputCls} />
          <button type="submit" className="w-fit rounded-full bg-brand-red px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-red-dark sm:col-span-2">
            Add question
          </button>
        </form>
      </div>

      <div className="mt-6 space-y-4">
        {(faqs ?? []).map((faq) => (
          <div key={faq.id} className="rounded-card border border-brand-gray-light bg-white p-6">
            <form action={updateFaqAction} className="space-y-3">
              <input type="hidden" name="id" value={faq.id} />
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-sm sm:col-span-2">
                  Question (MN)
                  <input name="question_mn" defaultValue={faq.question_mn} className={inputCls} />
                </label>
                <label className="block text-sm sm:col-span-2">
                  Question (EN)
                  <input name="question_en" defaultValue={faq.question_en} className={inputCls} />
                </label>
                <label className="block text-sm sm:col-span-2">
                  Answer (MN)
                  <textarea name="answer_mn" defaultValue={faq.answer_mn} className={textareaCls} />
                </label>
                <label className="block text-sm sm:col-span-2">
                  Answer (EN)
                  <textarea name="answer_en" defaultValue={faq.answer_en} className={textareaCls} />
                </label>
                <label className="block text-sm">
                  Category
                  <input name="category" defaultValue={faq.category} className={inputCls} />
                </label>
                <label className="block text-sm">
                  Sort order
                  <input name="sort_order" type="number" defaultValue={faq.sort_order} className={inputCls} />
                </label>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="is_active" defaultChecked={faq.is_active} />
                  Active
                </label>
                <button type="submit" className="rounded-full bg-brand-ink px-5 py-2 text-sm font-semibold text-white">
                  Save
                </button>
              </div>
            </form>
            <form action={deleteFaqAction} className="mt-3 border-t border-brand-gray-light pt-3">
              <input type="hidden" name="id" value={faq.id} />
              <button type="submit" className="text-xs font-medium text-brand-red hover:underline">
                Delete
              </button>
            </form>
          </div>
        ))}
        {(faqs ?? []).length === 0 && <p className="text-brand-gray">No FAQ entries yet.</p>}
      </div>
    </div>
  );
}
