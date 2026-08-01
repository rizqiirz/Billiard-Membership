"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ThemeToggle({ collapsed }: { collapsed?: boolean }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  // Baca tema dari localStorage saat pertama kali render
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("theme");
    if (stored === "dark" || stored === "light") {
      setTheme(stored);
      document.documentElement.classList.toggle("dark", stored === "dark");
    } else {
      // Default: ikuti preferensi sistem
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      setTheme(prefersDark ? "dark" : "light");
      document.documentElement.classList.toggle("dark", prefersDark);
    }
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  }

  // Cegah mismatch saat SSR (render kosong sampai mounted)
  if (!mounted) {
    return (
      <div
        className={cn(
          "flex h-9 items-center rounded-lg text-sm font-medium text-slate-600 transition-colors",
          collapsed ? "w-9 justify-center" : "w-full px-3",
        )}
      >
        <div className="h-4 w-4 animate-pulse rounded-full bg-slate-200" />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      title={theme === "dark" ? "Mode terang" : "Mode gelap"}
      className={cn(
        "flex h-9 items-center gap-3 rounded-lg text-sm font-medium transition-colors",
        collapsed
          ? "w-9 justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          : "w-full px-3 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100",
      )}
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 shrink-0" />
      ) : (
        <Moon className="h-4 w-4 shrink-0" />
      )}
      {!collapsed && (theme === "dark" ? "Mode Terang" : "Mode Gelap")}
    </button>
  );
}
