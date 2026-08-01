-- =============================================================================
-- FITUR FOTO PROFILE MEMBER
-- 1) Tambah kolom foto_url pada tabel members
-- 2) Buat storage bucket untuk menyimpan foto
-- 3) Policy RLS untuk storage
-- Jalankan di: Supabase Dashboard -> SQL Editor -> New query
-- =============================================================================

-- 1) Tambah kolom foto_url (nullable, karena tidak semua member punya foto)
alter table public.members
  add column if not exists foto_url text;

-- =============================================================================
-- 2) STORAGE BUCKET: member-photos (public agar bisa diakses via URL langsung)
-- =============================================================================
insert into storage.buckets (id, name, public)
values ('member-photos', 'member-photos', true)
on conflict (id) do nothing;

-- =============================================================================
-- 3) RLS POLICY untuk storage
--    - Authenticated user boleh upload (insert) & hapus foto
--    - Public boleh baca (karena bucket public)
-- =============================================================================
drop policy if exists "Public read member photos" on storage.objects;
create policy "Public read member photos"
  on storage.objects
  for select
  to public
  using (bucket_id = 'member-photos');

drop policy if exists "Authenticated upload member photos" on storage.objects;
create policy "Authenticated upload member photos"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'member-photos');

drop policy if exists "Authenticated update member photos" on storage.objects;
create policy "Authenticated update member photos"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'member-photos');

drop policy if exists "Authenticated delete member photos" on storage.objects;
create policy "Authenticated delete member photos"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'member-photos');

