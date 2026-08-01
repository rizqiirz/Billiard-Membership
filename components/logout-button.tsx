"use client";

import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/actions";

export default function LogoutButton({ collapsed }: { collapsed?: boolean }) {
  function handleConfirm(e: React.MouseEvent<HTMLButtonElement>) {
    if (!confirm("Yakin ingin keluar dari aplikasi?")) {
      e.preventDefault();
    }
  }

  return (
    <form action={logout} className="w-full">
      <button
        type="submit"
        onClick={handleConfirm}
        title={collapsed ? "Logout" : undefined}
        className={cn(
          "flex w-full items-center gap-3 rounded-lg py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:text-slate-300 dark:hover:bg-rose-500/15 dark:hover:text-rose-400",
          collapsed ? "justify-center px-0" : "px-3",
        )}
      >
        <LogOut className="h-4 w-4 shrink-0" />
        {!collapsed && "Logout"}
      </button>
    </form>
  );
}
