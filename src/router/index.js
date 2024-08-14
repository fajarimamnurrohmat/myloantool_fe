import { createWebHistory, createRouter } from "vue-router";
import Login from "../components/login.vue";
import MainSidebar from "../components/sidebar/main.vue";
import Dashboard from "../components/sidebar/dashboard.vue";
import Peminjaman from "../components/sidebar/peminjaman.vue";
import Siswa from "../components/sidebar/datasiswa.vue";
import Alat from "../components/sidebar/dataalat.vue";
import Bengkel from "../components/sidebar/databengkel.vue";
import Datapinjaman from "../components/sidebar/datapinjaman.vue";
import Databengkel from "../components/sidebar/databengkel.vue";

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
                path: "peminjaman",
                component: Peminjaman,
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
                component: Databengkel,
            },
            {
                path: "alat",
                component: Alat,
            },
        ],
    },
];
const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
