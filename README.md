# SocialBuzz Clone - Siap Produksi

Platform sosial yang komprehensif dan siap produksi bagi para kreator untuk
menerima donasi dan membangun komunitas. Dibangun dengan teknologi modern dan
praktik terbaik.

## ✨ Fitur

### Fitur Inti

- **Sistem Autentikasi Lengkap** - Berbasis JWT dengan hashing kata sandi yang
  aman.
- **Dasbor Pengguna & Admin** - Kontrol akses berbasis peran (Role-Based Access
  Control).
- **Integrasi Pembayaran** - Gateway pembayaran Duitku dengan callback yang
  aman.
- **Sistem Unggah File** - Integrasi dengan Supabase Storage.
- **Notifikasi Real-time** - Sistem notifikasi dalam aplikasi menggunakan
  WebSockets.
- **Desain Responsif** - Bekerja dengan sempurna di semua perangkat.

### Fitur Pengguna

- Pendaftaran dan login pengguna.
- Manajemen profil dengan unggah avatar.
- Menerima dan melacak donasi.
- Riwayat transaksi.
- Permintaan penarikan dana (payout).
- Pengaturan akun.

### Fitur Admin

- Manajemen pengguna.
- Pemantauan transaksi.
- Sistem persetujuan penarikan dana.
- Statistik platform.
- Konfigurasi situs.

## 🛠️ Tumpukan Teknologi (Tech Stack)

### Frontend

- **Next.js 15** - Framework React dengan App Router.
- **TypeScript** - Pengembangan yang aman secara tipe (type-safe).
- **Tailwind CSS** - Framework CSS utility-first.
- **Lucide React** - Ikon yang indah dan konsisten.

### Backend

- **Next.js API Routes** - Fungsi serverless.
- **JWT Authentication** - Otentikasi berbasis token yang aman.
- **Supabase** - Database PostgreSQL dan penyimpanan file (storage).
- **Duitku** - Integrasi gateway pembayaran.
- **Socket.IO** - Untuk fungsionalitas real-time.

### Alat Pengembangan

- **ESLint & Prettier** - Kualitas dan format kode.
- **Husky & lint-staged** - Git hooks untuk linting sebelum commit.
- **TypeScript** - Pengecekan tipe statis.

## 📂 Struktur Proyek

```
my-socialbuzz-clone/
├── app/                          # Next.js App Router
│   ├── api/v1/                  # Rute API (dengan versi)
│   │   ├── auth/                # Endpoint autentikasi
│   │   └── ...                  # Endpoint lainnya
│   ├── dashboard/               # Halaman-halaman dasbor
│   ├── auth/                    # Halaman-halaman autentikasi
│   ├── layout.tsx               # Layout utama
│   └── page.tsx                 # Halaman beranda
├── components/                   # Komponen React
│   ├── ui/                      # Komponen UI (Tombol, Kartu, dll.)
│   └── dashboard/               # Komponen spesifik dasbor
├── lib/                         # Utilitas inti
│   ├── supabase.ts              # Klien database Supabase
│   ├── auth.ts                  # Utilitas autentikasi
│   ├── duitku.ts                # Integrasi pembayaran Duitku
│   └── middleware.ts            # Middleware untuk API
├── services/                    # Logika bisnis
│   ├── userService.ts           # Operasi terkait pengguna
│   └── paymentService.ts        # Operasi terkait pembayaran
├── hooks/                       # Custom React hooks
│   ├── useAuth.ts               # Hook untuk autentikasi
│   └── usePayment.ts            # Hook untuk pembayaran
├── types/                       # Definisi TypeScript
│   ├── user.ts                  # Tipe data pengguna
│   ├── payment.ts               # Tipe data pembayaran
│   └── common.ts                # Tipe data umum
├── utils/                       # Fungsi utilitas
│   ├── validator.ts             # Validasi input
│   └── formatter.ts             # Format data
├── config/                      # Konfigurasi
│   ├── constants.ts             # Konstanta aplikasi
│   └── env.ts                   # Konfigurasi environment
├── public/                      # Aset statis (gambar, ikon)
├── .env.example                 # Template variabel lingkungan
├── package.json                 # Dependensi dan skrip
├── next.config.js               # Konfigurasi Next.js
├── tailwind.config.js           # Konfigurasi Tailwind
├── tsconfig.json                # Konfigurasi TypeScript
└── README.md                    # File ini
```

## 🚀 Memulai

### Prasyarat

- Node.js 18.0 atau lebih tinggi
- npm, yarn, atau pnpm
- Akun Supabase
- Akun merchant Duitku

### Instalasi

1.  **Clone repositori**

    ```bash
    git clone https://github.com/your-username/socialbuzz-clone.git
    cd socialbuzz-clone
    ```

2.  **Install dependensi**

    ```bash
    npm install
    ```

3.  **Siapkan variabel lingkungan** Salin `.env.example` ke `.env.local`.

    ```bash
    cp .env.example .env.local
    ```

    Isi variabel yang diperlukan di `.env.local`:

    ```env
    # Aplikasi
    NEXT_PUBLIC_APP_URL=http://localhost:3000

    # Database - Supabase
    NEXT_PUBLIC_SUPABASE_URL=https://proyek-anda.supabase.co
    NEXT_PUBLIC_SUPABASE_ANON_KEY=kunci-anon-anda
    SUPABASE_SERVICE_ROLE_KEY=kunci-service-role-anda

    # Autentikasi JWT
    JWT_SECRET=kunci-jwt-rahasia-anda-minimal-32-karakter

    # Gateway Pembayaran - Duitku
    DUITKU_MERCHANT_CODE=kode-merchant-anda
    DUITKU_API_KEY=kunci-api-anda
    ```

4.  **Siapkan database** Jalankan SQL dari file `database/socialbuzz_schema.sql`
    di editor SQL Supabase Anda untuk membuat tabel-tabel yang diperlukan.

5.  **Jalankan server pengembangan**

    ```bash
    npm run dev
    ```

6.  **Buka browser Anda** Kunjungi
    [http://localhost:3000](http://localhost:3000) untuk melihat aplikasi.

## ⚙️ Konfigurasi

### Variabel Lingkungan

| Variabel                        | Deskripsi                                     | Wajib |
| :------------------------------ | :-------------------------------------------- | :---: |
| `NEXT_PUBLIC_APP_URL`           | URL aplikasi                                  |  ✅   |
| `NEXT_PUBLIC_SUPABASE_URL`      | URL proyek Supabase                           |  ✅   |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Kunci anon Supabase                           |  ✅   |
| `SUPABASE_SERVICE_ROLE_KEY`     | Kunci service role Supabase                   |  ✅   |
| `JWT_SECRET`                    | Rahasia penandatanganan JWT (min 32 karakter) |  ✅   |
| `DUITKU_MERCHANT_CODE`          | Kode merchant Duitku                          |  ✅   |
| `DUITKU_API_KEY`                | Kunci API Duitku                              |  ✅   |

### Konfigurasi Pembayaran

Aplikasi ini menggunakan Duitku. Konfigurasikan pengaturan Duitku Anda:

1.  Daftar akun merchant Duitku.
2.  Dapatkan kode merchant dan kunci API Anda.
3.  Atur URL callback Anda ke: `https://domain-anda.com/api/v1/payment/callback`
4.  Atur URL kembali (return URL) Anda ke:
    `https://domain-anda.com/payment/success`

## 🧪 Pengujian (Testing)

Jalankan suite pengujian:

```bash
npm run test
```

Jalankan linter untuk memeriksa kualitas kode:

```bash
npm run lint
```

Periksa tipe dengan TypeScript:

```bash
npm run type-check
```

## 📦 Build untuk Produksi

1.  **Build aplikasi**

    ```bash
    npm run build
    ```

2.  **Jalankan server produksi**
    ```bash
    npm run start
    ```

## 🚀 Deployment

### Deploy ke Vercel

1.  Push kode Anda ke GitHub.
2.  Hubungkan repositori Anda ke Vercel.
3.  Atur variabel lingkungan di dasbor Vercel.
4.  Deploy!

## 🤝 Berkontribusi

1.  Fork repositori ini.
2.  Buat branch fitur Anda (`git checkout -b feature/FiturKeren`).
3.  Commit perubahan Anda (`git commit -m 'Menambahkan FiturKeren'`).
4.  Push ke branch (`git push origin feature/FiturKeren`).
5.  Buka sebuah Pull Request.

## 📄 Lisensi

Proyek ini dilisensikan di bawah Lisensi MIT - lihat file `LICENSE` untuk
detailnya.
