import { createWebHistory, createRouter } from "vue-router";
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

const routes = [
    {
        path: "/",
        component: Login
    },
    {
        path: "/mainsidebar",
        component: MainSidebar,
        children:[
            {
                path: "dashboard",
                component: Dashboard,
            },
            {
                path: "datapinjaman",
                component: Datapinjaman,
            },
            {
                path: "siswa",
                component: Siswa,
            },
            {
                path: "bengkel",
                component: Bengkel,
            },
            {
                path: "alat",
                component: Alat,
            },
            {
                path: "pinjaman_bermasalah",
                component: Databermasalah,
            },
            {
                path: "peminjaman",
                component: Peminjaman, 
            },
            {
                path: "pengembalian",
                component: Pengembalian,
            },
        ],
    },
];
const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
