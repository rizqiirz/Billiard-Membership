import { format, subMonths } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { getStatus } from "@/lib/utils";
import type { Member } from "@/lib/types";
import StatCards from "@/components/dashboard/stat-cards";
import RegistrationChart, {
  type RegistrationDatum,
} from "@/components/dashboard/registration-chart";
import ExpiringList from "@/components/dashboard/expiring-list";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = createClient();

  const { data: members } = await supabase
    .from("members")
    .select("*")
    .order("created_at", { ascending: false });

  const all = (members ?? []) as Member[];

  // Hitung status on-the-fly
  let aktif = 0;
  let expired = 0;
  let akanExpired = 0;
  for (const m of all) {
    const status = getStatus(m.tanggal_selesai);
    if (status === "aktif") aktif++;
    else if (status === "expired") expired++;
    else akanExpired++;
  }

  // Member yang akan expired dalam 7 hari (termasuk yang sudah expired tapi dekat)
  const expiringSoon = all
    .filter((m) => getStatus(m.tanggal_selesai) !== "aktif")
    .sort(
      (a, b) =>
        new Date(a.tanggal_selesai).getTime() -
        new Date(b.tanggal_selesai).getTime(),
    )
    .slice(0, 5);

  // Data grafik pendaftar 6 bulan terakhir
  const today = new Date();
  const months: RegistrationDatum[] = [];
  for (let i = 5; i >= 0; i--) {
    const start = subMonths(today, i);
    months.push({
      bulan: format(start, "M"),
      jumlah: 0,
    });
  }

  for (const m of all) {
    const start = new Date(m.tanggal_mulai);
    const diffMonths =
      (today.getFullYear() - start.getFullYear()) * 12 +
      (today.getMonth() - start.getMonth());
    if (diffMonths >= 0 && diffMonths < 6) {
      const idx = 5 - diffMonths;
      months[idx]!.jumlah += 1;
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Dashboard
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Ringkasan membership billiard
        </p>
      </div>

      <StatCards
        total={all.length}
        aktif={aktif}
        expired={expired}
        akanExpired={akanExpired}
      />

      <RegistrationChart data={months} />

      <ExpiringList members={expiringSoon} />
    </div>
  );
}
