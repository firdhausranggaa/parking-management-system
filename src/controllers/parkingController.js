const Parking = require('../models/Parking');

// Fungsi Kendaraan Masuk
exports.kendaraanMasuk = async (req, res) => {
    try {
        const { platNomor } = req.body;
        const parkirBaru = new Parking({ platNomor });
        await parkirBaru.save();

        res.status(201).json({
            message: 'Kendaraan berhasil masuk',
            data: parkirBaru
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Fungsi Kendaraan Keluar
exports.kendaraanKeluar = async (req, res) => {
    try {
        const { id } = req.params;
        const parkir = await Parking.findById(id);

        if (!parkir || parkir.status === 'OUT') {
            return res.status(404).json({ message: 'Data parkir tidak ditemukan atau kendaraan sudah keluar' });
        }

        parkir.waktuKeluar = Date.now();
        parkir.status = 'OUT';

        // Kalkulasi durasi (dalam milidetik dikonversi ke jam)
        const durasiMs = new Date(parkir.waktuKeluar).getTime() - new Date(parkir.waktuMasuk).getTime();
        const durasiJam = Math.ceil(durasiMs / (1000 * 60 * 60)); // pembulatan ke atas untuk jam

        const tarifPerJam = 5000;
        parkir.biaya = durasiJam * tarifPerJam || tarifPerJam; // Jika kurang dari 1 jam, tetap bayar 1 jam

        await parkir.save();

        res.status(200).json({
            message: 'Kendaraan berhasil keluar',
            data: parkir
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Fungsi Read All: Melihat semua data parkir
exports.lihatSemuaParkir = async (req, res) => {
    try {
        // 1. Menangkap nilai dari URL Query
        const { page = 1, limit = 10, status, tanggalAwal, tanggalAkhir } = req.query;

        // 2. Membangun filter pencarian
        let query = { isDeleted: false };

        // Filter berdasarkan status kendaraan (IN atau OUT)
        if (status) {
            query.status = status.toUpperCase();
        }

        // Filter berdasarkan rentang tanggal masuk
        if (tanggalAwal || tanggalAkhir) {
            query.waktuMasuk = {};
            if (tanggalAwal) query.waktuMasuk.$gte = new Date(tanggalAwal);
            if (tanggalAkhir) query.waktuMasuk.$lte = new Date(tanggalAkhir);
        }

        // 3. Kalkulasi data yang harus dilewati (Skip)
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // 4. Eksekusi pencarian ke MongoDB
        const dataParkir = await Parking.find(query)
            .sort({ waktuMasuk: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        // 5. Hitung total data untuk info halaman
        const totalData = await Parking.countDocuments(query);
        const totalPages = Math.ceil(totalData / parseInt(limit));

        // 6. Mengembalikan data beserta metadata pagination
        res.json({
            message: 'Data parkir berhasil diambil',
            data: dataParkir,
            pagination: {
                totalData,
                totalPages,
                currentPage: parseInt(page),
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Fungsi Delete: Menghapus data parkir secara "Soft Deletion" (Hanya Admin)
exports.hapusDataParkir = async (req, res) => {
    try {
        const parkir = await Parking.findById(req.params.id);
        if (!parkir || parkir.isDeleted) {
            return res.status(404).json({ message: 'Data tidak ditemukan atau sudah dihapus' });
        }

        parkir.isDeleted = true;
        parkir.deletedAt = Date.now();
        await parkir.save();

        res.json({ message: 'Data parkir berhasil dipindahkan ke arsip (Soft Deleted)' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};