<template>
<!--Main Navigation-->
<header>
    <!-- Navbar -->
    <nav id="main-navbar" class="navbar navbar-expand-lg fixed-top">
        <!-- Container wrapper -->
        <div class="container">
            <!-- Brand -->
            <a class="navbar-brand" href="/">
                <div class="name_brand">MyLoanTool</div>
                <div class="name_desc">Peminjaman Alat Bengkel</div>
            </a>
            <!-- Toggle button -->
            <button @click="toggleNavbar" class="navbar-toggler" type="button]">
                <i class="fas fa-bars" style="color: white;"></i>
            </button>
            <!-- Navbar links -->
            <div class="collapse navbar-collapse" :class="{ show: navbarOpen }">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <router-link to="/mainsidebar/dashboard" class="nav-link" @click="closeNavbar">
                            Dashboard
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/mainsidebar/peminjaman" class="nav-link" @click="closeNavbar">
                            Peminjaman
                        </router-link>
                    </li>
                    <li class="nav-item dropdown" :class="{ active: isActiveDropdown(['datapinjaman', 'pinjaman_bermasalah',]) }">
                        <a class="nav-link dropdown-toggle" href="#" id="dataPinjamanDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Data Pinjaman
                        </a>
                        <ul class="dropdown-menu" aria-labelledby="dataPinjamanDropdown">
                            <li>
                                <router-link to="/mainsidebar/datapinjaman" class="dropdown-item" @click="closeNavbar">
                                    Pinjaman Dikembalikan
                                </router-link>
                            </li>
                            <li>
                                <router-link to="/mainsidebar/pinjaman_bermasalah" class="dropdown-item" @click="closeNavbar">
                                    Pinjaman Bermasalah
                                </router-link>
                            </li>
                        </ul>
                    </li>
                    <li class="nav-item dropdown" :class="{ active: isActiveDropdown(['siswa', 'alat', 'bengkel']) }">
                        <a class="nav-link dropdown-toggle" href="#" id="dataMasterDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Data Master
                        </a>
                        <ul class="dropdown-menu" aria-labelledby="dataMasterDropdown">
                            <li>
                                <router-link to="/mainsidebar/siswa" class="dropdown-item" @click="closeNavbar">
                                    Siswa
                                </router-link>
                            </li>
                            <li>
                                <router-link to="/mainsidebar/alat" class="dropdown-item" @click="closeNavbar">
                                    Alat
                                </router-link>
                            </li>
                            <li>
                                <router-link to="/mainsidebar/bengkel" class="dropdown-item" @click="closeNavbar">
                                    Bengkel
                                </router-link>
                            </li>
                        </ul>
                    </li>
                </ul>
                <!-- Logout -->
                <ul class="navbar-nav ms-3">
                    <li class="nav-logout">
                        <router-link to="" class="nav-link nav-logout" @click="closeNavbar" @click.prevent="handleLogout">
                            Logout
                        </router-link>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    <!-- Navbar -->
</header>
<!--Main Navigation-->

<!--Main layout-->
<main>
    <div class="container pt-4">
        <router-view></router-view>
    </div>
</main>
<!--Main layout-->
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";

export default {
    data() {
        return {
            navbarOpen: false,
        };
    },
    methods: {
        toggleNavbar() {
            this.navbarOpen = !this.navbarOpen;
        },
        closeNavbar() {
            this.navbarOpen = false;
        },
        async handleLogout() {
            // Konfirmasi Logout menggunakan SweetAlert2
            const result = await Swal.fire({
                title: "Apakah Anda yakin?",
                text: "Anda akan keluar dari akun!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Ya, keluar!",
                cancelButtonText: "Batal",
            });

            if (result.isConfirmed) {
                const refreshToken = localStorage.getItem("refreshToken");

                if (refreshToken) {
                    try {
                        // Kirim permintaan DELETE untuk logout dari backend
                        await axios.delete("http://localhost:3000/authentications", {
                            data: {
                                refreshToken: refreshToken,
                            },
                        });

                        // Setelah berhasil, hapus token dari localStorage
                        localStorage.removeItem("accessToken");
                        localStorage.removeItem("refreshToken");

                        // Tampilkan pesan sukses
                        Swal.fire({
                            title: "Logout Berhasil!",
                            text: "Anda telah keluar.",
                            icon: "success",
                            confirmButtonColor: "#3085d6",
                        }).then(() => {
                            // Redirect ke halaman login setelah SweetAlert ditutup
                            this.$router.push("/");
                        });
                    } catch (error) {
                        console.error("Logout gagal:", error);

                        // Tampilkan pesan error
                        Swal.fire({
                            title: "Logout Gagal",
                            text: "Terjadi kesalahan saat logout.",
                            icon: "error",
                            confirmButtonColor: "#d33",
                        });
                    }
                } else {
                    // Jika tidak ada refresh token, langsung logout
                    this.$router.push("/");
                }
            }
        },
        isActiveDropdown(routes) {
            // Periksa apakah rute saat ini cocok dengan salah satu rute yang diberikan
            return routes.some((route) => this.$route.path.includes(route));
        },
    },
};
</script>

<style>
/* Menggunakan gradasi warna untuk navbar */
.navbar {
    background: linear-gradient(90deg, #4b6cb7, #182848);
    box-shadow: 0 4px 8px 0 rgba(92, 91, 91, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    height: 80px;
    width: 100%;
}

/* Menyelaraskan gaya merek */
.name_brand {
    font-family: "Poppins", sans-serif;
    font-size: 1.35rem;
    font-weight: bold;
    color: #f8c291;
}

.name_desc {
    font-family: "Poppins", sans-serif;
    font-size: 0.8rem;
    color: #f0efef;
}

/* Styling untuk tautan di navbar */
.navbar-nav .nav-item .nav-link {
    color: white;
    font-weight: bold;
    font-family: "Poppins", sans-serif;
    margin-right: 20px;
    transition: color 0.3s ease;
}

.navbar-nav .nav-item .nav-link.router-link-active {
    color: #f8c291;
    /* Sama seperti warna saat hover */
    font-weight: bold;
    /* Misalnya, Anda ingin lebih menonjolkan */
}

.navbar-nav .dropdown-item.router-link-active {
    background-color: #34495e;
    /* Gaya aktif */
    color: #f8c291;
    /* Sama seperti hover */
    font-weight: bold;
}

.navbar-nav .nav-item .nav-link:hover {
    color: #f8c291;
}

/* Logout link styling dengan warna berbeda */
.nav-logout .nav-link {
    color: #e74c3c;
    font-weight: bold;
    margin-left: 20px;
    transition: color 0.3s ease;
}

.nav-logout .nav-link:hover {
    color: #c0392b;
}

/* Styling untuk dropdown menu */
.navbar-nav .dropdown-menu {
    background-color: #2c3e50;
    border: none;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.navbar-nav .dropdown-item {
    color: white;
    font-family: "Poppins", sans-serif;
}

.navbar-nav .dropdown-item:hover {
    background-color: #34495e;
    color: #f8c291;
}

.nav-item.dropdown.active > .nav-link {
  color: #f8c291; /* Gaya aktif */
  font-weight: bold;
}

.main {
    padding-top: 70px;
}

/* Responsif untuk layar kecil */
@media (max-width: 768px) {
    .navbar {
        height: auto;
        padding: 10px;
    }

    .navbar-brand {
        flex-direction: column;
        align-items: flex-start;
        margin-left: 1.5rem;
    }

    .navbar-nav .nav-item .nav-link {
        margin-right: 0;
        margin-left: 1.5rem;
        margin-bottom: 10px;
    }

    .navbar-nav {
        flex-direction: column;
        align-items: flex-start;
    }

    .nav-logout {
        margin-top: 5px;
        margin-left: -0.8rem;
    }

    .navbar-collapse {
        text-align: left;
    }
}

@media screen and (max-width: 450px) {
    .navbar-nav .dropdown-menu {
        margin-left: 1.3rem;
    }
}
</style>
