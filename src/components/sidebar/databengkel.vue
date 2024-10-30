<template>
  <div class="header-bengkel-container">
    <h3 class="header-bengkel">Halaman Data Bengkel</h3>
    <button @click="showModal = true" class="btn-add-bengkel">
      <i class="fas fa-plus"></i> Inputkan Data
    </button>
  </div>

  <!-- Modal -->
  <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-header">
        <h4>
          {{ editIndex !== null ? "Edit Data Bengkel" : "Input Data Bengkel" }}
        </h4>
        <span
          class="close-modal"
          @click="closeModal"
          style="color: red; text-align: right"
          >&times;</span
        >
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="ruangBengkel">Nama Ruang Bengkel</label>
          <p>Masukkan nama ruang bengkel</p>
          <input
            type="text"
            id="ruangBengkel"
            class="form-controll"
            v-model="newBengkel.ruang_bengkel"
          />
        </div>
      </div>
      <div style="margin-top: 10px; text-align: left">
        <button @click="addOrUpdateBengkel" class="btn-add-bengkel">
          {{ editIndex !== null ? "Update Data" : "Simpan Data" }}
        </button>
      </div>
    </div>
  </div>
  <!-- End of Modal -->

  <!-- Import Button and File Input -->
  <div class="import-search-wrapper" style="margin-top: 30px">
    <div class="import-data">
      <button
        class="btn-import"
        type="button"
        @click="importData"
        style="
          color: #4b6cb7;
          background-color: white;
          justify-content: space-between;
          text-align: left;
          width: 7.5rem;
        "
      >
        <i
          class="fa-solid fa-arrow-up-from-bracket"
          style="margin-right: 0.4rem; color: #4b6cb7"
        >
        </i>
        Import
      </button>
      <input
        type="file"
        id="importFile"
        class="file-input"
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        @change="fileChange($event)"
        style="display: none"
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
    <!-- Show Row -->
    <div class="tampil-baris" style="text-align: left">
      Tampilkan:
      <select v-model.number="rowsPerPage" class="select-rows">
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="100">100</option>
      </select>
      baris
    </div>
    <!-- End of Show Row -->
    <table class="data-table">
      <thead>
        <tr>
          <th>No</th>
          <th>Nama Ruang Bengkel</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(bengkel, index) in paginatedBengkelList"
          :key="bengkel.id_bengkel"
        >
          <td>{{ index + 1 + (currentPage - 1) * rowsPerPage }}</td>
          <td>{{ bengkel.ruang_bengkel }}</td>
          <td>
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
                  @click="editBengkel(bengkel)"
                  style="color: #274278"
                >
                  Edit
                </button>
                <button
                  class="dropdown-item"
                  @click="deleteBengkel(bengkel.id_bengkel)"
                  style="color: red"
                >
                  Hapus
                </button>
              </div>
            </div>
          </td>
        </tr>
        <tr v-if="paginatedBengkelList.length === 0">
          <td colspan="3" style="text-align: center">Tidak ada data</td>
        </tr>
      </tbody>
    </table>

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
  </div>
</template>

<script>
import Swal from "sweetalert2";
import axios from "axios";
// import "@mescius/spread-sheets/styles/gc.spread.sheets.excel2016colorful.css";//

// // SpreadJS imports
// import GC from "@mescius/spread-sheets";
// import "@mescius/spread-sheets-vue";
// import Excel from "@mescius/spread-excelio";
// import { saveAs } from 'file-saver';

export default {
  data() {
    return {
      showModal: false,
      newBengkel: {
        ruang_bengkel: "",
      },
      bengkelList: [],
      rowsPerPage: 5,
      currentPage: 1,
      searchQuery: "",
      editIndex: null,
      dropdownIndex: null,
    };
  },
  computed: {
    filteredBengkelList() {
      return this.bengkelList.filter((bengkel) =>
        bengkel.ruang_bengkel
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase())
      );
    },
    paginatedBengkelList() {
      const start = (this.currentPage - 1) * this.rowsPerPage;
      const end = start + this.rowsPerPage;
      return this.filteredBengkelList.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredBengkelList.length / this.rowsPerPage);
    },
  },
  methods: {
    async fetchBengkelList() {
      try {
        const token = localStorage.getItem("accessToken"); // Ambil token dari localStorage
        const response = await axios.get("http://localhost:3000/bengkel", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.status === "success") {
          this.bengkelList = response.data.data.bengkel.rows;
        } else {
          console.error("Gagal mendapatkan data:", response.data);
          Swal.fire({
            title: "Error!",
            text: "Gagal mengambil data bengkel.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        Swal.fire({
          title: "Error!",
          text: "Terjadi kesalahan saat mengambil data bengkel.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    },

    // Method for adding a new 'bengkel'
    async addBengkel() {
      if (this.newBengkel.ruang_bengkel) {
        try {
          const token = localStorage.getItem("accessToken"); // Ambil token dari localStorage
          await axios.post("http://localhost:3000/bengkel", this.newBengkel, {
            headers: { Authorization: `Bearer ${token}` },
          });
          await this.fetchBengkelList(); // Update table data
          this.closeModal();
          this.resetForm();
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: "Gagal mengambil data bengkel.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      } else {
        Swal.fire({
          title: "Error!",
          text: "Terjadi kesalahan saat mengambil data bengkel.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    },

    editBengkel(bengkel) {
      // Hanya salin ruang_bengkel
      this.newBengkel = {
        ruang_bengkel: bengkel.ruang_bengkel,
      };
      this.editIndex = this.bengkelList.findIndex(
        (b) => b.id_bengkel === bengkel.id_bengkel
      );
      this.showModal = true;
    },

    // Method for updating existing 'bengkel'
    async updateBengkel() {
      const bengkelToUpdate = this.bengkelList[this.editIndex];
      if (
        this.newBengkel.ruang_bengkel &&
        bengkelToUpdate &&
        bengkelToUpdate.id_bengkel
      ) {
        try {
          const token = localStorage.getItem("accessToken"); // Ambil token dari localStorage
          await axios.put(
            `http://localhost:3000/bengkel/${bengkelToUpdate.id_bengkel}`,
            {
              ruang_bengkel: this.newBengkel.ruang_bengkel,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          await this.fetchBengkelList(); // Update table data
          this.closeModal();
          this.resetForm();
          Swal.fire({
            title: "Sukses!",
            text: "Data bengkel berhasil diperbarui.",
            icon: "success",
            confirmButtonText: "OK",
          });
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: "Gagal memperbarui data bengkel.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      } else {
        Swal.fire({
          title: "Error!",
          text: "Data tidak valid atau id bengkel tidak ditemukan.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    },

    // Separate method to handle adding or updating 'bengkel'
    addOrUpdateBengkel() {
      if (this.editIndex !== null) {
        this.updateBengkel();
      } else {
        this.addBengkel();
      }
    },

    async deleteBengkel(id_bengkel) {
      const result = await Swal.fire({
        title: "Anda yakin?",
        text: "Data bengkel ini akan dihapus!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya, hapus!",
      });

      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("accessToken"); // Ambil token dari localStorage
          const response = await axios.delete(
            `http://localhost:3000/bengkel/${id_bengkel}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (response.data.status === "success") {
            const index = this.bengkelList.findIndex(
              (bengkel) => bengkel.id_bengkel === id_bengkel
            );
            if (index !== -1) {
              this.bengkelList.splice(index, 1);
            }
            Swal.fire({
              title: "Terhapus!",
              text: "Data bengkel berhasil dihapus.",
              icon: "success",
              confirmButtonText: "OK",
            });
          } else {
            console.error("Gagal menghapus bengkel:", response.data);
            Swal.fire({
              title: "Error!",
              text: response.data.message || "Gagal menghapus data bengkel.",
              icon: "error",
              confirmButtonText: "OK",
            });
          }
        } catch (error) {
          console.error("Error deleting bengkel:", error);
          Swal.fire({
            title: "Error!",
            text: "Terjadi kesalahan saat menghapus data bengkel.",
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

    toggleDropdown(index) {
      this.dropdownIndex = this.dropdownIndex === index ? null : index;
    },

    resetForm() {
      this.newBengkel = {
        ruang_bengkel: "",
      };
      this.editIndex = null;
    },

    resetFilter() {
      this.searchQuery = "";
      this.rowsPerPage = 5;
      this.currentPage = 1;
    },
  },

  watch: {
    rowsPerPage() {
      this.currentPage = 1;
    },
  },

  mounted() {
    this.fetchBengkelList();
  },
};
</script>

<style>
.header-bengkel-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 3rem;
}

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

.modal-content {
  text-align: left;
  color: #274278;
}

.modal-content h4 {
  margin-top: 0;
}

/* Other styles remain the same */
.header-bengkel {
  font-weight: bold;
  color: #274278;
  font-size: 1.7rem;
  margin-bottom: 10px;
  margin-top: 20px;
  animation: fadeInDown 1s ease-in-out;
}

.btn-add-bengkel {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 16px;
}

.btn-add-bengkel:hover {
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
  width: 100%;
}

.form-controll {
  color: black;
  width: 16rem;
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
}

.import-search-wrapper {
  width: 100%;
  overflow-x: auto;
  background-color: white;
  margin-top: 0.2rem !important;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between; /* Menyebarkan elemen di kiri dan kanan */
  width: 100%; /* Pastikan elemen mengambil lebar penuh */
  align-items: center;
}

.table-wrapper {
  width: 100%;
  overflow-x: auto;
  background-color: white;
  margin-top: 1rem;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.import-data {
  display: flex;
  align-items: center;
}

.btn-import {
  border-radius: 5px;
  border: 1px solid #d3d2d2 !important;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
}

.search-bar-container {
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  padding: 0.25rem 0.5rem;
  border-radius: 5px;
  margin-left: auto; /* Pastikan elemen ini tetap di kanan */
}

.search-input {
  outline: none;
  text-align: left;
  padding: 5px;
  width: 200px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.select-rows {
  padding: 5px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
}

.data-table th,
.data-table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}

.data-table th:last-child,
.data-table td:last-child {
  text-align: center;
}

.data-table tr:nth-child(even) {
  background-color: #f2f2f2;
}

.data-table tr:hover {
  background-color: #ddd;
}

.pagination-container {
  display: flex;
  justify-content: center;
  padding: 10px 0;
  margin-top: 20px;
}

.pagination-button {
  background-color: #007bff;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin: 0 5px;
}

.pagination-button:hover:not(:disabled) {
  background-color: #0056b3;
}

.pagination-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.pagination-info {
  margin: 0 10px;
  color: #333;
}

/* Add fade-in animation */
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes fadeInDown {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
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
    text-align: left;
    margin-bottom: 10px;
  }

  .pagination-container {
    align-items: center;
  }

  .pagination-info {
    margin: 10px 0;
  }
}
/* end of responsive */
</style>
