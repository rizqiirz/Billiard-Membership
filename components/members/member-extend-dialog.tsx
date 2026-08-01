"use client";

import { useState, useTransition } from "react";
import { addMonths, format } from "date-fns";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { extendMembership } from "@/lib/actions";
import type { Member } from "@/lib/types";
import {
  formatTanggal,
  getStatus,
  statusLabel,
  statusBadgeVariant,
} from "@/lib/utils";

export default function MemberExtendDialog({
  member,
  open,
  onOpenChange,
}: {
  member: Member;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const status = getStatus(member.tanggal_selesai);
  const isExpired = status === "expired";

  // Logika perpanjangan:
  // - Masih aktif  -> dihitung dari tanggal_selesai saat ini
  // - Sudah expired -> dihitung dari hari ini
  const baseDate = isExpired ? new Date() : new Date(member.tanggal_selesai);
  const preview1 = format(addMonths(baseDate, 1), "yyyy-MM-dd");
  const preview3 = format(addMonths(baseDate, 3), "yyyy-MM-dd");

  function handleExtend(durasi: number) {
    setError(null);
    startTransition(async () => {
      const result = await extendMembership(member, durasi);
      if (result?.error) {
        setError(result.error);
        return;
      }
      // Aksi berhasil → tutup dialog otomatis
      onOpenChange(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Perpanjang Membership</DialogTitle>
          <DialogDescription>
            Perpanjang masa aktif untuk {member.nama}
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg bg-slate-50 p-4 text-sm dark:bg-slate-800/50">
          <div className="flex justify-between py-1">
            <span className="text-slate-500 dark:text-slate-400">Status</span>
            <Badge variant={statusBadgeVariant[status]}>
              {statusLabel[status]}
            </Badge>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-500 dark:text-slate-400">
              Tanggal Selesai saat ini
            </span>
            <span className="font-medium text-slate-800 dark:text-slate-200">
              {formatTanggal(member.tanggal_selesai)}
            </span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-500 dark:text-slate-400">
              Durasi saat ini
            </span>
            <span className="font-medium text-slate-800 dark:text-slate-200">
              {member.jumlah_bulan} bulan
            </span>
          </div>
          <div className="mt-2 border-t border-slate-200 pt-2 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
            {isExpired ? (
              <p>
                Member sudah <b>tidak aktif</b>. Perpanjangan dihitung mulai{" "}
                <b>hari ini</b> ({formatTanggal(new Date())}).
              </p>
            ) : (
              <p>
                Member masih <b>aktif</b>. Perpanjangan dihitung dari tanggal
                selesai saat ini ({formatTanggal(member.tanggal_selesai)}).
              </p>
            )}
          </div>
        </div>

        {error ? (
          <div className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600 dark:bg-rose-500/15 dark:text-rose-400">
            {error}
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <Button
              onClick={() => handleExtend(1)}
              disabled={pending}
              className="w-full"
            >
              {pending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              +1 Bulan
            </Button>
            <p className="text-center text-xs text-slate-500 dark:text-slate-400">
              Selesai:{" "}
              <span className="font-medium text-slate-700 dark:text-slate-200">
                {formatTanggal(preview1)}
              </span>
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              onClick={() => handleExtend(3)}
              disabled={pending}
              variant="outline"
              className="w-full"
            >
              +3 Bulan
            </Button>
            <p className="text-center text-xs text-slate-500 dark:text-slate-400">
              Selesai:{" "}
              <span className="font-medium text-slate-700 dark:text-slate-200">
                {formatTanggal(preview3)}
              </span>
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-400 dark:text-slate-500">
          Durasi total akan bertambah otomatis sesuai bulan yang dipilih.
        </p>
      </DialogContent>
    </Dialog>
  );
}
