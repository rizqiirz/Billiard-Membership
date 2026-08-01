"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { addMonths, format } from "date-fns";
import { Camera, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createMember, updateMember } from "@/lib/actions";
import { createClient } from "@/lib/supabase/client";
import type { Member } from "@/lib/types";
import { getInitials } from "@/lib/utils";

const BUCKET = "member-photos";

function getPublicUrl(path: string) {
  const supabase = createClient();
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export default function MemberForm({
  member,
  onSuccess,
}: {
  member?: Member;
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tanggalMulai, setTanggalMulai] = useState(member?.tanggal_mulai ?? "");
  const [jumlahBulan, setJumlahBulan] = useState<number>(
    member?.jumlah_bulan ?? 1,
  );
  const [fotoPreview, setFotoPreview] = useState<string | null>(
    member?.foto_url ?? null,
  );
  const [fotoPath, setFotoPath] = useState<string | null>(null);

  const isEdit = !!member;

  // Hitung tanggal_selesai otomatis (preview) menggunakan date-fns
  let previewSelesai = "-";
  if (tanggalMulai && jumlahBulan > 0) {
    const mulai = new Date(tanggalMulai);
    if (!isNaN(mulai.getTime())) {
      previewSelesai = format(addMonths(mulai, jumlahBulan), "dd MMM yyyy");
    }
  }

  async function handleFotoChange(file: File | null) {
    if (!file) return;

    // Validasi tipe file
    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar (JPG, PNG, dll).");
      return;
    }
    // Validasi ukuran maks 2MB
    if (file.size > 2 * 1024 * 1024) {
      setError("Ukuran foto maksimal 2MB.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() ?? "jpg";
      // Nama file unik agar tidak bentrok
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { upsert: true });

      if (uploadError) throw new Error(uploadError.message);

      setFotoPath(path);
      setFotoPreview(getPublicUrl(path));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal upload foto.");
    } finally {
      setUploading(false);
    }
  }

  function handleSubmit(formData: FormData) {
    setError(null);
    const input = {
      nama: String(formData.get("nama") ?? "").trim(),
      no_hp: String(formData.get("no_hp") ?? "").trim(),
      no_ktp: String(formData.get("no_ktp") ?? "").trim(),
      alamat: String(formData.get("alamat") ?? "").trim(),
      foto_url: fotoPreview,
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

      {/* Foto profile */}
      <div className="flex items-center gap-4">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 font-semibold text-primary">
          {fotoPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={fotoPreview}
              alt="Preview foto member"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-2xl">{getInitials(member?.nama ?? "?")}</span>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="foto">Foto Profile</Label>
          <div className="flex items-center gap-2">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-input bg-background px-3 py-1.5 text-sm font-medium text-foreground shadow-soft transition-colors hover:bg-accent hover:text-accent-foreground">
              <Camera className="h-4 w-4" />
              {uploading ? "Mengupload..." : "Pilih Foto"}
              <input
                id="foto"
                type="file"
                accept="image/*"
                className="sr-only"
                disabled={uploading}
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  handleFotoChange(file);
                  // Reset input agar bisa pilih file yang sama lagi
                  e.target.value = "";
                }}
              />
            </label>
            {fotoPreview && (
              <button
                type="button"
                onClick={() => {
                  setFotoPreview(null);
                  setFotoPath(null);
                }}
                className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                <X className="h-4 w-4" />
                Hapus
              </button>
            )}
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            JPG/PNG, maks 2MB. Foto opsional.
          </p>
        </div>
      </div>

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
        <textarea
          id="alamat"
          name="alamat"
          defaultValue={member?.alamat}
          placeholder="Alamat lengkap"
          rows={3}
          className="flex min-h-[84px] w-full resize-y rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-soft transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="min-w-0 space-y-1.5">
          <Label htmlFor="tanggal_mulai">Tanggal Mulai *</Label>
          <Input
            id="tanggal_mulai"
            name="tanggal_mulai"
            type="date"
            value={tanggalMulai}
            onChange={(e) => setTanggalMulai(e.target.value)}
            className="h-9 w-full max-w-full min-w-0"
            required
          />
        </div>
        <div className="min-w-0 space-y-1.5">
          <Label htmlFor="jumlah_bulan">Jumlah Bulan *</Label>
          <Select
            name="jumlah_bulan"
            value={String(jumlahBulan)}
            onValueChange={(v) => setJumlahBulan(Number(v))}
          >
            <SelectTrigger id="jumlah_bulan" className="h-9 w-full max-w-full">
              <SelectValue placeholder="Pilih durasi" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n} Bulan
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Di layar 2 kolom (sm/tablet), Tanggal Selesai melebar penuh
            agar tidak menyisakan kolom kosong di sampingnya.
            Di desktop (lg, 3 kolom) kembali normal 1 kolom. */}
        <div className="min-w-0 space-y-1.5 sm:col-span-2 lg:col-span-1">
          <Label>Tanggal Selesai</Label>
          <div className="flex h-9 w-full max-w-full items-center overflow-hidden rounded-lg border border-primary/20 bg-primary/5 px-3 text-sm font-medium text-primary">
            <span className="truncate">{previewSelesai}</span>
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
        <Button type="submit" disabled={pending || uploading}>
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
