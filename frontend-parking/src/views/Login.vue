<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const router = useRouter();

const handleLogin = async () => {
    try {
        const response = await api.post('/users/login', {
            email: email.value,
            password: password.value
        });
        localStorage.setItem('token', response.data.accessToken);
        router.push('/dashboard');
    } catch (error) {
        errorMessage.value = 'Email atau password salah';
    }
};
</script>

<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
        <div class="bg-white p-8 rounded shadow-md w-96">
            <h2 class="text-2xl font-bold mb-6 text-center">Login Kasir Parkir</h2>
            <form @submit.prevent="handleLogin" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium mb-1">Email</label>
                    <input v-model="email" type="email" required class="w-full border p-2 rounded" />
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Password</label>
                    <input v-model="password" type="password" required class="w-full border p-2 rounded" />
                </div>
                <p v-if="errorMessage" class="text-red-500 text-sm">{{ errorMessage }}</p>
                <button type="submit" class="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                    Masuk
                </button>
            </form>
        </div>
    </div>
</template>