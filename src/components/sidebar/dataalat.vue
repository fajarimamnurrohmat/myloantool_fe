<template>
  <div>
    <!-- Header dan Tombol Tambah Alat -->
    <div class="header-alat-container">
      <h3 class="header-alat">Halaman Data Alat</h3>
      <button @click="openAddModal" class="btn_add_alat">
        <i class="fas fa-plus"></i> Inputkan Data
      </button>
    </div>

    <!-- Modal Input/Edit Alat -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h4>{{ isEditMode ? 'Edit Data Alat' : 'Input Data Alat' }}</h4>
          <span class="close-modal" @click="closeModal">&times;</span>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="namaAlat">Nama Alat</label>
            <p>Masukkan nama alat</p>
            <input
              type="text"
              id="namaAlat"
              class="form-control"
              v-model="newAlat.namaAlat"
              :disabled="isEditMode"
              placeholder="Masukkan nama alat"
            />
          </div>
          <div class="form-group">
            <label for="ruangBengkel">Ruang Bengkel</label>
            <p>Pilih ruang bengkel</p>
            <select
              id="ruangBengkel"
              class="form-control"
              v-model="newAlat.id_bengkel"
              :disabled="isEditMode"
            >
              <option disabled value="">Pilih Ruang Bengkel</option>
              <option
                v-for="bengkel in bengkelList"
                :key="bengkel.id_bengkel"
                :value="bengkel.id_bengkel"
              >
                {{ bengkel.ruang_bengkel }}
              </option>
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="jumlah">Jumlah</label>
            <p>Masukkan jumlah alat</p>
            <input
              type="number"
              id="jumlah"
              class="form-control"
              v-model.number="newAlat.jumlah"
              min="1"
              placeholder="Masukkan jumlah alat"
            />
          </div>
        </div>
        <div style="margin-top: 10px; text-align: left">
          <button @click="saveAlat" class="btn_add_alat">
            {{ isEditMode ? 'Update Data' : 'Simpan Data' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Import Button and File Input -->
    <div class="import-search-wrapper"> 
      <div class="import-data">
        <button class="btn-import" type="button" @click="importData" style="
            color: #4b6cb7; 
            background-color: white;
            justify-content: space-between;
            text-align: left; 
            width: 7.5rem;">
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
    <!-- End of Import Button and File Input -->
    <div class="table-wrapper">
      <div class="tampil-baris">
        Tampilkan:
        <select v-model.number="rowsPerPage" class="select-rows">
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="100">100</option>
        </select>
        baris
      </div>
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
          <tr v-for="(alat, index) in paginatedAlatList" :key="alat.id_alat">
            <td>{{ index + 1 + (currentPage - 1) * rowsPerPage }}</td>
            <td>{{ alat.nama_alat }}</td>
            <td>{{ alat.jumlah }}</td>
            <td>{{ alat.ruang_bengkel }}</td>
            <td>
              <!-- Dropdown Actions -->
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
                    @click="openEditModal(alat)"
                    style="color: #274278"
                  >
                    Edit
                  </button>
                  <button
                    class="dropdown-item"
                    @click="deleteAlat(alat.id_alat)"
                    style="color: red"
                  >
                    Hapus
                  </button>
                </div>
              </div>
              <!-- End Dropdown Actions -->
            </td>
          </tr>
          <tr v-if="paginatedAlatList.length === 0">
            <td colspan="5" style="text-align: center">Tidak ada data</td>
          </tr>
        </tbody>
      </table>
      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pagination-container">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="pagination-button"
          >
          Previous
        </button>
        <span class="pagination-info"> Page {{ currentPage }} of {{ totalPages }}</span>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="pagination-button"
          >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import axios from "axios";

export default {
  data() {
    return {
      showModal: false,
      newAlat: {
        namaAlat: "",
        jumlah: "",
        id_bengkel: "",
      },
      alatList: [],
      bengkelList: [],
      rowsPerPage: 5,
      currentPage: 1,
      searchQuery: "",
      editAlatId: null, // Menyimpan ID alat yang akan diedit
      dropdownIndex: null, // Indeks dropdown yang terbuka
      isEditMode: false, // Menandakan apakah modal dalam mode edit
    };
  },
  computed: {
    filteredAlatList() {
      return this.alatList.filter((alat) => {
        const ruangBengkel = this.getRuangBengkel(alat.id_bengkel)
          .toLowerCase();
        return (
          alat.nama_alat
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase()) ||
          alat.jumlah.toString().includes(this.searchQuery) ||
          ruangBengkel.includes(this.searchQuery.toLowerCase())
        );
      });
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
    async fetchBengkelList() {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get("http://localhost:3000/bengkel", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.status === "success") {
          this.bengkelList = response.data.data.bengkel.rows;
        } else {
          console.error("Gagal mendapatkan data bengkel:", response.data);
          Swal.fire({
            title: "Error!",
            text: "Gagal mengambil data bengkel.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      } catch (error) {
        console.error("Error fetching data bengkel:", error);
        Swal.fire({
          title: "Error!",
          text: "Terjadi kesalahan saat mengambil data bengkel.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    },
    async fetchAlatList() {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get("http://localhost:3000/alat", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.status === "success") {
          this.alatList = response.data.data.alat;
        } else {
          console.error("Gagal mendapatkan data alat:", response.data);
          Swal.fire({
            title: "Error!",
            text: "Gagal mengambil data alat.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      } catch (error) {
        console.error("Error fetching data alat:", error);
        Swal.fire({
          title: "Error!",
          text: "Terjadi kesalahan saat mengambil data alat.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    },
    openAddModal() {
      this.isEditMode = false;
      this.editAlatId = null;
      this.newAlat = {
        namaAlat: "",
        jumlah: "",
        id_bengkel: "",
      };
      this.showModal = true;
    },
    openEditModal(alat) {
      this.isEditMode = true;
      this.editAlatId = alat.id_alat;
      this.newAlat = {
        namaAlat: alat.nama_alat,
        jumlah: alat.jumlah,
        id_bengkel: alat.id_bengkel,
      };
      this.showModal = true;
    },
    async saveAlat() {
      if (
        this.newAlat.namaAlat &&
        this.newAlat.id_bengkel &&
        this.newAlat.jumlah > 0
      ) {
        const token = localStorage.getItem("accessToken");
        const payload = {
          id_bengkel: this.newAlat.id_bengkel,
          nama_alat: this.newAlat.namaAlat,
          jumlah: Number(this.newAlat.jumlah),
        };
        try {
          if (this.isEditMode && this.editAlatId) {
            const response = await axios.put(
              `http://localhost:3000/alat/${this.editAlatId}`,
              payload,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.status === "success") {
              const updatedAlat = response.data.data.alat;
              const index = this.alatList.findIndex(
                (alat) => alat.id_alat === this.editAlatId
              );
              if (index !== -1) {
                this.$set(this.alatList, index, updatedAlat);
              }
              this.closeModal();
              Swal.fire({
                title: "Sukses!",
                text: "Data alat berhasil diperbarui.",
                icon: "success",
                confirmButtonText: "OK",
              });
            } else {
              console.error("Gagal memperbarui alat:", response.data);
              Swal.fire({
                title: "Error!",
                text: response.data.message || "Gagal memperbarui data alat.",
                icon: "error",
                confirmButtonText: "OK",
              });
            }
          } else {
            const response = await axios.post(
              "http://localhost:3000/alat",
              payload,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.status === "success") {
              this.fetchAlatList();
              this.closeModal();
              Swal.fire({
                title: "Sukses!",
                text: "Data alat berhasil disimpan.",
                icon: "success",
                confirmButtonText: "OK",
              });
            } else {
              console.error("Gagal menambah alat:", response.data);
              Swal.fire({
                title: "Error!",
                text: response.data.message || "Gagal menambah data alat.",
                icon: "error",
                confirmButtonText: "OK",
              });
            }
          }
        } catch (error) {
          console.error("Error saving alat:", error);
          Swal.fire({
            title: "Error!",
            text: "Terjadi kesalahan saat menyimpan data alat.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      } else {
        Swal.fire({
          title: "Peringatan!",
          text: "Lengkapi semua data alat dengan benar.",
          icon: "warning",
          confirmButtonText: "OK",
        });
      }
    },
    async deleteAlat(alatId) {
      const result = await Swal.fire({
        title: "Anda yakin?",
        text: "Data alat ini akan dihapus!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya, hapus!",
      });
      if (result.isConfirmed) {
        const token = localStorage.getItem("accessToken");
        try {
          const response = await axios.delete(
            `http://localhost:3000/alat/${alatId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (response.data.status === "success") {
            const index = this.alatList.findIndex(
              (alat) => alat.id_alat === alatId
            );
            if (index !== -1) {
              this.alatList.splice(index, 1);
            }
            Swal.fire({
              title: "Terhapus!",
              text: "Data alat berhasil dihapus.",
              icon: "success",
              confirmButtonText: "OK",
            });
          } else {
            console.error("Gagal menghapus alat:", response.data);
            Swal.fire({
              title: "Error!",
              text: response.data.message || "Gagal menghapus data alat.",
              icon: "error",
              confirmButtonText: "OK",
            });
          }
        } catch (error) {
          console.error("Error deleting alat:", error);
          Swal.fire({
            title: "Error!",
            text: "Terjadi kesalahan saat menghapus data alat.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }
    },
    closeModal() {
      this.showModal = false;
      this.resetForm();
    },
    resetForm() {
      this.newAlat = {
        namaAlat: "",
        jumlah: "",
        id_bengkel: "",
      };
      this.editAlatId = null;
      this.isEditMode = false;
    },
    toggleDropdown(index) {
      this.dropdownIndex = this.dropdownIndex === index ? null : index;
    },
    resetFilter() {
      this.searchQuery = "";
      this.rowsPerPage = 5;
      this.currentPage = 1;
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.dropdownIndex = null;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.dropdownIndex = null;
      }
    },
    getRuangBengkel(bengkelId) {
      const bengkel = this.bengkelList.find(
        (bengkel) => bengkel.id_bengkel === bengkelId
      );
      return bengkel ? bengkel.nama_ruang : "";
    },
  },
  mounted() {
    this.fetchBengkelList();
    this.fetchAlatList();
  },
};
</script>


<style scoped>
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

.modal-content {
  background: linear-gradient(90deg, #4b6cb7, #182848);
  padding: 20px;
  border-radius: 10px;
  width: 500px;
  max-width: 90%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  color: white;
  animation: fadeIn 0.3s ease-in-out;
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

.form-control {
  width: 100%;
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  color: #274278;
}

.btn_add_alat {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  margin-bottom: 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  font-size: 16px;
}

.btn_add_alat:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}

.header-alat-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 3rem;
}

.header-alat {
  font-weight: bold;
  color: #274278;
  font-size: 1.7rem;
  animation: fadeInDown 1s ease-in-out;
}

.date-inputs {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tampil-baris {
  display: flex;
  align-items: center;
}

.select-rows {
  padding: 5px;
  border-radius: 4px;
  border: 1px solid #ccc;
  margin: 0 5px;
}

.search-bar-container {
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  padding: 0.25rem 0.5rem;
  border-radius: 5px;
  width: fit-content;
}

.search-input {
  border: none;
  outline: none;
  text-align: left;
  padding: 5px;
  width: 200px;
}

.search-icon {
  color: #888;
  margin-right: 5px;
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
  margin-top: 20px;
  overflow-x: auto;
}

.data-table th,
.data-table td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: center;
}

.data-table tbody tr:nth-child(odd) {
  background-color: none;
}

.data-table tbody tr:hover {
  background-color: #f1f1f1;
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

/* Dropdown Styles */
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-menu-act {
  display: none;
  position: absolute;
  background-color: white;
  min-width: 120px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
  right: 0;
}

.dropdown-menu-act.show {
  display: block;
}

.dropdown-menu-act button {
  width: 100%;
  padding: 8px 12px;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
}

.dropdown-menu-act button:hover {
  background-color: #f1f1f1;
}

.import-search-wrapper {
  display: flex;
  justify-content: space-between; /* Menyebarkan elemen di kiri dan kanan */
  width: 100%; /* Pastikan elemen mengambil lebar penuh */
  align-items: center;
}

.import-data {
  display: flex;
  align-items: center;
}

/* Animations */
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

/* Responsivitas */
@media (max-width: 768px) {
  .data-table th,
  .data-table td {
    font-size: 0.875rem;
    padding: 6px;
  }

  .header-alat {
    font-size: 1.5rem;
  }

  .search-bar-container {
    width: 100%;
    margin-top: 10px;
  }

  .search-input {
    width: 100%;
  }

  .tampil-baris {
    width: 100%;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .pagination-info {
    margin: 10px 0;
  }
}
</style>
