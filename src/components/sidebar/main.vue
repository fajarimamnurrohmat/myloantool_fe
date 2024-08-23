<template>
  <!--Main Navigation-->
  <header>
    <!-- Navbar -->
    <nav id="main-navbar" class="navbar navbar-expand-lg fixed-top">
      <!-- Container wrapper -->
      <div class="container">
        <!-- Brand -->
        <a class="navbar-brand" href="#">
          <div class="name_brand">MyLoanTool</div>
          <div class="name_desc">Peminjaman Alat Bengkel</div>
        </a>
        <!-- Toggle button -->
        <button @click="toggleNavbar" class="navbar-toggler" type="button">
          <i class="fas fa-bars"></i>
        </button>
        <!-- Navbar links -->
        <div class="collapse navbar-collapse" :class="{ show: navbarOpen }">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link
                to="/mainsidebar/dashboard"
                class="nav-link"
                @click="closeNavbar"
              >
                Dashboard
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                to="/mainsidebar/peminjaman"
                class="nav-link"
                @click="closeNavbar"
              >
                Peminjaman
              </router-link>
            </li>
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                id="dataPinjamanDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Data Pinjaman
              </a>
              <ul class="dropdown-menu" aria-labelledby="dataPinjamanDropdown">
                <li>
                  <router-link
                    to="/mainsidebar/datapinjaman"
                    class="dropdown-item"
                    @click="closeNavbar"
                  >
                    Pinjaman Dikembalikan
                  </router-link>
                </li>
                <li>
                  <router-link
                    to="/mainsidebar/pinjaman_bermasalah"
                    class="dropdown-item"
                    @click="closeNavbar"
                  >
                    Pinjaman Bermasalah
                  </router-link>
                </li>
              </ul>
            </li>
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                id="dataMasterDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Data Master
              </a>
              <ul class="dropdown-menu" aria-labelledby="dataMasterDropdown">
                <li>
                  <router-link
                    to="/mainsidebar/siswa"
                    class="dropdown-item"
                    @click="closeNavbar"
                  >
                    Siswa
                  </router-link>
                </li>
                <li>
                  <router-link
                    to="/mainsidebar/alat"
                    class="dropdown-item"
                    @click="closeNavbar"
                  >
                    Alat
                  </router-link>
                </li>
                <li>
                  <router-link
                    to="/mainsidebar/bengkel"
                    class="dropdown-item"
                    @click="closeNavbar"
                  >
                    Bengkel
                  </router-link>
                </li>
              </ul>
            </li>
          </ul>
          <!-- Logout -->
          <ul class="navbar-nav ms-3">
            <li class="nav-logout">
              <router-link
                to=""
                class="nav-link nav-logout"
                @click="closeNavbar"
              >
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
  },
};
</script>

<style>
/* Menggunakan gradasi warna untuk navbar */
.navbar {
  background: linear-gradient(90deg, #4b6cb7, #182848);
  border-radius: 5px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  height: 80px;
}

/* Menyelaraskan gaya merek */
.name_brand {
  font-family: "Poppins", sans-serif;
  font-size: 1.35rem;
  font-weight: bold;
  color: #f8c291;
  font-style: italic;
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
  }
  .navbar-nav .nav-item .nav-link {
    margin-right: 0;
    margin-bottom: 10px;
  }
  .navbar-nav {
    flex-direction: column;
    align-items: flex-start;
  }
  .nav-logout {
    margin-top: 10px;
  }
  .navbar-collapse {
    text-align: left;
  }
}
</style>
