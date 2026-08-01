# 🎱 Admin Dashboard Membership Lunnar

Aplikasi admin untuk mengelola data member membership Lunnar. Dibangun dengan **Next.js (App Router)**, **Supabase** (Auth + Database), **Tailwind CSS**, dan **Shadcn UI**.

> Aplikasi ini **khusus admin** — member tidak memiliki akun atau akses login.

---

## ✨ Fitur

| Menu                        | Deskripsi                                                                                                              |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| 📊 **Dashboard**            | Card ringkasan (Total, Aktif, Expired, Akan Expired 7 hari), grafik pendaftar 6 bulan, daftar member akan segera habis |
| 👥 **Data Member**          | Tabel member + aksi Detail, Edit, Perpanjang, Hapus                                                                    |
| ➕ **Tambah Member**        | Form input; `tanggal_selesai` dihitung otomatis (`tanggal_mulai + jumlah_bulan`)                                       |
| 📜 **Riwayat Perpanjangan** | Tabel `membership_history` (Member Baru & Perpanjang)                                                                  |
| ⚙️ **Pengaturan**           | Edit profil admin                                                                                                      |
| 🚪 **Logout**               | Keluar dari sesi Supabase Auth                                                                                         |

**Status member** (`Aktif` / `Akan Expired` / `Tidak Aktif`) **tidak disimpan di database** — dihitung on-the-fly dengan `date-fns` dari kolom `tanggal_selesai`.

---

## 🧱 Tech Stack

- **Next.js 14** — App Router, Server Components, Server Actions
- **Supabase** — Auth (login admin) + PostgreSQL (members, membership_history)
- **Tailwind CSS + Shadcn UI** — styling & komponen (button, card, dialog, table, dsb.)
- **date-fns** — perhitungan tanggal & status dinamis

---

## 📁 Struktur Penting

```
app/
  login/            → halaman login admin
  (dashboard)/      → route group yang dilindungi auth
    page.tsx        → Dashboard
    members/        → Data Member
    members/new/    → Tambah Member
    history/        → Riwayat Perpanjangan
    settings/       → Pengaturan
components/
  ui/               → komponen Shadcn
  sidebar.tsx       → navigasi
  members/          → tabel, dialog detail/edit/perpanjang, hapus
  dashboard/        → stat card, grafik, daftar expired
lib/
  supabase/         → client server & browser
  actions.ts        → SERVER ACTIONS (CRUD, auth, perpanjang)
  utils.ts          → cn(), formatTanggal(), getStatus()
  types.ts          → tipe data
supabase/migrations/00001_init.sql → skema database
```

---

## 🚀 Cara Menjalankan

### 1. Setup Supabase

1. Buat project di [supabase.com](https://supabase.com).
2. Buka **SQL Editor**, paste isi file `supabase/migrations/00001_init.sql`, lalu jalankan.
3. Buka **Authentication → Users → Add user** untuk membuat akun admin (email + password).

### 2. Konfigurasi Environment

Salin `.env.local.example` menjadi `.env.local`:

```bash
cp .env.local.example .env.local
```

Isi nilai:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

> Ambil `URL` dan `anon key` dari **Supabase Dashboard → Settings → API**.

### 3. Install & Jalankan

```bash
npm install
npm run dev
```

Buka `http://localhost:3000` → login dengan akun admin yang tadi dibuat.

---

## ☁️ Deploy ke Vercel

1. Push project ke GitHub.
2. Import repo di [vercel.com](https://vercel.com).
3. Tambahkan environment variables `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` di **Settings → Environment Variables**.
4. Deploy. 🎉

---

## 🗄️ Skema Database

### `members`

| Kolom                       | Tipe        | Keterangan                           |
| --------------------------- | ----------- | ------------------------------------ |
| `id`                        | uuid PK     | auto `gen_random_uuid()`             |
| `nama`                      | text        | nama member                          |
| `no_hp`                     | text        | nomor HP                             |
| `no_ktp`                    | text        | NIK                                  |
| `alamat`                    | text        | alamat                               |
| `tanggal_mulai`             | date        | awal membership                      |
| `jumlah_bulan`              | int         | durasi                               |
| `tanggal_selesai`           | date        | dihitung otomatis dari mulai + bulan |
| `created_at` / `updated_at` | timestamptz | otomatis                             |

### `membership_history`

| Kolom        | Tipe              | Keterangan                           |
| ------------ | ----------------- | ------------------------------------ |
| `id`         | uuid PK           | auto                                 |
| `member_id`  | uuid FK → members | cascade delete                       |
| `tanggal`    | timestamptz       | waktu kejadian                       |
| `aksi`       | text              | "Member Baru" / "Perpanjang X Bulan" |
| `durasi`     | int               | lama perpanjangan                    |
| `admin`      | text              | email/nama admin                     |
| `created_at` | timestamptz       | otomatis                             |

> RLS (Row Level Security) diaktifkan — hanya user **authenticated** yang bisa akses data.

---

## 🧠 Catatan Arsitektur

- ✅ **Server Actions** di `lib/actions.ts` untuk semua operasi CRUD — tanpa API routes terpisah.
- ✅ **Data fetching** langsung di Server Component (`await supabase.from(...)`), tanpa `useEffect`/loading state.
- ✅ **Status dinamis** dihitung on-the-fly via `getStatus()` (date-fns), tidak disimpan di DB.
- ✅ **Client Component** hanya untuk interaksi browser: tombol hapus (`confirm()`), dialog, form.
