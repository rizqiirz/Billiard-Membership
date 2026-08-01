import Link from "next/link";
import { UserPlus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Member } from "@/lib/types";
import MembersTable from "@/components/members/members-table";
import ExportExcelButton from "@/components/members/export-excel-button";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function MembersPage() {
  const supabase = createClient();

  const { data } = await supabase
    .from("members")
    .select("*")
    .order("created_at", { ascending: false });

  const members = (data ?? []) as Member[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Data Member
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Kelola seluruh data member billiard
          </p>
        </div>
        <div className="flex items-center gap-2">
          {members.length > 0 && <ExportExcelButton members={members} />}
          <Button asChild>
            <Link href="/members/new">
              <UserPlus className="mr-2 h-4 w-4" />
              Tambah Member
            </Link>
          </Button>
        </div>
      </div>

      <MembersTable members={members} />
    </div>
  );
}
