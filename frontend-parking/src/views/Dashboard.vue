<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

const parkingData = ref([]);
const platNomorBaru = ref('');
const stats = ref({ pendapatan: 0, keluar: 0, aktif: 0 });
const router = useRouter();

const currentPage = ref(1);
const totalPages = ref(1);
const filterStatus = ref('');
const isProcessing = ref(false);

const userRole = computed(() => {
    const token = localStorage.getItem('token');
    if (!token) return 'operator';
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.role;
    } catch (e) { return 'operator'; }
});

const fetchParkingData = async () => {
    try {
        const response = await api.get(`/parking?page=${currentPage.value}&limit=5&status=${filterStatus.value}`);
        parkingData.value = response.data.data || [];
        totalPages.value = response.data.pagination?.totalPages || 1;
    } catch (error) {
        console.error("Gagal mengambil data parkir", error);
    }
};

const fetchStats = async () => {
    if (userRole.value !== 'admin') return;
    try {
        const response = await api.get('/parking/statistik');
        stats.value = {
            pendapatan: response.data.data.totalPendapatanHariIni,
            keluar: response.data.data.kendaraanKeluarHariIni,
            aktif: response.data.data.kendaraanSedangParkir
        };
    } catch (error) {
        console.error("Gagal mengambil statistik", error);
    }
};

const inputKendaraan = async () => {
    if (!platNomorBaru.value) return;
    isProcessing.value = true;
    try {
        await api.post('/parking/in', { platNomor: platNomorBaru.value.toUpperCase() });
        platNomorBaru.value = '';
        await fetchParkingData();
        if (userRole.value === 'admin') fetchStats();
    } catch (error) {
        alert('Gagal menginput kendaraan');
    } finally {
        isProcessing.value = false;
    }
};

const prosesKeluar = async (id) => {
    try {
        await api.put(`/parking/out/${id}`);
        await fetchParkingData();
        if (userRole.value === 'admin') fetchStats();
    } catch (error) {
        alert('Gagal memproses checkout');
    }
};

const applyFilter = () => {
    currentPage.value = 1;
    fetchParkingData();
};

const changePage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
        fetchParkingData();
    }
};

const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
};

onMounted(() => {
    fetchParkingData();
    fetchStats();
});
</script>

<template>
    <div class="min-h-screen bg-gray-100 p-8">
        <div class="max-w-6xl mx-auto space-y-6">
            <div class="bg-white p-6 rounded-lg shadow-sm flex justify-between items-center">
                <div>
                    <h1 class="text-2xl font-bold text-gray-800">Dashboard Sistem Parkir</h1>
                    <p class="text-sm text-gray-500 mt-1">Status Anda: <span
                            class="uppercase font-bold text-blue-600">{{ userRole }}</span></p>
                </div>
                <button @click="handleLogout"
                    class="bg-red-50 text-red-600 font-semibold px-4 py-2 rounded-lg hover:bg-red-100 transition">
                    Logout
                </button>
            </div>

            <div v-if="userRole === 'admin'" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
                    <p class="text-gray-500 text-sm">Pendapatan Hari Ini</p>
                    <p class="text-2xl font-bold text-gray-800">Rp {{ stats.pendapatan.toLocaleString('id-ID') }}</p>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
                    <p class="text-gray-500 text-sm">Kendaraan Parkir (Aktif)</p>
                    <p class="text-2xl font-bold text-gray-800">{{ stats.aktif }} Unit</p>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-sm border-l-4 border-orange-500">
                    <p class="text-gray-500 text-sm">Kendaraan Keluar (Hari Ini)</p>
                    <p class="text-2xl font-bold text-gray-800">{{ stats.keluar }} Unit</p>
                </div>
            </div>

            <div class="bg-white p-6 rounded-lg shadow-sm">
                <div class="flex flex-col md:flex-row gap-4 justify-between mb-6">
                    <div class="flex gap-2 w-full md:w-1/2">
                        <input v-model="platNomorBaru" type="text" placeholder="Plat Nomor (L 1234 AB)"
                            class="border border-gray-300 p-2 rounded flex-1 focus:ring focus:ring-blue-200 outline-none uppercase"
                            @keyup.enter="inputKendaraan" />
                        <button @click="inputKendaraan" :disabled="isProcessing"
                            class="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 disabled:opacity-50">
                            {{ isProcessing ? 'Memproses...' : '+ Masuk' }}
                        </button>
                    </div>
                    <div class="flex gap-2 items-center">
                        <label class="text-sm text-gray-600">Filter Status:</label>
                        <select v-model="filterStatus" @change="applyFilter"
                            class="border border-gray-300 p-2 rounded bg-white outline-none focus:ring focus:ring-blue-200">
                            <option value="">Semua Data</option>
                            <option value="IN">Masih Parkir (IN)</option>
                            <option value="OUT">Selesai (OUT)</option>
                        </select>
                    </div>
                </div>

                <div class="overflow-x-auto border rounded-lg">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-gray-50 text-gray-700">
                                <th class="p-4 border-b font-semibold">Plat Nomor</th>
                                <th class="p-4 border-b font-semibold">Waktu Masuk</th>
                                <th class="p-4 border-b font-semibold">Status</th>
                                <th class="p-4 border-b font-semibold">Biaya</th>
                                <th class="p-4 border-b font-semibold text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="parkingData.length === 0">
                                <td colspan="5" class="p-8 text-center text-gray-400">Tidak ada data kendaraan
                                    ditemukan.</td>
                            </tr>
                            <tr v-for="item in parkingData" :key="item._id" class="hover:bg-gray-50 transition">
                                <td class="p-4 border-b font-bold text-gray-800">{{ item.platNomor }}</td>
                                <td class="p-4 border-b text-gray-600">{{ new
                                    Date(item.waktuMasuk).toLocaleString('id-ID') }}</td>
                                <td class="p-4 border-b">
                                    <span
                                        :class="item.status === 'IN' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'"
                                        class="px-3 py-1 rounded-full text-xs font-bold">
                                        {{ item.status }}
                                    </span>
                                </td>
                                <td class="p-4 border-b text-gray-700">Rp {{ item.biaya.toLocaleString('id-ID') }}</td>
                                <td class="p-4 border-b text-center">
                                    <button v-if="item.status === 'IN'" @click="prosesKeluar(item._id)"
                                        class="bg-orange-500 text-white px-4 py-1.5 rounded-md text-sm font-semibold hover:bg-orange-600 shadow-sm transition">
                                        Checkout
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="flex justify-between items-center mt-6">
                    <p class="text-sm text-gray-500">Halaman {{ currentPage }} dari {{ totalPages }}</p>
                    <div class="flex gap-2">
                        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1"
                            class="px-4 py-2 border rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
                            Sebelumnya
                        </button>
                        <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages"
                            class="px-4 py-2 border rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
                            Selanjutnya
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>