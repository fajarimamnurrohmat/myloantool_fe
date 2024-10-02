<template>
  <!-- Header dan Tombol Tambah Alat -->
  <div class="header-alat-container">
    <h3 class="header-alat">Halaman Data Alat</h3>
      <button @click="showModal = true" class="btn_add_alat">
        <i class="fas fa-plus"></i> Inputkan Data
      </button>
  </div>

  <!-- Modal -->
  <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-header">
        <h4>
          {{ isEditMode ? 'Edit Data Alat' : 'Input Data Alat' }}</h4>
        <span class="close-modal" @click="closeModal" style="color: red;">&times;</span>
      </div>
      <div class="modal-body">
        <div class="form-row">
          <div class="form-group">
            <label for="namaAlat">Nama Alat</label>
            <p>Masukkan nama alat</p>
            <input
              type="text"
              id="namaAlat"
              class="form-control"
              v-model="newAlat.namaAlat"
            />
          </div>
          <div class="form-group">
            <label for="idBengkel">Ruang Bengkel</label>
            <p>Pilih nama bengkel</p>
            <select
              id="idBengkel"
              class="form-control"
              v-model="newAlat.idBengkel"
            >
              <option value="" disabled selected>Pilih bengkel</option>
              <option v-for="bengkel in bengkelList" :key="bengkel.id" :value="bengkel.id">
                {{ bengkel.namaBengkel }} <!-- Adjust according to your actual property name -->
              </option>
            </select>
          </div>
        </div>
        <div class="form-group">
            <label for="jumlah">Jumlah</label>
            <p>Masukkan jumlah alat</p>
            <input
              type="number"
              id="jumlah"
              class="form-control"
              v-model="newAlat.jumlah"
            />
          </div>
      </div>
      <div style="margin-top: 10px; text-align: left">
          <button @click="isEditMode ? editAlat() : addAlat()" class="btn_add_alat">
            {{ isEditMode ? 'Update Data' : 'Simpan Data' }}
          </button>
      </div>
    </div>
  </div>

  <!-- Table Section -->
  <div style="margin-top: 30px">
    <div class="table-wrapper">
      <!-- Section Filter dan Pencarian -->
        <div class="filter-section">
          <div class="date-inputs">
            <div>
              <div class="tampil-baris" style="text-align: left;">
                Tampilkan:
                <select v-model="rowsPerPage" class="select-rows" style="width: 3rem">
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="100">100</option>
                </select>
                baris
              </div>
            </div>
            <!-- Pencarian -->
            <div class="search-bar-container">
              <i class="fas fa-search search-icon"></i>
              <input type="text" v-model="searchQuery" class="search-input" placeholder="Cari.." />
            </div>
            <!-- pencarian -->
          </div>
        </div>
      <!-- End Section Filter dan Pencarian -->
      <table class="data-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama Alat</th>
            <th>Jumlah</th>
            <th>Ruang Bengkel</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(alat, index) in paginatedAlatList" :key="index">
            <td>{{ index + 1 + (currentPage - 1) * rowsPerPage }}</td>
            <td>{{ alat.namaAlat }}</td>
            <td>{{ alat.jumlah }}</td>
            <td>{{ alat.ruangBengkel }}</td>
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
                  <button
                    class="dropdown-item"
                    @click="prepareAlat(alat)" 
                    style="color: #274278"
                    > Edit
                  </button
                  >
                  <button
                    class="dropdown-item"
                    @click="deletePeminjaman(index)"
                    style="color: red"
                    >Hapus</button
                  >
                </div>
              </div>
              <!-- dropdown set -->
            </td>
          </tr>
          <tr v-if="paginatedAlatList.length === 0">
            <td colspan="5" style="text-align: center">Tidak ada data</td>
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
</template>

<script>
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      newAlat: {
        namaAlat: "",
        jumlah: "",
        ruangBengkel: "",
        idBengkel: null,
      },
      alatList: [],
      bengkelList: [],
      rowsPerPage: 5,
      currentPage: 1,
      searchQuery: "",
      editNamaAlat: null,
      showModal: false,
      dropdownIndex: null,
    };
  },
  computed: {
    isEditMode() {
      return this.editNamaAlat !== null;
    },
    // Filter alat berdasarkan query pencarian
    filteredAlatList() {
      return this.alatList.filter(
        (alat) =>
          alat.namaAlat.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          alat.jumlah.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          alat.ruangBengkel.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    paginatedAlatList() {
      const start = (this.currentPage - 1) * this.rowsPerPage;
      const end = start + this.rowsPerPage;
      return this.filteredAlatList.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredAlatList.length / this.rowsPerPage);
    },
  },
  methods: {
    // Mengambil data alat dari API
    async fetchAlatData() {
      try {
        const response = await fetch('http://localhost:3000/alat');
        const data = await response.json();
        if (data.status === "success") {
          this.alatList = data.data.alat.map((item) => ({
            namaAlat: item.namaAlat,
            jumlah: item.jumlah,
            ruangBengkel: item.ruangBengkel,
          }));
        } else {
          console.error("Gagal mengambil data:", data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    async fetchBengkelData() {
      try {
        const response = await fetch('http://localhost:3000/bengkel'); // Replace with your actual endpoint
        const data = await response.json();
        if (data.status === "success") {
          this.bengkelList = data.data.bengkel; // Assuming the structure of your response
        } else {
          console.error("Gagal mengambil data bengkel:", data);
        }
      } catch (error) {
        console.error("Error fetching bengkel data:", error);
      }
    },
    async addAlat() {
      if (
        this.newAlat.namaAlat &&
        this.newAlat.ruangBengkel &&
        this.newAlat.jumlah 
      ) {
        try {
          const response = await fetch('http://localhost:3000/alat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              namaAlat: this.newAlat.namaAlat,
              jumlah: this.newAlat.jumlah,
              ruangBengkel: this.newAlat.ruangBengkel,
            }),
          });
          const data = await response.json();
          if (data.status === "success") {
            this.fetchalatData(); // Refresh data
            this.closeModal();
            this.resetForm();
            Swal.fire({
              title: "Sukses!",
              text: "Data alat berhasil disimpan.",
              icon: "success",
              confirmButtonText: "OK"
            });
          } else {
            console.error("Gagal menambah alat:", data);
            Swal.fire({
              title: "Error!",
              text: "Gagal menambah alat. Id sudah terdaftar.",
              icon: "error",
              confirmButtonText: "OK"
            });
          }
        } catch (error) {
          console.error("Error adding alat:", error);
          Swal.fire({
            title: "Error!",
            text: "Terjadi kesalahan saat menambah alat.",
            icon: "error",
            confirmButtonText: "OK"
          });
        }
      }
      else {
        Swal.fire({
          title: "Peringatan!",
          text: "Lengkapi data alat.",
          icon: "warning",
          confirmButtonText: "OK"
        });
      }
    },
    // Mengedit alat
    async editAlat() {
      try {
        // Log data yang akan dikirim dan URL
        console.log('Mengirim data ke URL:', 'http://localhost:3000/alat/${this.editNamaAlat}');
        console.log('Data yang dikirim untuk update:', {
          namaAlat: this.newAlat.namaAlat,
          jumlah: this.newAlat.jumlah,
          ruangBengkel: this.newAlat.ruangBengkel,
        });

        const response = await fetch('http://localhost:3000/alat/${this.editNamaAlat}', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            namaAlat: this.newAlat.namaAlat,
            jumlah: this.newAlat.jumlah,
            ruangBengkel: this.newAlat.ruangBengkel,
          }),
        });

        // Log response status dan data
        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Data dari server:', data);

        if (data.status === "success") {
          this.fetchAlatData(); // Refresh data
          this.closeModal();
          this.resetForm();
          Swal.fire({
              title: "Sukses!",
              text: "Data alat berhasil disimpan.",
              icon: "success",
              confirmButtonText: "OK"
          });
        } else {
          console.error("Gagal mengedit alat:", data);
          Swal.fire({
            title: "Error!",
            text: data.message || "Terjadi kesalahan saat mengedit alat.", // Menyertakan pesan spesifik jika ada
            icon: "error",
            confirmButtonText: "OK"
          });
        }
      } catch (error) {
        console.error("Error editing alat:", error);
        Swal.fire({
          title: "Error!",
          text: "Terjadi kesalahan saat mengedit alat.",
          icon: "error",
          confirmButtonText: "OK"
        });
      }
    },
    // Mempersiapkan data untuk edit
    prepareEditAlat(alat) {
      this.newAlat = { ...alat };
      this.editNamaAlat = alat.namaAlat;
      this.showModal = true;
    },
  // Menghapus alat
  async deleteAlat(namaAlat) {
      const result = await Swal.fire({
        title: 'Anda yakin?',
        text: "Data alat ini akan dihapus!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, hapus!',
      });

      if (result.isConfirmed) {
        try {
          const response = await fetch('http://localhost:3000/alat/${namaAlat}', {
            method: 'DELETE',
          });
          const data = await response.json();

          if (data.status === "success") {
            this.fetchAlatData();
            Swal.fire({
              title: 'Terhapus!',
              text: 'Data alat berhasil dihapus.',
              icon: 'success',
            });
          } else {
            console.error("Gagal menghapus alat:", data);
            Swal.fire({
              title: 'Error!',
              text: 'Gagal menghapus data alat.',
              icon: 'error',
              confirmButtonText: 'OK',
            });
          }
        } catch (error) {
          console.error("Error deleting alat:", error);
          Swal.fire({
            title: 'Error!',
            text: 'Gagal menghapus data alat.',
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
    // Mereset form input alat
    resetForm() {
      this.newAlat = {
        namaAlat: "",
        jumlah: "",
        ruangBengkel: "",
      };
      this.editNamaAlat = null;
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
  watch: {
    rowsPerPage() {
      this.currentPage = 1;
    },
  },
  mounted() {
    this.fetchAlatData();
  },
};
</script>

<style scoped>
.header-alat {
  font-weight: bold;
  color: #274278;
  font-size: 1.7rem;
  animation: fadeInDown 1s ease-in-out;
}

.header-alat-container {
  display: flex;
  justify-content: space-between; 
  align-items: center; 
  margin-top: 3rem;
}

.btn_add_alat {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 16px;
}

.btn_add_alat:hover {
  background-color: #0056b3;
}

.modal-content h4 {
  margin-top: 0;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: linear-gradient(90deg, #4b6cb7, #182848);
  padding: 20px;
  border-radius: 10px;
  width: 500px;
  max-width: 90%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.3s ease-in-out;
  text-align: left;
  color: #274278;
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

.form-control {
  width: 100%;
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.modal-footer {
  text-align: right;
}

.filter-buttons {
  display: flex;
  margin-left: auto;
}

.filter-buttons button {
  border-radius: 5px;
  height: 2rem; /* reduce the height */
  width: 2.5rem;
  padding: 0.2rem; /* add some padding */
}

.filter-buttons button i {
  font-size: 1rem; /* increase the font size of the icon */
}

.search-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  margin-top: 1rem;  
}

.date-inputs {
  display: flex;
  justify-content: space-between; 
  align-items: center; 
}

.search-bar-container:focus-within {
  border-color: #636364; 
}

.search-input {
  border: none;
  outline: none;
  text-align: left;
}

.search-icon {
  color: #888; 
}

.filters2 {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.table-wrapper {
  width: 100%;
  overflow-x: auto;
  background-color: white;
  margin-top: -1rem;
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
</style>