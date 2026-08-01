"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { addMonths, format } from "date-fns";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createMember, updateMember } from "@/lib/actions";
import type { Member } from "@/lib/types";

export default function MemberForm({
  member,
  onSuccess,
}: {
  member?: Member;
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [tanggalMulai, setTanggalMulai] = useState(member?.tanggal_mulai ?? "");
  const [jumlahBulan, setJumlahBulan] = useState<number>(
    member?.jumlah_bulan ?? 1,
  );

  const isEdit = !!member;

  // Hitung tanggal_selesai otomatis (preview) menggunakan date-fns
  let previewSelesai = "-";
  if (tanggalMulai && jumlahBulan > 0) {
    const mulai = new Date(tanggalMulai);
    if (!isNaN(mulai.getTime())) {
      previewSelesai = format(addMonths(mulai, jumlahBulan), "dd MMM yyyy");
    }
  }

  function handleSubmit(formData: FormData) {
    setError(null);
    const input = {
      nama: String(formData.get("nama") ?? "").trim(),
      no_hp: String(formData.get("no_hp") ?? "").trim(),
      no_ktp: String(formData.get("no_ktp") ?? "").trim(),
      alamat: String(formData.get("alamat") ?? "").trim(),
      tanggal_mulai: String(formData.get("tanggal_mulai") ?? ""),
      jumlah_bulan: Number(formData.get("jumlah_bulan") ?? 1),
    };

    if (!input.nama || !input.no_hp || !input.no_ktp || !input.tanggal_mulai) {
      setError("Lengkapi semua field yang wajib diisi.");
      return;
    }

    startTransition(async () => {
      const result = isEdit
        ? await updateMember(member!.id, input)
        : await createMember(input);

      if (result?.error) {
        setError(result.error);
        return;
      }

      if (onSuccess) {
        // Mode dialog → tutup dialog, refresh data
        onSuccess();
        router.refresh();
      } else {
        // Mode halaman penuh → langsung kembali ke daftar member
        router.push("/members");
        router.refresh();
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      {error ? (
        <div className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600 dark:bg-rose-500/15 dark:text-rose-400">
          {error}
        </div>
      ) : null}

      <div className="space-y-1.5">
        <Label htmlFor="nama">Nama *</Label>
        <Input
          id="nama"
          name="nama"
          defaultValue={member?.nama}
          placeholder="Nama lengkap member"
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="no_hp">No. HP *</Label>
          <Input
            id="no_hp"
            name="no_hp"
            defaultValue={member?.no_hp}
            placeholder="08xxxxxxxxxx"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="no_ktp">No. KTP *</Label>
          <Input
            id="no_ktp"
            name="no_ktp"
            defaultValue={member?.no_ktp}
            placeholder="16 digit NIK"
            required
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="alamat">Alamat</Label>
        <Input
          id="alamat"
          name="alamat"
          defaultValue={member?.alamat}
          placeholder="Alamat lengkap"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="tanggal_mulai">Tanggal Mulai *</Label>
          <Input
            id="tanggal_mulai"
            name="tanggal_mulai"
            type="date"
            value={tanggalMulai}
            onChange={(e) => setTanggalMulai(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="jumlah_bulan">Jumlah Bulan *</Label>
          <Input
            id="jumlah_bulan"
            name="jumlah_bulan"
            type="number"
            min={1}
            value={jumlahBulan}
            onChange={(e) => setJumlahBulan(Number(e.target.value))}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label>Tanggal Selesai</Label>
          <div className="flex h-9 items-center rounded-lg border border-primary/20 bg-primary/5 px-3 text-sm font-medium text-primary">
            {previewSelesai}
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-400 dark:text-slate-500">
        * Tanggal selesai dihitung otomatis = tanggal mulai + jumlah bulan.
      </p>

      <div className="flex gap-3 pt-1">
        {!onSuccess && (
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Batal
          </Button>
        )}
        <Button type="submit" disabled={pending}>
          {pending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...
            </>
          ) : isEdit ? (
            "Simpan Perubahan"
          ) : (
            "Tambah Member"
          )}
        </Button>
      </div>
    </form>
  );
}
