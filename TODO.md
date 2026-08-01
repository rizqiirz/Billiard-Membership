# TODO: Fitur Search + Dark Mode

## Fitur Search di Data Member

- [x] 1. Ubah `components/members/members-table.tsx` menjadi client component
- [x] 2. Tambah search input (filter nama, no. HP, no. KTP, alamat)
- [x] 3. Tambah info jumlah hasil & empty state pencarian

## Dark Mode

- [x] 4. Buat `components/theme-toggle.tsx`
- [x] 5. Update `app/layout.tsx` (init tema anti-flash + suppressHydrationWarning)
- [x] 6. Pasang ThemeToggle di `components/sidebar.tsx` & `components/dashboard-shell.tsx`
- [x] 7. Update warna `slate-*` di semua halaman & komponen dengan varian `dark:`

## Perubahan Tambahan (Feedback)

- [x] 9. Ubah grafik pendaftar dari bar chart menjadi line chart minimalis
- [x] 10. Optimasi performa: lazy-load `xlsx` → bundle /members turun dari 233 kB ke 141 kB

## Testing

- [x] 8. Jalankan `npm run build` dan pastikan tidak ada error
