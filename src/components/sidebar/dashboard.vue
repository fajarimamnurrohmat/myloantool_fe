<template>
  <div style="text-align: left">
    <h2 class="welcome-header">
      Data Overview
    </h2>
  </div>

  <div class="card-main-container">
  <!-- Kolom Kiri: Data Alat dan Data Pinjaman -->
  <div class="card-container">
    <!-- Card 1: Data Alat -->
    <div class="card-dashboard-1">
      <i class="fa-solid fa-screwdriver-wrench"></i>
      <h2>Data Alat</h2>
      <p>Jumlah alat saat ini</p>
      <h1>50</h1>
        <router-link to="/mainsidebar/alat" class="card-link">Lihat data alat</router-link>
    </div>

    <!-- Card 2: Data Pinjaman -->
    <div class="card-dashboard-2">
      <i class="fa-solid fa-inbox"></i>
      <h2>Data Pengembalian</h2>
      <p>Jumlah pengembalian saat ini</p>
      <h1>50</h1>
      <router-link to="/mainsidebar/datapinjaman" class="card-link">Lihat data pengembalian</router-link>
    </div>
  </div>

  <!-- Kolom Kanan: Data Pengembalian -->
  <div class="card-container">
    <!-- Card 1: Data Pengembalian -->
    <div class="card-dashboard-2" >
      <i class="fa-solid fa-triangle-exclamation"></i>
      <h2>Data Pengembalian Bermasalah</h2>
      <p>Jumlah pengembalian bermasalah saat ini</p>
      <h1>20</h1>
      <router-link to="/mainsidebar/pinjaman_bermasalah" class="card-link">Lihat data pengembalian bermasalah</router-link>
    </div>

    <!-- Card 2: Data Pengembalian Bermasalah -->
    <div class="card-dashboard-1">
      <i class="fa-solid fa-people-robbery"></i>
      <h2>Data Pinjaman</h2>
      <p>Jumlah pinjaman saat ini</p>
      <h1>20</h1>
      <router-link to="/mainsidebar/peminjaman" class="card-link">Lihat data pinjaman</router-link>
    </div>
  </div>
</div>

</template>

<style>
/* Styling untuk header Selamat Datang */
.welcome-header {
  font-weight: bold;
  color: #274278;
  margin-top: 3rem;
  animation: fadeInDown 1s ease-in-out;
}

/* Keyframes untuk animasi fadeIn */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-dashboard-1 {
  flex: 3;
  color: white;
  background-color: #395eb6;
  height: 200px;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s, box-shadow 0.3s;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-dashboard-1:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
}

.card-dashboard-1,
.card-dashboard-2 {
  max-width: 550px;
  width: 100%;
  margin: 0 auto;
}

.card-dashboard-1 i,
.card-dashboard-2 i {
  font-size: 24px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  padding: 15px;
  display: flex;
  margin-left: auto;
  margin-right: auto;
  align-items: center;
  justify-content: center;
  color: white;
  width: 50px;
  height: 50px;
  margin-bottom: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card-dashboard-2 {
  color: white;
  background-color: #182848;
  height: 500px;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s, box-shadow 0.3s;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-dashboard-2:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
}

.card-link {
  color: #242322;
  text-decoration: none;
  font-weight: bold;
  font-size: 16px;
  margin-top: 20px;
  display: inline-block;
  position: relative;
  background-color: hwb(0 100% 0%);
  transition: color 0.3s, background-color 0.3s;
  padding: 10px 15px;
  border-radius: 8px;
}

.card-link:hover {
  color: white;
  background-color: #91bef8;
}

.card-link:active {
  transform: scale(0.98);
}

.card-main-container {
  display: flex;
  gap: 20px;
  margin-top: 30px;
}

.card-container {
  display: flex;
  flex: 2;
  flex-direction: column;
  gap: 20px;
}

.card-container:first-child {
  flex: 1;
}

.card-container:last-child {
  flex: 1;
}


@media (max-width: 768px) {
  .welcome-header {
    margin-top: 5rem;
    font-size: 2rem;
    margin-bottom: 3rem;
  }

  .card-container {
    flex-direction: column;
    align-items: center;
  }

  .card-dashboard {
    width: 100%;
  }
}

@media screen and (max-width: 450px) {
  .card-main-container {
    flex-direction: column;
    gap: 10px;
    margin-top: 20px;
  }

  .card-dashboard-1 {
    height: 150px;
    padding: 10px;
    font-size: 14px;
  }

  .card-dashboard-2 {
    height: 100%;
    padding: 10px;
    font-size: 14px;
  }

  .card-dashboard-1 i,
  .card-dashboard-2 i {
    font-size: 20px;
    width: 40px;
    height: 40px;
    padding: 10px;
    margin-left: auto;
    margin-right: auto;
  }

  .card-link {
    font-size: 12px;
    padding: 8px 10px;
  }

  .welcome-header {
    font-size: 1.5rem;
    margin-top: 3rem;
    margin-bottom: -0.2rem;
  }
}
</style>
