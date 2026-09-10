const mongoose = require('mongoose');

const parkingSchema = new mongoose.Schema({
    platNomor: { type: String, required: true },
    waktuMasuk: { type: Date, default: Date.now },
    waktuKeluar: { type: Date },
    biaya: { type: Number, default: 0 },
    status: { type: String, enum: ['IN', 'OUT'], default: 'IN' },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null }
});

parkingSchema.index({ platNomor: 1, status: 1 });
parkingSchema.index({ waktuMasuk: -1 });

module.exports = mongoose.model('Parking', parkingSchema);