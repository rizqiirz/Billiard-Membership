"use client";

import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatTanggal } from "@/lib/utils";
import type { Member } from "@/lib/types";

export default function ExportExcelButton({ members }: { members: Member[] }) {
  async function handleExport() {
    // Lazy-load xlsx hanya saat tombol diklik → mengurangi bundle awal halaman /members
    const XLSX = await import("xlsx");

    const rows = members.map((m, idx) => ({
      No: idx + 1,
      Nama: m.nama,
      "No. HP": m.no_hp,
      "No. KTP": m.no_ktp,
      Alamat: m.alamat,
      "Tanggal Mulai": formatTanggal(m.tanggal_mulai, "dd/MM/yyyy"),
      "Jumlah Bulan": m.jumlah_bulan,
      "Tanggal Selesai": formatTanggal(m.tanggal_selesai, "dd/MM/yyyy"),
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);

    // Lebar kolom otomatis
    worksheet["!cols"] = [
      { wch: 5 },
      { wch: 25 },
      { wch: 15 },
      { wch: 20 },
      { wch: 30 },
      { wch: 15 },
      { wch: 12 },
      { wch: 15 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Member");
    XLSX.writeFile(workbook, "data-member-billiard.xlsx");
  }

  return (
    <Button variant="outline" onClick={handleExport}>
      <FileDown className="mr-2 h-4 w-4" />
      Export Excel
    </Button>
  );
}
