import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import MemberForm from "@/components/members/member-form";

export const metadata: Metadata = {
  title: "Tambah Member — Admin Membership Lunnar",
};

export const dynamic = "force-dynamic";

export default async function NewMemberPage() {
  // Memastikan halaman hanya diakses admin yang login (guard tambahan)
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Tambah Member
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Isi data member baru. Tanggal selesai dihitung otomatis.
        </p>
      </div>

      <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <MemberForm />
      </div>
    </div>
  );
}
