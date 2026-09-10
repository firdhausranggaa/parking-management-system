# 🚗 Gandaria City Mall - Enterprise Parking Management System

Sebuah aplikasi manajemen sistem parkir *full-stack* berskala *enterprise* yang dikembangkan sebagai portofolio dan studi kasus[cite: 15]. Sistem ini tidak hanya mengelola kendaraan masuk dan keluar secara efisien, tetapi juga telah dioptimasi dengan keamanan tingkat tinggi, arsitektur *Single Page Application* (SPA) yang reaktif, serta pemrosesan analitik data *real-time*[cite: 15].

## ✨ Fitur Utama

- 🔒 **Enterprise-Grade Security:** Perlindungan menyeluruh dari serangan *Brute Force* (Rate Limiting), *NoSQL Injection* (Mongo Sanitize), serta pengamanan HTTP Header (Helmet).
- 📊 **Business Intelligence Analytics:** Menampilkan statistik pendapatan harian dan aktivitas kendaraan secara *real-time* memanfaatkan MongoDB *Aggregation Pipeline*.
- ⚡ **High Performance & Indexing:** Optimasi kecepatan respon API menggunakan kompresi *payload* dan implementasi *Compound Indexing* pada arsitektur *database*.
- 🛡️ **Smart SPA Frontend:** Antarmuka Vue 3 yang dilindungi oleh *Navigation Guards* (mencegah akses tanpa token), *Global Axios Interceptors*, dan merender elemen UI (seperti dasbor analitik) secara dinamis berdasarkan *Role* pengguna.
- 🧮 **Kalkulasi Biaya Otomatis:** Menghitung durasi parkir dan total tagihan secara presisi saat *checkout*[cite: 15].
- 🗃️ **Soft Deletion & Data Integrity:** Transaksi yang dihapus akan diarsipkan secara aman, tidak dihilangkan permanen dari *database*[cite: 15].
- 🔍 **Pagination & Filtering:** Optimasi *bandwidth* dengan sistem pembagian halaman dan penyaringan status kendaraan (*IN/OUT*)[cite: 15].

## 🛠️ Teknologi yang Digunakan

**Backend (API & Database):**
- Node.js & Express.js[cite: 15]
- MongoDB & Mongoose (Database & ODM)[cite: 15]
- Keamanan: JSON Web Token (JWT), bcrypt[cite: 15], Helmet, Express Rate Limit, Express Mongo Sanitize
- Performa: Compression

**Frontend (Client Interface):**
- Vue 3 (Composition API) & Vite[cite: 15]
- Tailwind CSS (Styling)[cite: 15]
- Axios (HTTP Client & Interceptors)[cite: 15]
- Vue Router (Navigasi & Guards)[cite: 15]

## 🚀 Cara Instalasi & Menjalankan Aplikasi

Pastikan Node.js dan MongoDB (Lokal atau Atlas) sudah terinstal di sistem Anda[cite: 15].

### 1. Setup Backend
Buka terminal dan arahkan ke direktori utama proyek[cite: 15]:
```bash
# Instalasi dependensi backend
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

# Instalasi dependensi frontend
npm install

# Jalankan server pengembangan frontend
npm run dev

```

*Server frontend akan berjalan di `http://localhost:5173*`

## 📡 Dokumentasi API (Endpoints)

| Method | Endpoint | Keterangan | Otorisasi |
| --- | --- | --- | --- |
| `POST` | `/api/users/register` | Mendaftarkan akun baru

 | Publik

 |
| `POST` | `/api/users/login` | Login dan mendapatkan token JWT

 | Publik

 |
| `GET` | `/api/parking/statistik` | Mengambil agregasi data analitik harian | Bearer Token (Admin) |
| `POST` | `/api/parking/in` | Merekam kendaraan masuk

 | Bearer Token

 |
| `PUT` | `/api/parking/out/:id` | Memproses *checkout* & kalkulasi tagihan

 | Bearer Token

 |
| `GET` | `/api/parking/` | Lihat data (Pagination & Filter Status)

 | Bearer Token

 |
| `DELETE` | `/api/parking/:id` | *Soft delete* memindahkan data ke arsip

 | Bearer Token (Admin)

 |
