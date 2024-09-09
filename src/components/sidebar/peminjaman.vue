<template>
  <div style="text-align: left">
    <h3 class="header-peminjaman">Halaman Peminjaman</h3>
    <button @click="showModal = true" class="btn_add_siswa">
      <i class="fas fa-plus" style="margin-right: 1rem"></i> Input Peminjaman
    </button>
  </div>

  <!-- Start of Modal Section -->
  <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-header">
        <h4>Input Data Peminjaman</h4>
        <span class="close-modal" @click="closeModal">&times;</span>
      </div>
      <div class="modal-body">
        <!-- form rowa atas -->
        <div class="form-row">
          <!-- peminjam -->
          <div class="form-group">
            <label for="namaPeminjam">Nama Peminjam</label>
            <p>Masukkan nama peminjam</p>
            <input
              type="text"
              style="width: 250px"
              id="namaPeminjam"
              class="form-control"
              v-model="newPeminjaman.namaPeminjam"
            />
          </div>
          <!-- peminjam -->
          <!-- alat -->
          <div class="form-group">
            <label for="alat">Alat</label>
            <p>Masukkan nama alat</p>
            <input
              type="text"
              id="alat"
              class="form-control"
              v-model="newPeminjaman.alat"
            />
          </div>
          <!-- alat -->
          <!-- jumlah -->
          <div class="form-group">
            <label for="jumlahAlat">Jumlah Alat</label>
            <input
              type="number"
              style="width: 100px; margin-top: 1.55rem"
              id="jumlahAlat"
              class="form-control"
              v-model="newPeminjaman.jumlahAlat"
            />
          </div>
          <!-- jumlah -->
        </div>
        <!-- form row atas -->
        <!-- form row bawah -->
        <div class="form-row">
          <!-- bengkel -->
          <div class="form-group">
            <label for="bengkel">Bengkel</label>
            <p>Masukkan nama bengkel alat</p>
            <input
              type="text"
              style="width: 15.625rem"
              id="bengkel"
              class="form-control"
              v-model="newPeminjaman.bengkel"
            />
          </div>
          <!-- bengkel -->
          <!-- tgl pinjam -->
          <div class="form-group" style="margin-left: -2.3rem">
            <label for="tanggalPinjam">Tanggal Pinjam</label>
            <p>Masukkan tanggal pinjam alat</p>
            <div class="date-input-wrapper">
              <input
                type="date"
                id="tanggalPinjam"
                v-model="newPeminjaman.tanggalPinjam"
                class="date-filter"
                style="width: 16rem"
              />
              <i class="fas fa-calendar-alt calendar-icon"></i>
            </div>
          </div>
          <!-- tgl pinjam -->
        </div>
        <!-- form row bawah -->
      </div>
      <div class="modal-footer">
        <button @click="addPeminjaman" class="btn_add_peminjaman">
          Simpan Data
        </button>
      </div>
    </div>
  </div>
  <!-- End of Modal Section -->

  <hr />

  <!-- Date Filter Section -->
  <div class="filter-section">
    <div class="date-inputs">
      <div class="date-input-wrapper">
        <label for="startDate" class="date-sort">From:</label>
        <input
          type="date"
          id="startDate"
          v-model="startDate"
          class="date-filter"
        />
        <i class="fas fa-calendar-alt calendar-icon"></i>
      </div>
      <div class="date-input-wrapper">
        <label for="endDate" class="date-sort">To:</label>
        <input type="date" id="endDate" v-model="endDate" class="date-filter" />
        <i class="fas fa-calendar-alt calendar-icon"></i>
      </div>
      <!-- filter button section -->
      <div class="filter-buttons">
        <button @click="resetFilter" class="btn-reset">
          <i class="fa fa-sync" aria-hidden="true"></i>
        </button>
        <div class="dropdown d-inline-block">
          <button
            class="btn-export"
            type="button"
            @click="toggleDropdown(index)"
            :aria-expanded="dropdownIndex === index"
            style="
              color: #4b6cb7; 
              background-color: white; 
              width: 6rem;"
          ><i class="fa-solid fa-arrow-up-from-bracket" 
              style="
                      margin-left: 0.5rem;
                      margin-right: 0.4rem;">
          </i>
            Export
          </button>
          <div
            class="dropdown-menu-export"
            :class="{ show: dropdownIndex === index }"
          >
            <a
              class="dropdown-item-export"
              @click="exportData('pdf')"
              style="color: #4b6cb7"
              ><i class="fa fa-file-pdf" 
                  aria-hidden="true"
                  style="
                      margin-left: 0.2rem;
                      margin-right: 0.1rem;">
              </i>
              .pdf
            </a>
            <a
              class="dropdown-item-export"
              @click="exportData('csv')"
              style="color: #4b6cb7;"
              ><i class="fa-solid fa-file-csv" 
                  aria-hidden="true"
                  style="
                      margin-left: 0.2rem;
                      margin-right: 0.1rem;
                      margin-top: 0.5rem;">
              </i>
              .csv
            </a>
          </div>
        </div>
      </div>
      <!-- filter button section -->
      <!-- search -->
      <div class="search-bar-container">
        <i class="fas fa-search search-icon"></i>
        <input
          type="text"
          v-model="searchQuery"
          class="search-input"
          style="width: 11rem;"
          placeholder="Cari.."
        />
      </div>
      <!-- search -->
    </div>
  </div>
  <!-- End of Date Filter Section -->

  <div style="margin-top: 2rem">
    <!-- table section -->
    <table class="data-table">
      <thead>
        <tr>
          <th>No</th>
          <th>Nama Peminjam</th>
          <th>Alat</th>
          <th>Bengkel</th>
          <th>Tanggal Pinjam</th>
          <th>Jumlah</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(peminjaman, index) in paginatedPeminjamanList" :key="index">
          <td>{{ index + 1 + (currentPage - 1) * rowsPerPage }}</td>
          <td>{{ peminjaman.namaPeminjam }}</td>
          <td>{{ peminjaman.alat }}</td>
          <td>{{ peminjaman.bengkel }}</td>
          <td>{{ peminjaman.tanggalPinjam }}</td>
          <td>{{ peminjaman.jumlahAlat }}</td>
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
                  @click="editPeminjaman(index)"
                  style="color: #274278"
                  >Edit</button
                >
                <button 
                  @click="tampilModal = true"
                  class="dropdown-item"
                  style="color: #274278"
                  >Pengembalian</button
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
        <tr v-if="paginatedPeminjamanList.length === 0">
          <td colspan="7" style="text-align: center">Tidak ada data</td>
        </tr>
      </tbody>
    </table>
    <!--- end of the table -->

  <!-- Start of Modal Section -->
  <div v-if="tampilModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content" style="margin-top: 5rem;">
        <div class="modal-header">
          <h4>Input Data Pengembalian</h4>
          <span class="close-modal" @click="closeModal">&times;</span>
        </div>
        <div class="modal-body">
          <!-- form rowa atas -->
          <div class="form-row">
            <!-- peminjam -->
            <div class="form-group">
              <label for="namaPeminjam">Nama Peminjam</label>
              <p>Masukkan nama peminjam</p>
              <input
                type="text"
                style="width: 250px"
                id="namaPeminjam"
                class="form-control"
                v-model="newPeminjaman.namaPeminjam"
              />
            </div>
            <!-- peminjam -->
            <!-- alat -->
            <div class="form-group">
              <label for="alat">Alat</label>
              <p>Masukkan nama alat</p>
              <input
                type="text"
                id="alat"
                class="form-control"
                v-model="newPeminjaman.alat"
              />
            </div>
            <!-- alat -->
            <!-- jumlah -->
            <div class="form-group">
              <label for="jumlahAlat">Jumlah Alat</label>
              <input
                type="number"
                style="width: 100px; margin-top: 1.55rem"
                id="jumlahAlat"
                class="form-control"
                v-model="newPeminjaman.jumlahAlat"
              />
            </div>
            <!-- jumlah -->
          </div>
          <!-- form row atas -->
          <!-- form row bawah -->
          <div class="form-row">
            <!-- bengkel -->
            <div class="form-group">
              <label for="bengkel">Bengkel</label>
              <p>Masukkan nama bengkel alat</p>
              <input
                type="text"
                style="width: 15.625rem"
                id="bengkel"
                class="form-control"
                v-model="newPeminjaman.bengkel"
              />
            </div>
            <!-- bengkel -->
            <!-- tgl pinjam -->
            <div class="form-group" style="margin-left: -2.3rem">
              <label for="tanggalPinjam">Tanggal Pinjam</label>
              <p>Masukkan tanggal pinjam alat</p>
              <div class="date-input-wrapper">
                <input
                  type="date"
                  id="tanggalPinjam"
                  v-model="newPeminjaman.tanggalPinjam"
                  class="date-filter"
                  style="width: 16rem"
                />
                <i class="fas fa-calendar-alt calendar-icon"></i>
              </div>
            </div>
            <!-- tgl pinjam -->
          </div> 
          <!-- form row bawah -->
          <hr style="color: white;">
          <!-- form row bawah -->
          <div class="form-row">
            <!-- tgl pinjam -->
            <div class="form-group">
              <label for="tanggalPengembalian">Tanggal Pengembalian</label>
              <p>Masukkan tanggal pengembalian alat</p>
              <div class="date-input-wrapper">
                <input
                  type="date"
                  id="tanggalPengembalian"
                  v-model="newPeminjaman.tanggalPengembalian"
                  class="date-filter"
                  style="width: 15.7rem"
                />
                <i class="fas fa-calendar-alt calendar-icon"></i>
              </div>
            </div>
            <!-- tgl pinjam -->
          </div> 
          <!-- form row bawah -->
        </div>
        <div class="modal-footer">
          <button @click="gotoPengembalian" class="btn_add_peminjaman">
            Simpan Data
          </button>
        </div>
      </div>
    </div>
    <!-- End of Modal Section -->

    <div class="search-bar">
      <div>
        Tampilkan:
        <select v-model="rowsPerPage" class="select-rows" style="width: 3rem">
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="100">100</option>
        </select>
        baris
      </div>
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
  </div>
</template>

<script>
import jsPDF from "jspdf";
import "jspdf-autotable";
import Papa from "papaparse";

export default {
  data() {
    return {
      showModal: false,
      tampilModal: false,
      isClosing: false,
      newPeminjaman: {
        namaPeminjam: "",
        alat: "",
        bengkel: "",
        tanggalPinjam: "",
        jumlahAlat: "",
        tanggalPengembalian: "",
      },
      peminjamanList: [],
      startDate: "",
      endDate: "",
      rowsPerPage: 5,
      currentPage: 1,
      searchQuery: "",
      editIndex: null,
      dropdownIndex: null,
    };
  },
  computed: {
    filteredPeminjamanList() {
      let filteredList = this.peminjamanList;

      // Filter by search query
      if (this.searchQuery) {
        filteredList = filteredList.filter(
          (peminjaman) =>
            peminjaman.namaPeminjam
              .toLowerCase()
              .includes(this.searchQuery.toLowerCase()) ||
            peminjaman.alat
              .toLowerCase()
              .includes(this.searchQuery.toLowerCase()) ||
            peminjaman.bengkel
              .toLowerCase()
              .includes(this.searchQuery.toLowerCase())
        );
      }

      // Filter by date range
      if (this.startDate && this.endDate) {
        filteredList = filteredList.filter((peminjaman) => {
          const tanggalPinjam = new Date(peminjaman.tanggalPinjam);
          return (
            tanggalPinjam >= new Date(this.startDate) &&
            tanggalPinjam <= new Date(this.endDate)
          );
        });
      }

      return filteredList;
    },
    paginatedPeminjamanList() {
      const start = (this.currentPage - 1) * this.rowsPerPage;
      const end = start + this.rowsPerPage;
      return this.filteredPeminjamanList.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredPeminjamanList.length / this.rowsPerPage);
    },
  },
  methods: {
    addPeminjaman() {
      if (
        this.newPeminjaman.namaPeminjam &&
        this.newPeminjaman.alat &&
        this.newPeminjaman.bengkel &&
        this.newPeminjaman.tanggalPinjam &&
        this.newPeminjaman.jumlahAlat
      ) {
        if (this.editIndex !== null) {
          this.peminjamanList.splice(this.editIndex, 1, {
            ...this.newPeminjaman,
          });
          this.editIndex = null;
        } else {
          this.peminjamanList.push({ ...this.newPeminjaman });
        }
        this.closeModal();
        this.resetForm();
      } else {
        alert("Mohon isi semua data");
      }
    },
    goToPengembalian() {
      this.$router.push('/mainsidebar/datapinjaman');
    },
    editPeminjaman(index) {
      this.newPeminjaman = { ...this.peminjamanList[index] };
      this.editIndex = index;
      this.showModal = true;
    },
    deletePeminjaman(index) {
      this.peminjamanList.splice(index, 1);
      this.dropdownIndex = null;
    },
    closeModal() {
      this.isClosing = true;
      const modalContent = document.querySelector(".modal-content");
      modalContent.classList.add("closing");
      setTimeout(() => {
        this.showModal = false;
        this.tampilModal = false;
        this.isClosing = false;
        modalContent.classList.remove("closing");
      }, 300);
    },
    resetForm() {
      this.newPeminjaman = {
        namaPeminjam: "",
        alat: "",
        bengkel: "",
        tanggalPinjam: "",
        jumlahAlat: "",
      };
      this.editIndex = null;
    },
    toggleDropdown(index) {
      this.dropdownIndex = this.dropdownIndex === index ? null : index;
    },
    filterByDate() {
      this.currentPage = 1; // Reset to first page after filtering
    },
    resetFilter() {
      this.startDate = "";
      this.endDate = "";
      this.filterByDate();
    },
    exportData(format) {
      if (format === "pdf") {
        this.exportPDF();
      } else if (format === "csv") {
        this.exportCSV();
      }
    },
    exportPDF() {
      const doc = new jsPDF();

      doc.text("Daftar Peminjaman belum dikembalikan", 14, 16);
      doc.autoTable({
        startY: 20,
        head: [
          ["Nama Peminjam", "Alat", "Bengkel", "Tanggal Pinjam", "Jumlah Alat"],
        ],
        body: this.filteredPeminjamanList.map((peminjaman) => [
          peminjaman.namaPeminjam,
          peminjaman.alat,
          peminjaman.bengkel,
          peminjaman.tanggalPinjam,
          peminjaman.jumlahAlat,
        ]),
      });

      doc.save("peminjaman.pdf");
    },
    exportCSV() {
      const csv = Papa.unparse({
        fields: [
          "Nama Peminjam",
          "Alat",
          "Bengkel",
          "Tanggal Pinjam",
          "Jumlah Alat",
        ],
        data: this.filteredPeminjamanList.map((peminjaman) => [
          peminjaman.namaPeminjam,
          peminjaman.alat,
          peminjaman.bengkel,
          peminjaman.tanggalPinjam,
          peminjaman.jumlahAlat,
        ]),
      });

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      link.setAttribute("href", url);
      link.setAttribute("download", "peminjaman.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
  },
  watch: {
    rowsPerPage() {
      this.currentPage = 1;
    },
  },
};
</script>

<style>
/* Modal Styles */
.form-row {
  display: flex;
  gap: 20px;
}

.form-group {
  flex: 1;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.date-input-wrapper {
  position: relative;
  display: inline-block;
}

.calendar-icon {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  color: #7b8291; /* Warna ikon sesuai dengan kebutuhan */
  pointer-events: none; /* Agar klik tetap pada input */
}

/* Optional: Tambahkan interaksi klik pada ikon untuk membuka date picker */
.date-input-wrapper:hover .calendar-icon {
  color: #636468; /* Warna saat hover */
}

.modal-content {
  background: #274278 !important;
  padding: 20px;
  border-radius: 10px;
  width: 600px !important;
  max-width: 100% !important;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.3s ease-in-out;
  transition: fadeOut 0.3s ease-out;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center; /* Align items vertically */
  color: white;
}

.modal-header .close-modal {
  font-size: 2rem;
  color: #f30202;
  cursor: pointer;
  margin-bottom: 3rem;
}

.modal-body .form-row {
  display: flex;
  justify-content: space-between;
}

.modal-body {
  margin-top: -1rem;
}

.modal-header h4,
.modal-body label,
.modal-body p {
  color: white;
}

.modal-body p {
  margin-top: -9px;
  margin-bottom: 10px;
  font-size: 12px;
  font-weight: 400;
}

.modal-content .form-control {
  background-color: white;
}

.modal-body .form-group:last-child {
  margin-right: 0;
}

.modal-footer {
  display: flex;
  justify-content: flex-start;
  padding: 10px 0;
}

/* Animation for closing the modal */
@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

.modal-content.closing {
  animation: fadeOut 0.3s ease-out forwards;
}
/* end of the modal */

.header-peminjaman {
  font-weight: bold;
  font-size: 1.7rem;
  color: #274278;
  margin-bottom: 10px;
  margin-top: 50px;
  animation: fadeInDown 1s ease-in-out;
}

.btn_add_peminjaman {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  margin-left: 0px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out, transform 0.3s ease-in-out;
}

.btn_add_peminjaman:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}

.search-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
}

.search-bar-container {
  position: relative;
  display: inline-block;
}

.search-input {
  padding-right: 30px; /* Add some extra padding to accommodate the icon */
}

.search-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #7b8291; /* Change the color of the icon if needed */
  pointer-events: none; /* Make sure the icon doesn't interfere with input interactions */
}

.search-input,
.select-rows {
  padding: 5px;
  border: 1px solid #fff;
  background-color: #fff;
  color: #333;
}

.search-input::placeholder {
  color: #999;
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

/* Dropdown Styling */
.dropdown-menu-act {
  display: none;
  position: absolute;
  top: 100%;
  right: auto;
  left: 1.2rem;
  background-color: #fff;
  width: 8.7rem;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
  border-radius: 5px;
  padding: 10px;
  max-height: 300px;
  overflow-y: auto;
  transform: translateX(-50%);
  text-align: left;
}

.dropdown-menu-act.show {
  display: block;
}

.dropdown-menu-act button:hover {
  background-color: #f1f1f1;
}

.dropdown-item {
  margin-top: 0.3rem;
}
/* end of dropdown style */

/* Dropdown Styling */
.dropdown-menu-export {
  display: none;
  position: absolute;
  top: 100%;
  right: auto;
  left: 3rem;
  background-color: #fff;
  width: 6rem;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
  border-radius: 5px;
  padding: 10px;
  max-height: 26rem;
  overflow-y: auto;
  margin-top: 5px;
  transform: translateX(-50%);
  text-align: left;
}

.dropdown-menu-export.show {
  display: block;
}

.dropdown-menu-export button:hover {
  background-color: #a72828;
  color: #0056b3;
}

.dropdown-item-export {
  margin-top: 0.3rem;
}
/* end of dropdown style */

.date-inputs {
  display: flex;
  gap: 20px;
  align-items: center;
}

.date-sort {
  color: #7a7979;
  font-weight: 300;
}

.date-inputs label {
  font-weight: bold;
  margin-right: 10px;
}

.date-filter {
  padding: 0.5rem 0.9rem;
  width: 13rem;
  border: 1px solid #ffffff;
  border-radius: 5px;
  background-color: white;
  color: #7b8291;
}

.filter-buttons {
  display: flex;
  gap: 8px;
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

.btn-reset {
  background-color: #ffffff;
  color: #4b6cb7;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
}

.btn-filter,
.btn-export {
  background-color: #ffffff;
  color: #4b6cb7;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
  text-align: left;
  margin-right: -2.3rem;
}

.btn-reset:hover {
  background-color: #e9e9e9;
}

.btn-filter:hover,
.btn-export:hover {
  background-color: #e9e9e9;
}

.pagination-container {
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px; /* Add space between the buttons and text */
}
</style>
