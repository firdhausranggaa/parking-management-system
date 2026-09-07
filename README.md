# 🚗 Gandaria City Mall - Parking Management System

Sebuah aplikasi manajemen sistem parkir *full-stack* yang dikembangkan sebagai studi kasus untuk mengelola kendaraan masuk dan keluar secara efisien. Sistem ini dilengkapi dengan kalkulasi biaya otomatis, autentikasi keamanan, dan dasbor kasir interaktif.

## ✨ Fitur Utama

- **Kalkulasi Biaya Otomatis:** Menghitung durasi parkir dan total biaya secara presisi saat kendaraan *checkout*.
- **Authentication & RBAC:** Keamanan *endpoint* menggunakan JWT (JSON Web Token) dengan pemisahan akses (Admin & Operator).
- **Soft Deletion:** Data transaksi parkir yang dihapus tidak akan hilang permanen dari *database*, melainkan diarsipkan.
- **Pagination & Filtering:** Optimasi pengambilan data dari *backend* menggunakan sistem halaman dan filter status.
- **Interactive Dashboard:** Antarmuka kasir yang responsif dan modern, dibangun menggunakan Vue 3 dan Tailwind CSS.

## 🛠️ Teknologi yang Digunakan

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose (Database & ODM)
- JSON Web Token (JWT) & bcrypt (Keamanan)

**Frontend:**
- Vue 3 (Composition API) & Vite
- Tailwind CSS (Styling)
- Axios (HTTP Client)
- Vue Router (Navigasi)

## 🚀 Cara Instalasi & Menjalankan Aplikasi

Pastikan Node.js dan MongoDB (Lokal atau Atlas) sudah terinstal di sistem Anda.

### 1. Setup Backend
Buka terminal dan arahkan ke direktori utama proyek:
```bash
# Instalasi dependensi
npm install

# Buat file .env di root direktori dan isi dengan:
# PORT=3000
# MONGODB_URI=mongodb://localhost:27017/parking_db
# SECRET_KEY=rahasia_super_aman_123

# Jalankan server backend
node src/app.js

```

*Server backend akan berjalan di `http://localhost:3000*`

### 2. Setup Frontend

Buka terminal baru dan arahkan ke folder frontend:

```bash
cd frontend-parking

# Instalasi dependensi
npm install

# Jalankan server frontend
npm run dev

```

*Server frontend akan berjalan di `http://localhost:5173*`

## 📡 Dokumentasi API (Endpoints)

| Method | Endpoint | Keterangan | Otorisasi |
| --- | --- | --- | --- |
| `POST` | `/api/users/register` | Mendaftarkan akun baru | Publik |
| `POST` | `/api/users/login` | Login dan mendapatkan token | Publik |
| `POST` | `/api/parking/in` | Input kendaraan masuk | Bearer Token |
| `PUT` | `/api/parking/out/:id` | Proses checkout & hitung biaya | Bearer Token |
| `GET` | `/api/parking/` | Lihat data (dukung pagination & filter) | Bearer Token |
| `DELETE` | `/api/parking/:id` | Soft delete data parkir | Bearer Token (Admin) |
