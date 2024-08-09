<template>
  <!--Main Navigation-->
  <header>
    <!-- Navbar -->
    <nav
      id="main-navbar"
      class="navbar navbar-expand-lg navbar-light fixed-top"
    >
      <!-- Container wrapper -->
      <div class="container">
        <!-- Brand -->
        <a class="navbar-brand" href="#">
          <div class="name_brand">MyLoanTool</div>
          <div class="name_desc">Peminjaman Alat Bengkel</div>
        </a>
        <!-- Toggle button -->
        <button @click="toggleSidebar">
          <i class="fas fa-bars"></i>
        </button>
      </div>
      <!-- Container wrapper -->
    </nav>
    <!-- Navbar -->
    <!-- Sidebar -->
    <nav
      id="sidebarMenu"
      :class="{ show: sidebarOpen }"
      class="collapse d-lg-block sidebar collapse"
    >
      <div class="position-sticky">
        <div class="list-group list-group-flush mx-3 mt-5">
          <router-link
            to="/mainsidebar/order"
            class="list-group-item list-group-item-action py-2 ripple"
            aria-current="true"
            @click="closeSidebar"
          >
            <i class="fas fa-tachometer-alt fa-fw me-3"></i
            ><span>Dashboard</span>
          </router-link>
          <router-link
            to="/mainsidebar/detailorder"
            class="list-group-item list-group-item-action py-2 ripple"
            aria-current="true"
            @click="closeSidebar"
          >
            <i class="fas fa-chart-line fa-fw me-3"></i
            ><span>Peminjaman</span>
          </router-link>
          <router-link
            to="/mainsidebar/category"
            class="list-group-item list-group-item-action py-2 ripple"
            aria-current="true"
            @click="closeSidebar"
          >
            <i class="fas fa-chart-bar fa-fw me-3"></i><span>Data Pinjaman</span>
          </router-link>

          <router-link
            to="/mainsidebar/produk"
            class="list-group-item list-group-item-action py-2 ripple"
            aria-current="true"
            @click="closeSidebar"
          >
            <i class="fas fa-chart-bar fa-fw me-3"></i><span>Data Master</span>
          </router-link>
        </div>
      </div>
      <div class="logout-section">
        <a class="logout" href="#">
          <div class="name_logout" style="color: red">Logout</div>
        </a>
      </div>
    </nav>
    <!-- Sidebar -->
  </header>
  <!--Main Navigation-->

  <!--Main layout-->
  <main :style="{ marginLeft: sidebarOpen ? '250px' : '0' }">
    <!-- Adjust marginLeft instead of marginTop -->
    <div class="container pt-4">
      <router-view></router-view>
    </div>
  </main>
  <!--Main layout-->
</template>

<script>
import { RouterView } from "vue-router";

export default {
  data() {
    return {
      sidebarOpen: true,
    };
  },
  methods: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
    },
    closeSidebar() {
      this.sidebarOpen = false;
    },
  },
};
</script>

<style>
.name_brand {
  font-family: "Poppins", sans-serif;
  font-size: 1.5rem;
  font-weight: bold;
  color: black;
  font-style: italic;
}
.name_desc {
  font-family: "Poppins", sans-serif;
  font-size: 0.6rem;
  color: black;
}

body {
  background-color: #fbfbfb;
}

.sidebar {
  background-color: gainsboro;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  padding: 58px 0 0; /* Height of navbar */
  box-shadow: 0 2px 5px 0 rgb(0 0 0 / 5%), 0 2px 10px 0 rgb(0 0 0 / 5%);
  width: 270px;
  z-index: 600;
  transition: left 0.3s ease; /* Animasi saat toggler diklik */
  left: -300px; /* Sidebar secara default tersembunyi */
}

.sidebar.show {
  left: 0; /* Tampilkan sidebar saat kelas 'show' ditambahkan */
}

@media (max-width: 991.98px) {
  .sidebar {
    width: 270px; /* Set the width for mobile devices */
  }
}

.sidebar .active {
  border-radius: 5px;
  box-shadow: 0 2px 5px 0 rgb(0 0 0 / 16%), 0 2px 10px 0 rgb(0 0 0 / 12%);
}

.sidebar-sticky {
  position: relative;
  top: 0;
  height: calc(100vh - 48px);
  padding-top: 0.5rem;
  overflow-x: hidden;
  overflow-y: auto; /* Scrollable contents if viewport is shorter than content. */
}

.list-group-item {
  background-color: gainsboro;
  margin-bottom: 40px;
}

.navbar {
  background-color: gainsboro;
  border-radius: 5px;
  box-shadow: 0 2px 5px 0 rgb(0 0 0 / 16%), 0 2px 10px 0 rgb(0 0 0 / 12%);
  height: 70px;
}

.logout-section {
  position: absolute;
  bottom: 20px;
  width: 100%;
  text-align: center;
}

.logout {
  display: block;
  padding: 10px 0;
  text-decoration: none;
}

main {
  transition: margin-left 0.3s ease; /* Add transition for smooth animation */
}

.router-view {
  min-height: calc(100vh - 70px); /* Adjust the min-height */
}
</style>
