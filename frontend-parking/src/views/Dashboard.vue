<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

const parkingData = ref([]);
const platNomorBaru = ref('');
const router = useRouter();

// Mengambil data parkir
const fetchParkingData = async () => {
    try {
        const response = await api.get('/parking');
        // Menyesuaikan dengan format JSON dari fitur Pagination backend
        parkingData.value = response.data.data || response.data || [];
    } catch (error) {
        console.error("Gagal mengambil data", error);
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            handleLogout();
        }
    }
};

// Fungsi Kendaraan Masuk (POST)
const inputKendaraan = async () => {
    if (!platNomorBaru.value) return;
    try {
        await api.post('/parking/in', { platNomor: platNomorBaru.value });
        platNomorBaru.value = ''; // Kosongkan form setelah sukses
        fetchParkingData(); // Refresh tabel otomatis
    } catch (error) {
        alert('Gagal menginput kendaraan');
    }
};

// Fungsi Kendaraan Keluar (PUT)
const prosesKeluar = async (id) => {
    try {
        await api.put(`/parking/out/${id}`);
        fetchParkingData(); // Refresh tabel otomatis untuk melihat update biaya
    } catch (error) {
        alert('Gagal memproses kendaraan keluar');
    }
};

const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
};

onMounted(() => {
    fetchParkingData();
});
</script>

<template>
    <div class="min-h-screen bg-gray-100 p-8">
        <div class="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-2xl font-bold text-gray-800">Dashboard Sistem Parkir</h1>
                <button @click="handleLogout" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                    Logout
                </button>
            </div>

            <!-- Form Input Kendaraan Baru -->
            <div class="mb-6 flex gap-4 bg-gray-50 p-4 rounded border border-gray-200">
                <input v-model="platNomorBaru" type="text" placeholder="Masukkan Plat Nomor (Misal: L 1234 AB)"
                    class="border border-gray-300 p-2 rounded flex-1 focus:outline-blue-500" />
                <button @click="inputKendaraan"
                    class="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700">
                    + Kendaraan Masuk
                </button>
            </div>

            <!-- Tabel Data Parkir -->
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-gray-800 text-white">
                            <th class="p-3 border">Plat Nomor</th>
                            <th class="p-3 border">Waktu Masuk</th>
                            <th class="p-3 border">Status</th>
                            <th class="p-3 border">Biaya</th>
                            <th class="p-3 border text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in parkingData" :key="item._id" class="hover:bg-gray-50 border-b">
                            <td class="p-3 border font-semibold">{{ item.platNomor }}</td>
                            <td class="p-3 border">{{ new Date(item.waktuMasuk).toLocaleString('id-ID') }}</td>
                            <td class="p-3 border font-bold"
                                :class="item.status === 'IN' ? 'text-green-600' : 'text-gray-500'">
                                {{ item.status }}
                            </td>
                            <td class="p-3 border">Rp {{ item.biaya.toLocaleString('id-ID') }}</td>
                            <td class="p-3 border text-center">
                                <!-- Tombol Checkout hanya muncul jika status masih IN -->
                                <button v-if="item.status === 'IN'" @click="prosesKeluar(item._id)"
                                    class="bg-orange-500 text-white px-3 py-1 rounded text-sm font-semibold hover:bg-orange-600 transition">
                                    Checkout
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>