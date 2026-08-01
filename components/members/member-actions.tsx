"use client";

import { useState } from "react";
import { Eye, Pencil, CalendarPlus, Trash2, Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import MemberDetailDialog from "@/components/members/member-detail-dialog";
import MemberEditDialog from "@/components/members/member-edit-dialog";
import MemberExtendDialog from "@/components/members/member-extend-dialog";
import { deleteMember } from "@/lib/actions";
import type { Member } from "@/lib/types";

export default function MemberActions({ member }: { member: Member }) {
  const [detailOpen, setDetailOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [extendOpen, setExtendOpen] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    if (
      !confirm(
        `Yakin ingin menghapus member "${member.nama}"?\nRiwayat perpanjangan juga akan ikut terhapus.`,
      )
    ) {
      return;
    }
    setPending(true);
    await deleteMember(member.id);
    setPending(false);
  }

  return (
    <TooltipProvider delayDuration={150}>
      <div className="flex items-center justify-end gap-0.5">
        {/* Detail */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              title="Detail"
              onClick={() => setDetailOpen(true)}
              className="rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <Eye className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Detail</TooltipContent>
        </Tooltip>

        {/* Edit */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              title="Edit"
              onClick={() => setEditOpen(true)}
              className="rounded-md p-2 text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:text-slate-500 dark:hover:bg-blue-500/15 dark:hover:text-blue-400"
            >
              <Pencil className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Edit</TooltipContent>
        </Tooltip>

        {/* Perpanjang */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              title="Perpanjang"
              onClick={() => setExtendOpen(true)}
              className="rounded-md p-2 text-slate-400 transition-colors hover:bg-emerald-50 hover:text-emerald-600 dark:text-slate-500 dark:hover:bg-emerald-500/15 dark:hover:text-emerald-400"
            >
              <CalendarPlus className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Perpanjang</TooltipContent>
        </Tooltip>

        {/* Hapus */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              title="Hapus"
              onClick={handleDelete}
              disabled={pending}
              className="rounded-md p-2 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50 dark:text-slate-500 dark:hover:bg-rose-500/15 dark:hover:text-rose-400"
            >
              {pending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent>Hapus</TooltipContent>
        </Tooltip>
      </div>

      {/* Dialogs */}
      <MemberDetailDialog
        member={member}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
      <MemberEditDialog
        member={member}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
      <MemberExtendDialog
        member={member}
        open={extendOpen}
        onOpenChange={setExtendOpen}
      />
    </TooltipProvider>
  );
}
