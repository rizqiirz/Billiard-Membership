# TODO: Fitur Search + Dark Mode + Upload Foto Member

## Fitur Search di Data Member

- [x] 1. Ubah `components/members/members-table.tsx` menjadi client component
- [x] 2. Tambah search input (filter nama, no. HP, no. KTP, alamat)
- [x] 3. Tambah info jumlah hasil & empty state pencarian

## Dark Mode

- [x] 4. Buat `components/theme-toggle.tsx`
- [x] 5. Update `app/layout.tsx` (init tema anti-flash + suppressHydrationWarning)
- [x] 6. Pasang ThemeToggle di `components/sidebar.tsx` & `components/dashboard-shell.tsx`
- [x] 7. Update warna `slate-*` di semua halaman & komponen dengan varian `dark:`

## Upload Foto Member

- [x] 8. Buat `supabase/migrations/00003_add_member_photo.sql` (kolom foto_url + bucket)
- [x] 9. Update `lib/types.ts` tambah field `foto_url`
- [x] 10. Update `lib/actions.ts` simpan `foto_url` di create & update member
- [x] 11. Buat `components/members/member-avatar.tsx`
- [x] 12. Update `components/members/member-form.tsx` (upload + preview foto)
- [x] 13. Update `components/members/members-table.tsx` (avatar di kolom Nama)
- [x] 14. Update `components/members/member-detail-dialog.tsx` (foto besar di detail)
- [x] 15. Update `next.config.mjs` (remotePatterns untuk \*.supabase.co)

## Favicon Bola Billiard

- [x] 16. Buat `app/icon.svg` — favicon SVG bola billiard
- [x] 17. Update `app/layout.tsx` — metadata icons

## Testing

- [x] 18. Build sukses
