import { createWebHistory, createRouter } from "vue-router";
import axios from "axios";  // Import axios untuk refresh token
import Login from "../components/login.vue";
import MainSidebar from "../components/sidebar/main.vue";
import Dashboard from "../components/sidebar/dashboard.vue";
import Peminjaman from "../components/sidebar/peminjaman.vue";
import Siswa from "../components/sidebar/datasiswa.vue";
import Alat from "../components/sidebar/dataalat.vue";
import Bengkel from "../components/sidebar/databengkel.vue";
import Datapinjaman from "../components/sidebar/datapinjaman.vue";
import Databermasalah from "../components/sidebar/dataBermasalah.vue";
import Pengembalian from "../components/sidebar/pengembalian.vue";

// Flag untuk memulai interval refresh token
let tokenRefreshStarted = false;

// Fungsi untuk memulai interval refresh token
function startTokenRefresh() {
    const tokenAge = 50; // Misalkan durasi token dalam detik
    const refreshTime = (tokenAge - 10) * 1000; // Mengubah ke milidetik
    console.log('Starting token refresh interval...'); // Debugging

    setInterval(async () => {
        try {
            console.log('Refreshing access token...');
            const refreshToken = localStorage.getItem('refreshToken');
            const response = await axios.put('http://localhost:3000/authentications', { refreshToken });

            if (response.data.status === 'success') {
                const { accessToken } = response.data.data;
                localStorage.setItem('accessToken', accessToken);
                console.log('Access token updated:', accessToken); // Debugging
            }
        } catch (error) {
            console.error('Error refreshing token:', error);
        }
    }, refreshTime);
}

const routes = [
    { path: "/", component: Login },
    {
        path: "/mainsidebar",
        component: MainSidebar,
        beforeEnter: (to, from, next) => {
            const accessToken = localStorage.getItem('accessToken');
            if (accessToken) {
                // Memastikan interval refresh token hanya dimulai sekali
                if (!tokenRefreshStarted) {
                    tokenRefreshStarted = true; // Set flag agar tidak dipanggil lagi
                    startTokenRefresh(); // Mulai interval refresh token
                }
                next();
            } else {
                next({ path: '/' });
            }
        },
        children: [
            { path: "dashboard", component: Dashboard },
            { path: "datapinjaman", component: Datapinjaman },
            { path: "siswa", component: Siswa },
            { path: "bengkel", component: Bengkel },
            { path: "alat", component: Alat },
            { path: "pinjaman_bermasalah", component: Databermasalah },
            { path: "peminjaman", component: Peminjaman },
            { path: "pengembalian", component: Pengembalian },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
