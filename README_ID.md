# Proyek SocialBuzz Clone

Platform media sosial yang memungkinkan kreator konten untuk menerima dukungan finansial dari penggemar mereka, lengkap dengan integrasi untuk para streamer.

## Fitur Utama

Berdasarkan analisis struktur proyek, berikut adalah fitur-fitur utama yang tersedia:

*   **Autentikasi Pengguna**: Sistem lengkap untuk pendaftaran, login, dan lupa kata sandi.
*   **Profil Pengguna**: Setiap pengguna memiliki halaman profil publik yang dapat dikustomisasi (`/profile/[username]`).
*   **Dashboard Pengguna**: Halaman khusus bagi pengguna untuk mengelola profil, pengaturan, dan melihat riwayat transaksi.
*   **Panel Admin**: Panel khusus untuk administrator guna mengelola pengguna, melihat laporan, mengatur pembayaran (payouts), dan pengaturan sistem lainnya.
*   **Sistem Donasi**: Pengguna dapat memberikan donasi kepada kreator. Terdapat halaman sukses setelah donasi berhasil, yang mengindikasikan adanya alur pembayaran.
*   **Integrasi Pembayaran**: Menggunakan gateway pembayaran pihak ketiga (terlihat dari `lib/duitku.ts`, kemungkinan besar **Duitku**).
*   **Integrasi OBS untuk Streamer**: Fitur overlay untuk OBS (`/obs/[creatorId]`) yang memungkinkan streamer menampilkan notifikasi donasi secara langsung saat siaran.
*   **Notifikasi Real-time**: Kemungkinan menggunakan WebSockets (`lib/websocket.ts`) untuk notifikasi instan (misalnya, saat donasi diterima).
*   **Halaman Eksplorasi**: Halaman untuk menemukan kreator-kreator lain di platform.
*   **Halaman Statis**: Halaman informasional seperti Tentang Kami, Kontak, FAQ, Kebijakan Privasi, dan Syarat & Ketentuan.

## Tumpukan Teknologi (Tech Stack)

*   **Framework**: Next.js (React)
*   **Bahasa**: TypeScript
*   **Styling**: Tailwind CSS
*   **Backend & Database**: Supabase (terlihat dari `lib/supabase.ts` dan skema di `database/`)
*   **Gateway Pembayaran**: Duitku
*   **Linting & Formatting**: ESLint dan Prettier
*   **Hooks Git**: Husky untuk pre-commit hooks

## Langkah-langkah Instalasi

1.  **Clone Repositori**
    ```bash
    git clone <URL_REPOSITORI_ANDA>
    cd my-socialbuzz-clone
    ```

2.  **Install Dependensi**
    Gunakan package manager pilihan Anda (npm atau yarn).
    ```bash
    npm install
    # atau
    yarn install
    ```

3.  **Konfigurasi Environment Variables**
    Salin file `.env.example` menjadi `.env.local` dan isi variabel yang dibutuhkan.
    ```bash
    cp .env.example .env.local
    ```
    Anda perlu mengisi kredensial untuk:
    *   Supabase (URL dan Anon Key)
    *   Kredensial Duitku (Merchant Code dan API Key)
    *   Variabel lainnya yang mungkin diperlukan.

4.  **Setup Database Supabase**
    *   Buat proyek baru di Supabase.
    *   Jalankan skema SQL yang ada di direktori `database/` untuk membuat tabel dan relasi yang diperlukan. Anda bisa memulai dengan `socialbuzz_schema.sql`.
    *   Pastikan untuk mengkonfigurasi RLS (Row Level Security) policies jika diperlukan (terdapat file `fix-rls-policies.sql` sebagai referensi).

5.  **Jalankan Aplikasi (Mode Development)**
    ```bash
    npm run dev
    # atau
    yarn dev
    ```

6.  **Buka Aplikasi**
    Aplikasi akan berjalan secara default di `http://localhost:3000`.
