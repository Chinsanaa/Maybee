import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminSession } from "@/lib/admin-auth";
import { adminLogoutAction } from "@/app/actions/admin-auth-actions";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Settings,
  LogOut,
  ExternalLink,
  Link2,
  MapPin,
  Star,
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/settings/locations", label: "Locations", icon: MapPin },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/settings/redirects", label: "SEO Redirects", icon: Link2 },
];

export default async function AdminDashboardLayout({ children }: { children: ReactNode }) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-60 shrink-0 border-r border-brand-gray-light bg-white p-4 md:block">
        <p className="font-display px-2 text-lg font-extrabold text-brand-ink">Maybee Admin</p>
        <nav className="mt-6 space-y-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-brand-ink hover:bg-brand-cream"
            >
              <item.icon className="h-4 w-4" aria-hidden />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-8 border-t border-brand-gray-light pt-4">
          <Link
            href="/mn"
            target="_blank"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-brand-gray hover:bg-brand-cream"
          >
            <ExternalLink className="h-4 w-4" aria-hidden />
            View store
          </Link>
          <p className="px-3 py-1 text-xs text-brand-gray">{session.email}</p>
          <form action={adminLogoutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-brand-gray hover:bg-brand-cream"
            >
              <LogOut className="h-4 w-4" aria-hidden />
              Sign out
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
