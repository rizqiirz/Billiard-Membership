import { createClient } from "@/lib/supabase/server";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatTanggalWaktu } from "@/lib/utils";

export const dynamic = "force-dynamic";

type HistoryRow = {
  id: string;
  tanggal: string;
  aksi: string;
  durasi: number | null;
  admin: string | null;
  members: { nama: string }[] | { nama: string } | null;
};

export default async function HistoryPage() {
  const supabase = createClient();

  const { data } = await supabase
    .from("membership_history")
    .select("id, tanggal, aksi, durasi, admin, members(nama)")
    .order("tanggal", { ascending: false });

  const rows = (data ?? []) as unknown as HistoryRow[];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Riwayat Perpanjangan
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Seluruh aktivitas membership: member baru & perpanjangan
        </p>
      </div>

      <div className="rounded-xl border border-slate-100 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Tanggal</TableHead>
              <TableHead>Member</TableHead>
              <TableHead>Aksi</TableHead>
              <TableHead>Durasi</TableHead>
              <TableHead>Admin</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-10 text-center text-slate-400 dark:text-slate-500"
                >
                  Belum ada riwayat membership.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="text-slate-500 dark:text-slate-400">
                    {formatTanggalWaktu(r.tanggal)}
                  </TableCell>
                  <TableCell className="font-medium text-slate-900 dark:text-slate-100">
                    {Array.isArray(r.members)
                      ? (r.members?.[0]?.nama ?? "Member terhapus")
                      : (r.members?.nama ?? "Member terhapus")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={r.aksi === "Member Baru" ? "default" : "warning"}
                    >
                      {r.aksi}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-500 dark:text-slate-400">
                    {r.durasi ? `${r.durasi} bulan` : "-"}
                  </TableCell>
                  <TableCell className="text-slate-500 dark:text-slate-400">
                    {r.admin ?? "-"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
