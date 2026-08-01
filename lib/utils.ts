import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { differenceInCalendarDays, format } from "date-fns";
import { id } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTanggal(
  date: string | Date | null | undefined,
  pattern = "dd MMM yyyy",
) {
  if (!date) return "-";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "-";
  return format(d, pattern, { locale: id });
}

export function formatTanggalWaktu(date: string | Date | null | undefined) {
  if (!date) return "-";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "-";
  return format(d, "dd MMM yyyy, HH:mm", { locale: id });
}

export type MemberStatus = "aktif" | "akan-expired" | "expired";

/**
 * Status dihitung on-the-fly (TIDAK disimpan di database):
 * - expired        : tanggal_selesai < hari ini
 * - akan-expired   : 0 <= tanggal_selesai <= 7 hari dari sekarang
 * - aktif          : sisanya
 */
export function getStatus(tanggalSelesai: string | Date): MemberStatus {
  const end =
    typeof tanggalSelesai === "string"
      ? new Date(tanggalSelesai)
      : tanggalSelesai;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diff = differenceInCalendarDays(end, today);
  if (diff < 0) return "expired";
  if (diff <= 7) return "akan-expired";
  return "aktif";
}

export const statusLabel: Record<MemberStatus, string> = {
  aktif: "Aktif",
  "akan-expired": "Akan Expired",
  expired: "Tidak Aktif",
};

export const statusBadgeVariant: Record<
  MemberStatus,
  "default" | "secondary" | "destructive" | "outline" | "warning"
> = {
  aktif: "default",
  "akan-expired": "warning",
  expired: "destructive",
};

export function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]!.toUpperCase())
    .join("");
}
