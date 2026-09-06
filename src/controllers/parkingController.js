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
        // Hanya mencari data di mana isDeleted adalah false
        const dataParkir = await Parking.find({ isDeleted: false });
        res.json(dataParkir);
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