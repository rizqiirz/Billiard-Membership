-- =============================================================================
-- ADMIN DASHBOARD MEMBERSHIP BILLIARD
-- Jalankan seluruh script ini di: Supabase Dashboard -> SQL Editor -> New query
-- =============================================================================

-- 1) Aktifkan ekstensi pgcrypto (untuk gen_random_uuid)
create extension if not exists pgcrypto;

-- =============================================================================
-- 2) TABEL: members
--    Catatan: kolom "status" TIDAK dibuat karena status Aktif/Tidak Aktif
--    dihitung on-the-fly dari tanggal_selesai oleh aplikasi (date-fns).
-- =============================================================================
create table if not exists public.members (
  id             uuid primary key default gen_random_uuid(),
  nama           text not null,
  no_hp          text not null,
  no_ktp         text not null,
  alamat         text not null default '',
  tanggal_mulai  date not null,
  jumlah_bulan   integer not null check (jumlah_bulan > 0),
  tanggal_selesai date not null,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- =============================================================================
-- 3) TABEL: membership_history
-- =============================================================================
create table if not exists public.membership_history (
  id         uuid primary key default gen_random_uuid(),
  member_id  uuid not null references public.members (id) on delete cascade,
  tanggal    timestamptz not null default now(),
  aksi       text not null,
  durasi     integer,
  admin      text,
  created_at timestamptz not null default now()
);

-- =============================================================================
-- 4) INDEX (mempercepat pencarian & urutan)
-- =============================================================================
create index if not exists idx_members_nama
  on public.members (nama);

create index if not exists idx_members_tanggal_selesai
  on public.members (tanggal_selesai);

create index if not exists idx_members_tanggal_mulai
  on public.members (tanggal_mulai);

create index if not exists idx_history_member_id
  on public.membership_history (member_id);

create index if not exists idx_history_tanggal
  on public.membership_history (tanggal desc);

-- =============================================================================
-- 5) TRIGGER: otomatis update updated_at saat data member diubah
-- =============================================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_members_updated_at on public.members;
create trigger trg_members_updated_at
  before update on public.members
  for each row
  execute function public.set_updated_at();

-- =============================================================================
-- 6) ROW LEVEL SECURITY
--    Hanya user yang sudah login (authenticated via Supabase Auth)
--    yang boleh membaca/menulis data.
-- =============================================================================
alter table public.members enable row level security;
alter table public.membership_history enable row level security;

drop policy if exists "Allow full access for authenticated users on members" on public.members;
create policy "Allow full access for authenticated users on members"
  on public.members
  for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Allow full access for authenticated users on membership_history" on public.membership_history;
create policy "Allow full access for authenticated users on membership_history"
  on public.membership_history
  for all
  to authenticated
  using (true)
  with check (true);

-- =============================================================================
-- 7) DATA AWAL (opsional): contoh 1 member agar dashboard tidak kosong.
--    Hapus/blok komentar ini jika tidak ingin data dummy.
-- =============================================================================
insert into public.members (nama, no_hp, no_ktp, alamat, tanggal_mulai, jumlah_bulan, tanggal_selesai)
values
  ('Budi Santoso', '081234567890', '3171010101010001', 'Jl. Merdeka No. 1, Jakarta',
   current_date, 3, (current_date + interval '3 months')::date)
on conflict do nothing;

