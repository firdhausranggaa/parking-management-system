const Parking = require('../models/Parking');

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

exports.kendaraanKeluar = async (req, res) => {
    try {
        const { id } = req.params;
        const parkir = await Parking.findById(id);

        if (!parkir || parkir.status === 'OUT') {
            return res.status(404).json({ message: 'Data parkir tidak ditemukan atau kendaraan sudah keluar' });
        }

        parkir.waktuKeluar = Date.now();
        parkir.status = 'OUT';

        const durasiMs = new Date(parkir.waktuKeluar).getTime() - new Date(parkir.waktuMasuk).getTime();
        const durasiJam = Math.ceil(durasiMs / (1000 * 60 * 60));

        const tarifPerJam = 5000;
        parkir.biaya = durasiJam * tarifPerJam || tarifPerJam;

        await parkir.save();

        res.status(200).json({
            message: 'Kendaraan berhasil keluar',
            data: parkir
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.lihatSemuaParkir = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, tanggalAwal, tanggalAkhir } = req.query;

        let query = { isDeleted: false };

        if (status) {
            query.status = status.toUpperCase();
        }

        if (tanggalAwal || tanggalAkhir) {
            query.waktuMasuk = {};
            if (tanggalAwal) query.waktuMasuk.$gte = new Date(tanggalAwal);
            if (tanggalAkhir) query.waktuMasuk.$lte = new Date(tanggalAkhir);
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const dataParkir = await Parking.find(query)
            .sort({ waktuMasuk: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const totalData = await Parking.countDocuments(query);
        const totalPages = Math.ceil(totalData / parseInt(limit));

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

exports.getStatistik = async (req, res) => {
    try {
        const hariIni = new Date();
        hariIni.setHours(0, 0, 0, 0);

        const statistik = await Parking.aggregate([
            {
                $facet: {
                    "pendapatanHariIni": [
                        { $match: { waktuKeluar: { $gte: hariIni }, status: 'OUT', isDeleted: false } },
                        { $group: { _id: null, totalPendapatan: { $sum: "$biaya" }, jumlahKendaraanKeluar: { $sum: 1 } } }
                    ],
                    "kendaraanAktif": [
                        { $match: { status: 'IN', isDeleted: false } },
                        { $count: "jumlahKendaraanParkir" }
                    ]
                }
            }
        ]);

        const hasil = {
            totalPendapatanHariIni: statistik[0].pendapatanHariIni[0]?.totalPendapatan || 0,
            kendaraanKeluarHariIni: statistik[0].pendapatanHariIni[0]?.jumlahKendaraanKeluar || 0,
            kendaraanSedangParkir: statistik[0].kendaraanAktif[0]?.jumlahKendaraanParkir || 0
        };

        res.json({ message: 'Statistik berhasil diambil', data: hasil });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};