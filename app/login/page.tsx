import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import LoginForm from "@/components/login-form";

export const metadata: Metadata = {
  title: "Masuk — Admin Membership Lunnar",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const envReady = Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes("xxxx") &&
    !supabaseAnonKey.includes("your-anon-key"),
  );

  // Tampilkan panduan setup bila env Supabase belum dikonfigurasi
  if (!envReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md rounded-xl border border-slate-100 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-6 text-center space-y-2">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-lg text-primary-foreground">
              🎱
            </div>
            <h1 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              Konfigurasi Supabase Diperlukan
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Isi environment variable untuk menghubungkan aplikasi ke Supabase.
            </p>
          </div>
          <ol className="list-decimal space-y-2.5 pl-5 text-sm text-slate-600 dark:text-slate-300">
            <li>
              Buka file{" "}
              <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                .env.local
              </code>{" "}
              di root proyek.
            </li>
            <li>
              Isi{" "}
              <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                NEXT_PUBLIC_SUPABASE_URL
              </code>{" "}
              dengan URL project Supabase.
            </li>
            <li>
              Isi{" "}
              <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                NEXT_PUBLIC_SUPABASE_ANON_KEY
              </code>{" "}
              dengan anon key dari{" "}
              <strong className="text-slate-900 dark:text-slate-100">
                Supabase → Settings → API
              </strong>
              .
            </li>
            <li>
              Simpan lalu restart server (
              <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                npm run dev
              </code>
              ).
            </li>
          </ol>
        </div>
      </div>
    );
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/");

  const error = searchParams?.error;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-xl text-primary-foreground">
            🎱
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Admin Membership Lunnar
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Masuk untuk mengelola data member
          </p>
        </div>

        <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <LoginForm error={error} />
        </div>

        <p className="text-center text-xs text-slate-400 dark:text-slate-500">
          Khusus admin — member tidak memiliki akses login
        </p>
      </div>
    </div>
  );
}
