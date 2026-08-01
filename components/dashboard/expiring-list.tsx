import Link from "next/link";
import { CalendarClock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Member } from "@/lib/types";
import {
  formatTanggal,
  getStatus,
  statusLabel,
  statusBadgeVariant,
} from "@/lib/utils";

export default function ExpiringList({ members }: { members: Member[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarClock className="h-4 w-4 text-amber-500" />
          Akan Segera Habis
        </CardTitle>
        <CardDescription>
          Member yang masa aktifnya habis dalam 7 hari ke depan
        </CardDescription>
      </CardHeader>
      <CardContent>
        {members.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-400 dark:text-slate-500">
            Tidak ada member yang akan segera habis
          </p>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {members.map((m) => {
              const status = getStatus(m.tanggal_selesai);
              return (
                <li
                  key={m.id}
                  className="flex items-center justify-between gap-4 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                      {m.nama}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      Habis: {formatTanggal(m.tanggal_selesai)}
                    </p>
                  </div>
                  <Badge variant={statusBadgeVariant[status]}>
                    {statusLabel[status]}
                  </Badge>
                </li>
              );
            })}
          </ul>
        )}
        <div className="mt-4">
          <Link
            href="/members"
            className="text-sm font-medium text-primary hover:underline"
          >
            Lihat semua member →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
