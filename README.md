# PilahPintar - Platform Klasifikasi Sampah Cerdas

**Memilah Sampah dengan Cerdas, Demi Bumi yang Lestari**

## 🌱 Tentang PilahPintar

PilahPintar adalah platform web inovatif yang menggunakan teknologi AI dan Deep Learning dengan arsitektur Convolutional Neural Network (CNN) untuk membantu masyarakat, khususnya generasi muda, dalam mengelola sampah secara cerdas dan berkelanjutan.

### 🎯 Visi

Menjadi platform terdepan dalam edukasi dan manajemen sampah berbasis komunitas yang didukung oleh teknologi AI di Indonesia.

### 🚀 Fitur Utama

#### 1. Alat Pilah Cerdas (Smart Sort Tool)

- Klasifikasi sampah real-time menggunakan kamera
- Teknologi CNN untuk akurasi tinggi
- Deteksi berbagai jenis sampah (plastik, kertas, logam, organik, dll.)

#### 2. Dashboard Analytics

- Statistik personal kontribusi pengguna
- Visualisasi jejak sampah
- Tracking progress dan pencapaian

#### 3. Peta Sebaran Sampah (Waste Map)

- Heatmap konsentrasi sampah berdasarkan area
- Integrasi geolokasi
- Data agregat untuk komunitas

#### 4. Pusat Edukasi

- Ensiklopedi daur ulang
- Video tutorial dan panduan
- Tips upcycling dan DIY

#### 5. Fitur Komunitas

- Leaderboard dan kompetisi
- Sistem lencana dan achievement
- Tantangan lingkungan mingguan/bulanan

#### 6. Direktori Bank Sampah

- Lokasi bank sampah terdekat
- Informasi TPS3R dan pengepul
- Integrasi dengan hasil klasifikasi

## 🛠️ Teknologi

### Frontend

- **React.js** - UI Framework
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP Client
- **Chart.js** - Data Visualization
- **Leaflet** - Interactive Maps

### Backend

- **Node.js** - Runtime Environment
- **Express.js** - Web Framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Multer** - File Upload
- **TensorFlow.js** - ML Model Integration

### AI/ML

- **TensorFlow/Keras** - Model Training
- **CNN Architecture** - Image Classification
- **OpenCV** - Image Processing

## 📱 Target Pengguna

1. **Andi (16 tahun, Siswa SMA)**

   - Aktif di media sosial, peduli lingkungan
   - Tertarik gamifikasi dan kompetisi

2. **Bapak Budi (45 tahun, Ketua RT)**

   - Butuh data untuk program lingkungan
   - Memerlukan laporan untuk warga

3. **Ibu Ratna (35 tahun, Guru)**
   - Mencari alat edukasi inovatif
   - Ingin mengadakan kompetisi antar kelas

## 🚀 Quick Start

### Prerequisites

- Node.js (v16+)
- npm atau yarn
- MongoDB

### Installation

1. Clone repository

```bash
git clone https://github.com/your-username/pilahpintar.git
cd pilahpintar
```

2. Install dependencies untuk frontend

```bash
cd frontend
npm install
```

3. Install dependencies untuk backend

```bash
cd ../backend
npm install
```

4. Setup environment variables

```bash
# Di folder backend, buat file .env
cp .env.example .env
# Edit .env dengan konfigurasi database dan API keys
```

5. Jalankan development server

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm start
```

## 🏗️ Struktur Proyek

```
pilahpintar/
├── frontend/                 # React.js Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/       # Reusable Components
│   │   ├── pages/           # Page Components
│   │   ├── contexts/        # React Contexts
│   │   ├── hooks/           # Custom Hooks
│   │   ├── utils/           # Utility Functions
│   │   └── styles/          # Global Styles
│   ├── package.json
│   └── tailwind.config.js
├── backend/                  # Node.js Backend
│   ├── src/
│   │   ├── controllers/     # Route Controllers
│   │   ├── models/          # Database Models
│   │   ├── routes/          # API Routes
│   │   ├── middleware/      # Custom Middleware
│   │   └── services/        # Business Logic
│   ├── package.json
│   └── server.js
├── docs/                    # Documentation
└── README.md
```

## 🎨 Design System

### Color Palette

- **Primary Green**: `#10B981` (Emerald-500)
- **Secondary Blue**: `#3B82F6` (Blue-500)
- **Background**: `#F8FAFC` (Slate-50)
- **Text**: `#1E293B` (Slate-800)
- **Accent**: `#F59E0B` (Amber-500)

### Typography

- **Font Family**: Poppins, Inter
- **Heading**: Poppins (Semi-bold)
- **Body**: Inter (Regular)

## 🤝 Contributing

Kami menyambut kontribusi dari komunitas! Silakan baca [CONTRIBUTING.md](CONTRIBUTING.md) untuk panduan berkontribusi.

## 📄 License

Proyek ini dilisensikan di bawah MIT License - lihat file [LICENSE](LICENSE) untuk detail.

## 🏆 Lomba Esai Nasional 2025

Proyek ini dibuat untuk Lomba Esai Nasional 2025 yang diselenggarakan oleh Himpunan Mahasiswa Psikologi Universitas Trunojoyo Madura dengan tema "Generasi Muda dan Kecerdasan Buatan: Kolaborasi Cerdas untuk Perubahan Berkelanjutan".

**Subtema**: Lingkungan
**Judul Gagasan**: "Klasifikasi Sampah Cerdas Menggunakan Deep Learning dan Arsitektur Convolutional Neural Network (CNN)"

## 📞 Kontak

- Email: pilahpintar@example.com
- Website: https://pilahpintar.vercel.app
- Instagram: @pilahpintar

---

**PilahPintar** - Memilah Sampah dengan Cerdas, Demi Bumi yang Lestari 🌍♻️
