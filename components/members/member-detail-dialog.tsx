"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import MemberAvatar from "@/components/members/member-avatar";
import type { Member } from "@/lib/types";
import {
  formatTanggal,
  getStatus,
  statusLabel,
  statusBadgeVariant,
} from "@/lib/utils";

export default function MemberDetailDialog({
  member,
  open,
  onOpenChange,
}: {
  member: Member;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const status = getStatus(member.tanggal_selesai);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-3">
              <MemberAvatar
                nama={member.nama}
                fotoUrl={member.foto_url}
                size="lg"
              />
              <span>{member.nama}</span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-1">
          <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-2.5 text-sm dark:bg-slate-800/50">
            <span className="text-slate-500 dark:text-slate-400">Status</span>
            <Badge variant={statusBadgeVariant[status]}>
              {statusLabel[status]}
            </Badge>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-2.5 text-sm dark:bg-slate-800/50">
            <span className="text-slate-500 dark:text-slate-400">No. HP</span>
            <span className="font-medium text-slate-800 dark:text-slate-200">
              {member.no_hp || "-"}
            </span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-2.5 text-sm dark:bg-slate-800/50">
            <span className="text-slate-500 dark:text-slate-400">No. KTP</span>
            <span className="font-medium text-slate-800 dark:text-slate-200">
              {member.no_ktp || "-"}
            </span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-2.5 text-sm dark:bg-slate-800/50">
            <span className="text-slate-500 dark:text-slate-400">Alamat</span>
            <span className="max-w-[200px] truncate text-right font-medium text-slate-800 dark:text-slate-200">
              {member.alamat || "-"}
            </span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-2.5 text-sm dark:bg-slate-800/50">
            <span className="text-slate-500 dark:text-slate-400">
              Tanggal Mulai
            </span>
            <span className="font-medium text-slate-800 dark:text-slate-200">
              {formatTanggal(member.tanggal_mulai)}
            </span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-2.5 text-sm dark:bg-slate-800/50">
            <span className="text-slate-500 dark:text-slate-400">
              Tanggal Selesai
            </span>
            <span className="font-medium text-slate-800 dark:text-slate-200">
              {formatTanggal(member.tanggal_selesai)}
            </span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-2.5 text-sm dark:bg-slate-800/50">
            <span className="text-slate-500 dark:text-slate-400">
              Jumlah Bulan
            </span>
            <span className="font-medium text-slate-800 dark:text-slate-200">
              {member.jumlah_bulan} bulan
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
