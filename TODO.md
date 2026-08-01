# TODO: Fitur Search + Dark Mode ✅

## Fitur Search di Data Member

- [x] 1. Ubah `components/members/members-table.tsx` menjadi client component
- [x] 2. Tambah search input (filter nama, no. HP, no. KTP, alamat)
- [x] 3. Tambah info jumlah hasil & empty state pencarian

## Dark Mode

- [x] 4. Buat `components/theme-toggle.tsx`
- [x] 5. Update `app/layout.tsx` (init tema anti-flash + suppressHydrationWarning)
- [x] 6. Pasang ThemeToggle di `components/sidebar.tsx` & `components/dashboard-shell.tsx`
- [x] 7. Update warna `slate-*` di semua halaman & komponen dengan varian `dark:`
- [x] 8. Tambah CSS variable `--chart-stop` untuk grafik chart

## Responsive Mobile

- [x] 9. Layout tombol Export Excel & Tambah Member di halaman member dibuat vertikal di mobile
- [x] 10. Field Alamat di form member diubah jadi textarea (ukuran besar, bisa di-resize)
- [x] 11. Padding card form member baru disesuaikan untuk mobile

## Favicon Logo Bola Billiard

- [x] 12. Buat `app/icon.svg` (logo bola billiard angka 8) sebagai favicon
- [x] 13. Daftarkan favicon di metadata `app/layout.tsx`

## Testing

- [x] 14. Build sukses ✅
