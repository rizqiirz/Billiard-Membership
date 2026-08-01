"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { addMonths, format } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import type { Member } from "@/lib/types";

// =============================================================================
// AUTH
// =============================================================================

export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function logout() {
  const supabase = createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

async function getCurrentAdmin(): Promise<string | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.email ?? user?.user_metadata?.name ?? null;
}

// =============================================================================
// MEMBERS
// =============================================================================

export type MemberInput = {
  nama: string;
  no_hp: string;
  no_ktp: string;
  alamat: string;
  tanggal_mulai: string;
  jumlah_bulan: number;
};

export type ActionResult = { success?: boolean; error?: string };

function hitungTanggalSelesai(tanggalMulai: string, jumlahBulan: number) {
  const mulai = new Date(tanggalMulai);
  const selesai = addMonths(mulai, jumlahBulan);
  return {
    tanggalMulai: format(mulai, "yyyy-MM-dd"),
    tanggalSelesai: format(selesai, "yyyy-MM-dd"),
  };
}

export async function createMember(input: MemberInput): Promise<ActionResult> {
  const supabase = createClient();
  const admin = await getCurrentAdmin();
  const { tanggalMulai, tanggalSelesai } = hitungTanggalSelesai(
    input.tanggal_mulai,
    input.jumlah_bulan,
  );

  const { data: member, error } = await supabase
    .from("members")
    .insert({
      nama: input.nama,
      no_hp: input.no_hp,
      no_ktp: input.no_ktp,
      alamat: input.alamat,
      tanggal_mulai: tanggalMulai,
      jumlah_bulan: input.jumlah_bulan,
      tanggal_selesai: tanggalSelesai,
    })
    .select()
    .single();

  if (error) return { error: error.message };

  await supabase.from("membership_history").insert({
    member_id: member.id,
    tanggal: new Date().toISOString(),
    aksi: "Member Baru",
    durasi: input.jumlah_bulan,
    admin,
  });

  revalidatePath("/");
  revalidatePath("/members");
  revalidatePath("/history");
  return { success: true };
}

export async function updateMember(
  id: string,
  input: MemberInput,
): Promise<ActionResult> {
  const supabase = createClient();
  const { tanggalMulai, tanggalSelesai } = hitungTanggalSelesai(
    input.tanggal_mulai,
    input.jumlah_bulan,
  );

  const { error } = await supabase
    .from("members")
    .update({
      nama: input.nama,
      no_hp: input.no_hp,
      no_ktp: input.no_ktp,
      alamat: input.alamat,
      tanggal_mulai: tanggalMulai,
      jumlah_bulan: input.jumlah_bulan,
      tanggal_selesai: tanggalSelesai,
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/members");
  revalidatePath("/history");
  return { success: true };
}

export async function deleteMember(id: string): Promise<ActionResult> {
  const supabase = createClient();

  const { error } = await supabase.from("members").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/members");
  revalidatePath("/history");
  return { success: true };
}

/**
 * Perpanjang membership:
 * - Jika member masih aktif -> perpanjang dari tanggal_selesai.
 * - Jika sudah expired     -> perpanjang dari hari ini.
 * - Selalu menambah baris baru di membership_history.
 */
export async function extendMembership(
  member: Member,
  durasiBulan: number,
): Promise<ActionResult> {
  const supabase = createClient();
  const admin = await getCurrentAdmin();

  const end = new Date(member.tanggal_selesai);
  const base = end.getTime() > Date.now() ? end : new Date();
  const selesaiBaru = format(addMonths(base, durasiBulan), "yyyy-MM-dd");

  const { error: updateError } = await supabase
    .from("members")
    .update({
      tanggal_selesai: selesaiBaru,
      jumlah_bulan: member.jumlah_bulan + durasiBulan,
    })
    .eq("id", member.id);

  if (updateError) return { error: updateError.message };

  await supabase.from("membership_history").insert({
    member_id: member.id,
    tanggal: new Date().toISOString(),
    aksi: `Perpanjang ${durasiBulan} Bulan`,
    durasi: durasiBulan,
    admin,
  });

  revalidatePath("/");
  revalidatePath("/members");
  revalidatePath("/history");
  return { success: true };
}

// =============================================================================
// SETTINGS / PROFIL ADMIN
// =============================================================================

export async function updateAdminProfile(
  formData: FormData,
): Promise<ActionResult> {
  const supabase = createClient();
  const name = String(formData.get("name") ?? "").trim();

  if (!name) return { error: "Nama tidak boleh kosong" };

  const { error } = await supabase.auth.updateUser({
    data: { name },
  });

  if (error) return { error: error.message };

  revalidatePath("/settings");
  return { success: true };
}
