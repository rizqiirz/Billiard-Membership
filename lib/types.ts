export type Member = {
  id: string;
  nama: string;
  no_hp: string;
  no_ktp: string;
  alamat: string;
  foto_url: string | null;
  tanggal_mulai: string;
  jumlah_bulan: number;
  tanggal_selesai: string;
  created_at: string;
  updated_at: string;
};

export type MembershipHistory = {
  id: string;
  member_id: string;
  tanggal: string;
  aksi: string;
  durasi: number | null;
  admin: string | null;
  created_at: string;
};

export type MemberWithHistory = Member & {
  history?: MembershipHistory[];
};
