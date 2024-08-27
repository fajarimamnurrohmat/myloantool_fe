<template>
    <div style="text-align: center;">
        <h1 class="welcome-header" style="margin-bottom: 1rem;">Selamat Datang, Admin !</h1>
        <h5 class="welcome-subtext">Semoga hari Anda produktif dan penuh kesuksesan dalam mengelola peminjaman alat.</h5>
    </div>

    <div style="display: flex; justify-content: space-between; gap: 20px; margin-top: 30px;">
        <!-- Card 1: Data Alat -->
        <div class="card-dashboard" style="background-color: #4b6cb7;">
            <h2>Data Alat</h2>
            <p>Jumlah alat saat ini</p>
            <h1>50</h1>
            <router-link to="/mainsidebar/alat" class="card-link">Lihat data alat &rarr;</router-link>
        </div>

        <!-- Card 2: Data Pinjaman -->
        <div class="card-dashboard" style="background-color: #182848;">
            <h2>Data Pinjaman</h2>
            <p>Jumlah pinjaman saat ini</p>
            <h1>20</h1>
            <router-link to="/mainsidebar/peminjaman" class="card-link">Lihat data pinjaman &rarr;</router-link>
        </div>
    </div>
</template>

<style>
/* Styling untuk header Selamat Datang */
.welcome-header {
    font-weight: bold;
    color: #274278;
    font-size: 2.5rem;
    margin-bottom: 10px;
    animation: fadeInDown 1s ease-in-out;
}

/* Styling untuk subtext Selamat Datang */
.welcome-subtext {
    font-size: 1.2rem;
    color: #7f8c8d;
    margin-bottom: 20px;
    animation: fadeInUp 1s ease-in-out;
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

/* Style umum untuk card */
.card-dashboard {
    flex: 1;
    color: white;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s, box-shadow 0.3s;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

/* Efek hover untuk card */
.card-dashboard:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
}

/* Style untuk card link */
.card-link {
    color: #f8c291;
    text-decoration: none;
    font-weight: bold;
    font-size: 16px;
    margin-top: 20px;
    display: inline-block;
    position: relative;
    transition: color 0.3s, background-color 0.3s;
    padding: 10px 15px;
    border-radius: 8px;
}

/* Efek hover dan klik untuk card link */
.card-link:hover {
    color: white;
    background-color: #f8c291;
}

.card-link:active {
    background-color: #e67e22;
    color: white;
    transform: scale(0.98);
}

</style>
