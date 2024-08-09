import { createWebHistory, createRouter } from "vue-router";
import Login from "../components/login.vue";
import MainSidebar from "../components/sidebar/main.vue";

const routes = [
    {
        path: "/",
        component: Login
    },
    {
        path: "/mainsidebar",
        component: MainSidebar,
        children:[

        ],
    },
];
const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
