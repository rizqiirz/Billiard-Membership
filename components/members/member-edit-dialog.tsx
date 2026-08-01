"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import MemberForm from "@/components/members/member-form";
import type { Member } from "@/lib/types";

export default function MemberEditDialog({
  member,
  open,
  onOpenChange,
}: {
  member: Member;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Member</DialogTitle>
          <DialogDescription>
            Perbarui data member "{member.nama}"
          </DialogDescription>
        </DialogHeader>
        <MemberForm member={member} onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
