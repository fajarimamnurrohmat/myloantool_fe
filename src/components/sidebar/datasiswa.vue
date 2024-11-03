<template>
  <!-- Header dan Tombol Tambah Siswa -->
  <div class="header-siswa-container">
    <h3 class="header-siswa">Halaman Data Siswa</h3>
    <button @click="showModal = true" class="btn_add_siswa">
      <i class="fas fa-plus"></i> Inputkan Data
    </button>
  </div>

  <!-- Modal Input/Edit Siswa -->
  <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content-siswa">
      <div class="modal-header">
        <h4>{{ isEditMode ? 'Edit Data Siswa' : 'Input Data Siswa' }}</h4>
        <span class="close-modal" @click="closeModal" style="color: red;">&times;</span>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="nomorInduk">Nomor Induk</label>
          <p>Masukkan nomor induk</p>
          <input type="text" id="nomorInduk" class="form-control" v-model="newSiswa.nomorInduk" :disabled="isEditMode" />
        </div>
        <div class="form-group">
          <label for="namaSiswa">Nama Siswa</label>
          <p>Masukkan nama siswa</p>
          <input type="text" id="namaSiswa" class="form-control" v-model="newSiswa.nama" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="jenisKelamin">Jenis Kelamin</label>
          <p>Pilih jenis kelamin</p>
          <select id="jenisKelamin" class="form-control" v-model="newSiswa.jenisKelamin">
            <option value="">Pilih jenis kelamin</option>
            <option value="Laki-laki">Laki-laki</option>
            <option value="Perempuan">Perempuan</option>
          </select>
        </div>
        <div class="form-group">
          <label for="jurusan">Jurusan</label>
          <p>Masukkan Jurusan</p>
          <input type="text" id="jurusan" class="form-control" v-model="newSiswa.jurusan" />
        </div>
      </div>

      <div style="margin-top: 10px; text-align: left">
        <button @click="isEditMode ? editSiswa() : addSiswa()" class="btn_add_siswa">
          {{ isEditMode ? 'Update Data' : 'Simpan Data' }}
        </button>
      </div>
    </div>
  </div>
 
  <!-- Tabel Siswa -->
  <div style="margin-top: 30px">
    <!-- End of Search and Import Wrapper -->
    <div class="import-search-wrapper">
      <!-- Import Button and File Input -->
      <div class="import-data">
        <button class="btn-import" type="button" @click="importData">
          <i class="fa-solid fa-arrow-up-from-bracket" 
            style="
            margin-right: 0.4rem;
            color: #4b6cb7; ">
          </i>
        Import
        </button>
        <input 
          type="file" 
          id="importFile" 
          class="file-input" 
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          @change="fileChange($event)" 
          style="display: none;"
        />
      </div>
      <!-- End of Import Button and File Input -->
      <!-- Search Bar -->
      <div class="search-bar-container">
        <i class="fas fa-search search-icon"></i>
        <input
        type="text"
        v-model="searchQuery"
        class="search-input"
        placeholder="Cari data..."
        />
      </div>
      <!-- End of Search Bar -->
    </div>
    <!-- End of Search and Import Wrapper -->
    <!-- tabel wrapper -->
    <div class="table-wrapper">
      <div class="tampil-baris" style="text-align: left;">
        Tampilkan:
        <select v-model="rowsPerPage" class="select-rows">
          <option value="5" class="value">5</option>
          <option value="10" class="value">10</option>
          <option value="20" class="value">20</option>
          <option value="100" class="value">100</option>
        </select>
        baris
      </div>
      <!-- End Section Filter dan Pencarian -->
      <table class="data-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Nomor Induk</th>
            <th>Nama Siswa</th>
            <th>Jenis Kelamin</th>
            <th>Jurusan</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(siswa, index) in paginatedSiswaList" :key="index">
            <td>{{ index + 1 + (currentPage - 1) * rowsPerPage }}</td>
            <td>{{ siswa.nomorInduk }}</td>
            <td>{{ siswa.nama }}</td>
            <td>{{ siswa.jenisKelamin }}</td>
            <td>{{ siswa.jurusan }}</td>
            <td>
              <!-- dropdown set -->
              <div class="dropdown d-inline-block">
                <button
                  class="btn btn-sm"
                  type="button"
                  @click="toggleDropdown(index)"
                  :aria-expanded="dropdownIndex === index"
                >
                  <i class="fas fa-ellipsis-h"></i>
                </button>
                <div
                  class="dropdown-menu-act"
                  :class="{ show: dropdownIndex === index }"
                >
                <button class="dropdown-item" @click="prepareEditSiswa(siswa)" style="color: #274278">Edit</button>
                <button class="dropdown-item" @click="deleteSiswa(siswa.nomorInduk)" style="color: red">Hapus</button>
                </div>
              </div>
              <!-- dropdown set -->
            </td>
          </tr>
          <tr v-if="paginatedSiswaList.length === 0">
            <td colspan="6" style="text-align: center">Tidak ada data</td>
          </tr>
        </tbody>
      </table>
      <!-- pagination -->
      <div v-if="totalPages > 1" class="pagination-container">
          <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="pagination-button"
          >
            Previous
          </button>
          <span class="pagination-info">
            Page {{ currentPage }} of {{ totalPages }}
          </span>
          <button
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            class="pagination-button"
          >
            Next
          </button>
      </div>
      <!-- pagination -->
    </div>
    <!-- tabel wrapper -->
  </div>
  <!-- Tabel Siswa -->
</template>

<script>
import Swal from 'sweetalert2';

export default {
data() {
  return {
    showModal: false,
    newSiswa: {
      nomorInduk: "",
      nama: "",
      jenisKelamin: "",
      jurusan: "",
    },
    siswaList: [], // Daftar siswa yang diambil dari API
    rowsPerPage: 5,
    currentPage: 1,
    searchQuery: "",
    editNomorInduk: null, // Menyimpan nomor induk siswa yang sedang diedit
    dropdownIndex: null, // Indeks dropdown yang terbuka
  };
},
computed: {
  isEditMode() {
    return this.editNomorInduk !== null;
  },
  // Filter siswa berdasarkan query pencarian
  filteredSiswaList() {
    return this.siswaList.filter(
      (siswa) =>
        siswa.nomorInduk.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        siswa.nama.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        siswa.jenisKelamin.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        siswa.jurusan.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  },
  // Paginate daftar siswa
  paginatedSiswaList() {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    const end = start + this.rowsPerPage;
    return this.filteredSiswaList.slice(start, end);
  },
  // Total halaman berdasarkan jumlah siswa
  totalPages() {
    return Math.ceil(this.filteredSiswaList.length / this.rowsPerPage);
  },
},
methods: {
  // Mengambil data siswa dari API
  async fetchSiswaData() {
    try {
      const response = await fetch('http://localhost:3000/siswa');
      const data = await response.json();
      if (data.status === "success") {
        this.siswaList = data.data.siswa.map((item) => ({
          nomorInduk: item.nis,
          nama: item.nama_siswa,
          jenisKelamin: item.jenis_kelamin,
          jurusan: item.jurusan,
        }));
      } else {
        console.error("Gagal mengambil data:", data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },
  // Menambahkan siswa
  async addSiswa() {
    if (this.newSiswa.nomorInduk && this.newSiswa.nama && this.newSiswa.jenisKelamin && this.newSiswa.jurusan) {
      try {
        const response = await fetch('http://localhost:3000/siswa', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nis: this.newSiswa.nomorInduk,
            nama_siswa: this.newSiswa.nama,
            jenis_kelamin: this.newSiswa.jenisKelamin,
            jurusan: this.newSiswa.jurusan,
          }),
        });
        const data = await response.json();
        if (data.status === "success") {
          this.fetchSiswaData(); // Refresh data
          this.closeModal();
          this.resetForm();
          Swal.fire({
            title: "Sukses!",
            text: "Data siswa berhasil disimpan.",
            icon: "success",
            confirmButtonText: "OK"
          });
        } else {
          console.error("Gagal menambah siswa:", data);
          Swal.fire({
            title: "Error!",
            text: "Gagal menambah siswa. NIS sudah terdaftar.",
            icon: "error",
            confirmButtonText: "OK"
          });
        }
      } catch (error) {
        console.error("Error adding siswa:", error);
        Swal.fire({
          title: "Error!",
          text: "Terjadi kesalahan saat menambah siswa.",
          icon: "error",
          confirmButtonText: "OK"
        });
      }
    }
    else {
      Swal.fire({
        title: "Peringatan!",
        text: "Lengkapi data siswa.",
        icon: "warning",
        confirmButtonText: "OK"
      });
    }
  },
  // Mengedit siswa
  async editSiswa() {
    try {
      // Log data yang akan dikirim dan URL
      console.log('Mengirim data ke URL:', `http://localhost:3000/siswa/${this.editNomorInduk}`);
      console.log('Data yang dikirim untuk update:', {
        nis: this.newSiswa.nomorInduk, // Pastikan field ini disertakan
        nama_siswa: this.newSiswa.nama,
        jenis_kelamin: this.newSiswa.jenisKelamin,
        jurusan: this.newSiswa.jurusan,
      });

      const response = await fetch(`http://localhost:3000/siswa/${this.editNomorInduk}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nis: this.newSiswa.nomorInduk, // Tambahkan nis di sini
          nama_siswa: this.newSiswa.nama,
          jenis_kelamin: this.newSiswa.jenisKelamin,
          jurusan: this.newSiswa.jurusan,
        }),
      });

      // Log response status dan data
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Data dari server:', data);

      if (data.status === "success") {
        this.fetchSiswaData(); // Refresh data
        this.closeModal();
        this.resetForm();
        Swal.fire({
            title: "Sukses!",
            text: "Data siswa berhasil disimpan.",
            icon: "success",
            confirmButtonText: "OK"
        });
      } else {
        console.error("Gagal mengedit siswa:", data);
        Swal.fire({
          title: "Error!",
          text: data.message || "Terjadi kesalahan saat mengedit siswa.", // Menyertakan pesan spesifik jika ada
          icon: "error",
          confirmButtonText: "OK"
        });
      }
    } catch (error) {
      console.error("Error editing siswa:", error);
      Swal.fire({
        title: "Error!",
        text: "Terjadi kesalahan saat mengedit siswa.",
        icon: "error",
        confirmButtonText: "OK"
      });
    }
  },
  // Mempersiapkan data untuk edit
  prepareEditSiswa(siswa) {
    this.newSiswa = { ...siswa };
    this.editNomorInduk = siswa.nomorInduk;
    this.showModal = true;
  },
  // Menghapus siswa
  async deleteSiswa(nomorInduk) {
    const result = await
    Swal.fire({
      title: 'Anda yakin?',
      text: "Data siswa ini akan dihapus!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, hapus!',
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:3000/siswa/${nomorInduk}`, {
          method: 'DELETE',
        });
        const data = await response.json();

        if (data.status === "success") {
          this.fetchSiswaData();
          Swal.fire({
            title: 'Terhapus!',
            text: 'Data siswa berhasil dihapus.',
            icon: 'success',
          });
        } else {
          console.error("Gagal menghapus siswa:", data);
          Swal.fire({
            title: 'Error!',
            text: 'Gagal menghapus data siswa.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      } catch (error) {
        console.error("Error deleting siswa:", error);
        Swal.fire({
          title: 'Error!',
          text: 'Gagal menghapus data siswa.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    }
  },
  // Menutup modal
  closeModal() {
    this.showModal = false;
    this.resetForm();
  },
  // Mereset form input siswa
  resetForm() {
    this.newSiswa = {
      nomorInduk: "",
      nama: "",
      jenisKelamin: "",
      jurusan: "",
    };
    this.editNomorInduk = null;
  },
  // Reset filter pencarian
  resetFilter() {
    this.searchQuery = "";
    this.rowsPerPage = 5;
    this.currentPage = 1;
  },
  // Mengganti halaman saat paginasi
  changePage(page) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.dropdownIndex = null;
    }
  },
  // Toggle dropdown
  toggleDropdown(index) {
    if (this.dropdownIndex === index) {
      this.dropdownIndex = null;
    } else {
      this.dropdownIndex = index;
    }
  },
},
mounted() {
  this.fetchSiswaData();
},
};
</script>

<style>
/* Modal Styles */
.modal-overlay {
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100%;
background-color: rgba(0, 0, 0, 0.5);
display: flex;
justify-content: center;
align-items: center;
z-index: 1000;
}

.modal-content-siswa {
  background: #274278;
  padding: 20px;
  border-radius: 10px;
  width: 40rem;
  max-width: 100%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.3s ease-in-out;
  transition: fadeOut 0.3s ease-out;
  text-align: left;
}

.date-inputs {
display: flex;
justify-content: space-between; 
align-items: center; 
}

.search-bar-container {
display: flex;
align-items: center;
border: 1px solid #ccc;
padding: 0.25rem 0.5rem;
border-radius: 5px;
width: fit-content;
position: relative;
display: inline-block;
margin-left: 1.5rem;
}

.search-input {
border: none;
outline: none;
text-align: left;
}

.search-icon {
color: #888; 
}

.search-bar-container:focus-within {
border-color: #636364; 
}

.filters2 {
margin-top: 20px;
display: flex;
justify-content: space-between;
gap: 10px;
}

.modal-header {
display: flex;
justify-content: space-between;
align-items: center;
color: white;
}

.close-modal {
font-size: 24px;
cursor: pointer;
}

.modal-content-siswa h4 {
margin-top: 0;
}

.header-siswa-container {
display: flex;
justify-content: space-between; 
align-items: center; 
margin-top: 3rem;
}

.header-siswa {
font-weight: bold;
color: #274278;
font-size: 1.7rem;
animation: fadeInDown 1s ease-in-out;
}

.btn_add_siswa {
background-color: #007bff;
color: white;
padding: 10px 20px;
border: none;
border-radius: 5px;
cursor: pointer;
transition: background-color 0.3s ease;
font-size: 16px;
}

.btn_add_siswa:hover {
background-color: #0056b3;
}

.form-row {
display: flex;
justify-content: space-between;
margin-bottom: 15px;
}

.form-group label,
.form-group p {
color: white;
}

.form-group p {
margin-top: -9px;
margin-bottom: 10px;
font-size: 12px;
font-weight: 400;
}

.form-group {
width: 48%;
}

.modal-body .form-group:last-child {
  margin-right: 0;
}

.modal-content-siswa .form-control {
width: 100%;
padding: 8px;
font-size: 14px;
border: 1px solid #ccc;
border-radius: 4px;
background-color: white;
}

.select-rows {
padding: 5px;
border-radius: 4px;
border: 1px solid #ccc;
}

.btn-import {
  border-radius: 5px;
  border: 1px solid #d3d2d2 !important;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
  color: #4b6cb7; 
  background-color: white;
  justify-content: space-between;
  text-align: left; 
  width: 7.5rem;
}

.search-input {
padding: 5px;
width: 1rem;
border-radius: 4px;
border: 1px solid #ccc;
}

.import-search-wrapper {
  display: flex;
  justify-content: space-between; /* Menyebarkan elemen di kiri dan kanan */
  width: 100%; /* Pastikan elemen mengambil lebar penuh */
  align-items: center;
  /* overflow-x: auto; */
  background-color: white;
  margin-top: 0.2rem !important;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.table-wrapper {
  width: 100%;
  overflow-x: auto;
  background-color: white;
  margin-top: 1rem !important;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.data-table {
width: 100%;
border-collapse: collapse;
min-width: 600px; 
}

.data-table th, .data-table td {
border: 1px solid #ddd;
padding: 8px;
text-align: left;
}

.data-table th:last-child, .data-table td:last-child {
text-align: center; /* Kolom action tetap di tengah */
}

.data-table tr:nth-child(even) {
background-color: #f2f2f2;
}

.data-table tr:hover {
background-color: #ddd;
}

@media (max-width: 768px) {
.data-table th, .data-table td {
  font-size: 0.875rem; /* Ukuran font lebih kecil di layar kecil */
  padding: 6px;
}

.pagination-container {
  justify-content: start;
}

.header-siswa {
  font-size: 1.5rem;
}
}

@keyframes fadeIn {
from {
  opacity: 0;
  transform: translateY(-10px);
}
to {
  opacity: 1;
  transform: translateY(0);
}
}

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

.pagination-container {
display: flex;
justify-content: flex-end;
padding: 10px 0;
margin-bottom: -1rem;
}

.pagination-button {
background-color: #007bff; 
color: white;
border: none;
border-radius: 5px;
padding: 5px 10px;
margin: 0 5px;
font-size: 0.9rem; 
cursor: pointer;
transition: background-color 0.3s ease;
}

.pagination-button:hover {
background-color: #0056b3; 
}

.pagination-button:disabled {
background-color: #cccccc; 
cursor: not-allowed;
}

.pagination-info {
font-size: 0.9rem; 
color: #555;
}

@media screen and (max-width: 450px) {
  .header-siswa-container {
    display: block;
    text-align: left;
  }

  .header-siswa {
    margin-top: -20rem;
    margin-bottom: 1rem;
  }

  .search-bar-container {
    width: 10rem;
  }

  .search-bar-container .search-input {
    width: 8rem;
  }

  .select-rows {
    width: 3rem;
  }

  .select-rows .value {
    width: 100%;
  }

  .value {
    font-size: 0.6rem;
  }

  .modal-content-siswa {
  width: 90%; /* Atur lebar modal, bisa disesuaikan */
  max-width: 500px; /* Lebar maksimum untuk modal */
  margin: auto; /* Center modal */
  padding: 20px; /* Padding dalam modal */
  border-radius: 8px; /* Sudut melengkung */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Bayangan */
  }

  .form-row {
    display: flex;
    flex-direction: column; /* Susun elemen secara vertikal */
  }

  .form-group {
    margin-bottom: 15px; /* Jarak antar form group */
  }

  .modal-header h4 {
    font-size: 1.5rem;
  }
}
</style>
