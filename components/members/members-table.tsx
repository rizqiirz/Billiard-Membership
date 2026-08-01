"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import MemberActions from "@/components/members/member-actions";
import MemberAvatar from "@/components/members/member-avatar";
import type { Member } from "@/lib/types";
import {
  formatTanggal,
  getStatus,
  statusLabel,
  statusBadgeVariant,
} from "@/lib/utils";

export default function MembersTable({ members }: { members: Member[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return members;
    return members.filter((m) => {
      return (
        m.nama.toLowerCase().includes(q) ||
        m.no_hp.toLowerCase().includes(q) ||
        m.no_ktp.toLowerCase().includes(q) ||
        m.alamat.toLowerCase().includes(q)
      );
    });
  }, [members, query]);

  const isSearching = query.trim().length > 0;

  return (
    <div className="rounded-xl border border-slate-100 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900">
      {/* Search bar */}
      <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama, no. HP, KTP, alamat..."
            className="pl-9 pr-9"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Hapus pencarian"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500">
          Menampilkan {filtered.length} dari {members.length} member
        </p>
      </div>

      {/* Table wrapper with horizontal scroll untuk mobile */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-10 sm:w-12">No</TableHead>
              <TableHead className="min-w-[140px]">Nama</TableHead>
              <TableHead className="hidden sm:table-cell">No. HP</TableHead>
              <TableHead className="hidden lg:table-cell">Mulai</TableHead>
              <TableHead className="hidden lg:table-cell">Selesai</TableHead>
              <TableHead className="hidden sm:table-cell">Durasi</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="py-10 text-center text-slate-400 dark:text-slate-500"
                >
                  {isSearching ? (
                    <div className="flex flex-col items-center gap-2">
                      <Search className="h-6 w-6 text-slate-300 dark:text-slate-600" />
                      <p className="text-sm">
                        Member tidak ditemukan untuk pencarian{" "}
                        <span className="font-semibold">"{query}"</span>.
                      </p>
                      <button
                        type="button"
                        onClick={() => setQuery("")}
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        Hapus pencarian
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm">
                      Belum ada data member. Klik "Tambah Member" untuk
                      menambahkan.
                    </p>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((m, index) => {
                const status = getStatus(m.tanggal_selesai);
                return (
                  <TableRow key={m.id}>
                    <TableCell className="text-slate-400 dark:text-slate-500">
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <MemberAvatar
                          nama={m.nama}
                          fotoUrl={m.foto_url}
                          size="sm"
                          expandable
                        />
                        <span className="truncate font-medium text-slate-900 dark:text-slate-100">
                          {m.nama}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden text-slate-500 sm:table-cell dark:text-slate-400">
                      {m.no_hp}
                    </TableCell>
                    <TableCell className="hidden text-slate-500 lg:table-cell dark:text-slate-400">
                      {formatTanggal(m.tanggal_mulai)}
                    </TableCell>
                    <TableCell className="hidden text-slate-500 lg:table-cell dark:text-slate-400">
                      {formatTanggal(m.tanggal_selesai)}
                    </TableCell>
                    <TableCell className="hidden text-slate-500 sm:table-cell dark:text-slate-400">
                      {m.jumlah_bulan} bln
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={statusBadgeVariant[status]}
                        className="whitespace-nowrap"
                      >
                        {statusLabel[status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <MemberActions member={m} />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
