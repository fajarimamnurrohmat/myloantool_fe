<template>
  <div>
    <div style="text-align: left; margin-bottom: 1rem">
      <h3 class="header-DataPinjaman">Data Pinjaman Bermasalah</h3>
      <p>
        Data pada halaman ini merupakan data alat yang dikembalikan dalam kondisi bermasalah.
      </p>
    </div>
    
    <!-- filter wrapper -->
    <div class="filter-wrapper">
      <!-- Date Filter Section -->
      <div class="filter-section">
        <div class="date-inputs">
          <div class="date-input-wrapper">
            <label for="startDate" class="date-sort">Sort Date From:</label>
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
            <input 
              type="date" 
              id="endDate" 
              v-model="endDate" 
              class="date-filter" 
            />
            <i class="fas fa-calendar-alt calendar-icon"></i>
          </div>
          <!-- filter button section -->
          <div class="filter-buttons">
            <button @click="resetFilters" 
              class="btn-reset" 
              style="height: 2.7rem; width: 3rem;">
              <i class="fa fa-sync" aria-hidden="true"></i>
            </button>
            <div class="dropdown d-inline-block">
              <button
                class="btn-export"
                type="button"
                @click="toggleDropdown"
                :aria-expanded="dropdownOpen"
                style="color: #4b6cb7; background-color: white; width: 6.5rem; height: 2.72rem;">
                <i class="fa-solid fa-arrow-up-from-bracket" 
                  style="margin-left: 0.7rem; margin-right: 0.4rem; color: #4b6cb7;">
                </i> Export
              </button>
              <div
                v-if="dropdownOpen"
                class="dropdown-menu-export">
                <a
                  class="dropdown-item-export"
                  @click="exportData('pdf')"
                  style="color: #4b6cb7;">
                  <i class="fa fa-file-pdf" aria-hidden="true" style="margin-left: 0.5rem; margin-right: 0.1rem;"></i> .pdf
                </a>
                <a
                  class="dropdown-item-export"
                  @click="exportData('csv')"
                  style="color: #4b6cb7;">
                  <i class="fa-solid fa-file-csv" aria-hidden="true" style="margin-left: 0.5rem; margin-right: 0.1rem;"></i> .csv
                </a>
              </div>
            </div>
          </div>
          <!-- search -->
          <div class="search-bar-container">
            <i class="fas fa-search search-icon"></i>
            <input
              type="text"
              v-model="searchQuery"
              class="search-input"
              style="padding-right: 30px; width: 10rem;"
              placeholder="Cari data..."
            />
          </div>
          <!-- search -->
        </div>
      </div>
      <!-- End of Date Filter Section -->
    </div>
    <!-- End of filter wrapper -->

    <div class="table-wrapper">
      <div class="tampil-baris" style="text-align: left; margin-bottom: 1rem;">
        Tampilkan:
        <select v-model="rowsPerPage" class="select-rows" style="width: 3rem">
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="100">100</option>
        </select>
        baris
      </div> 
      <!-- Tabel Data -->
      <table>
        <thead>
          <tr>
            <th>Nama Peminjam</th>
            <th>Alat</th>
            <th>Bengkel</th>
            <th>Jumlah</th>
            <th>Tgl Pinjam</th>
            <th>Tgl Permasalahan</th>
            <th>Kondisi</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(record, index) in displayedData" :key="index">
            <td>{{ record.namaPeminjam }}</td>
            <td>{{ record.alat }}</td>
            <td>{{ record.bengkel }}</td>
            <td>{{ record.jumlah }}</td>
            <td>{{ record.tanggalPinjam }}</td>
            <td>{{ record.tanggalPermasalahan }}</td>
            <td>{{ record.kondisi }}</td>
            <td>
              <div class="dropdown d-inline-block">
                <button
                  class="btn btn-sm"
                  type="button"
                  @click="openPengelunasanModal(record)"
                >
                <span class="material-symbols-outlined">
                priority
                </span>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
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
                      style="width: 16rem; height: 2.5rem;"
                      id="bengkel"
                      class="form-control"
                      v-model="newPeminjaman.bengkel"
                    />
                  </div>
                  <!-- bengkel -->
                  <!-- tgl pinjam -->
                  <div class="form-group">
                    <label for="tanggalPinjam">Tanggal Pinjam</label>
                    <p>Masukkan tanggal pinjam alat</p>
                    <div class="date-input-wrapper">
                      <input
                        type="date"
                        id="tanggalPinjam"
                        v-model="newPeminjaman.tanggalPinjam"
                        class="date-filter"
                        style="width: 12rem"
                      />
                      <i class="fas fa-calendar-alt calendar-icon"></i>
                    </div>
                  </div>
                  <!-- tgl pinjam -->
                  <!-- jumlah -->
                  <div class="form-group">
                    <label for="jumlahAlat">Jumlah Alat</label>
                    <input
                      type="number"
                      style="width: 100px; margin-top: 1.55rem; height: 2.5rem;"
                      id="jumlahAlat"
                      class="form-control"
                      v-model="newPeminjaman.jumlahAlat"
                    />
                  </div>
                  <!-- jumlah -->
                </div>
                <!-- form row bawah -->
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
                          v-model="newPengembalian.tanggalPengembalian"
                          class="date-filter"
                          style="width: 15.7rem"
                        />
                        <i class="fas fa-calendar-alt calendar-icon"></i>
                      </div>
                    </div>
                    <!-- tgl pinjam -->
                </div> 
                <!-- form row bawah -->
              <!-- form row -->
            </div>

            <!-- Conditional Rendering for 'Bermasalah' Content -->
            <div v-if="selectedOption === 'bermasalah'">
              <!-- Content for 'Bermasalah' -->
              <!-- form row atas -->
              <div class="form-row">
                <!-- peminjam -->
                <div class="form-group">
                  <label for="namaPeminjam">Nama Peminjam</label>
                  <p>Masukkan nama peminjam</p>
                  <input
                    type="text"
                    style="width: 16rem"
                    id="namaPeminjam"
                    class="form-control"
                    v-model="newPeminjaman.namaPeminjam"
                  />
                </div>
                <!-- peminjam -->
                <!-- alat -->
                <div class="form-group" style="margin-left: -4.3rem;">
                  <label for="alat">Alat</label>
                  <p>Masukkan nama alat</p>
                  <input
                    type="text"
                    id="alat"
                    style="width: 19.4rem;"
                    class="form-control"
                    v-model="newPeminjaman.alat"
                  />
                </div>
                <!-- alat -->
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
                      style="width: 16rem; height: 2.5rem;"
                      id="bengkel"
                      class="form-control"
                      v-model="newPeminjaman.bengkel"
                    />
                  </div>
                  <!-- bengkel -->
                  <!-- tgl pinjam -->
                  <div class="form-group">
                    <label for="tanggalPinjam">Tanggal Pinjam</label>
                    <p>Masukkan tanggal pinjam alat</p>
                    <div class="date-input-wrapper">
                      <input
                        type="date"
                        id="tanggalPinjam"
                        v-model="newPeminjaman.tanggalPinjam"
                        class="date-filter"
                        style="width: 12rem"
                      />
                      <i class="fas fa-calendar-alt calendar-icon"></i>
                    </div>
                  </div>
                  <!-- tgl pinjam -->
                  <!-- jumlah -->
                  <div class="form-group">
                    <label for="jumlahAlat">Jumlah Alat</label>
                    <input
                      type="number"
                      style="width: 100px; margin-top: 1.55rem; height: 2.5rem;"
                      id="jumlahAlat"
                      class="form-control"
                      v-model="newPeminjaman.jumlahAlat"
                    />
                  </div>
                  <!-- jumlah -->
                </div>
                <!-- form row bawah -->
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
                          v-model="newPengembalian.tanggalPengembalian"
                          class="date-filter"
                          style="width: 15.7rem"
                        />
                        <i class="fas fa-calendar-alt calendar-icon"></i>
                      </div>
                    </div>
                    <!-- tgl pinjam -->
                    <!-- jml alat rusak -->
                    <div class="form-group" style="margin-left: 0.3rem;">
                      <label for="jumlahAlatRusak" style="font-size: 0.9rem;">Jumlah Alat Rusak</label>
                      <input
                      type="number"
                      style="margin-top: 1.6rem; height: 2.5rem; width: 12rem;"
                      id="jumlahAlatRusak"
                      class="form-control"
                      v-model="newPengembalian.jumlahAlatRusak"
                    />
                    </div>
                    <!-- jml alat rusak -->
                    <!-- kondisi alat -->
                    <div class="form-group">
                      <label for="kondisiAlat">Kondisi Alat</label>
                      <select 
                        v-model="showCondi" 
                        class="select-condi"
                        >
                        <option value=""></option>
                        <option value="Rusak">Rusak</option>
                        <option value="Hilang">Hilang</option>
                      </select>
                    </div>
                    <!-- kondisi alat -->
                  </div> 
                  <!-- form row bawah -->
              </div>
              
            </div>
            <div class="modal-footer">
              <button @click="savePeminjaman" class="btn_add_peminjaman">
                Simpan Data
              </button>
            </div>
          </div>
        </div>
        <!-- End of Modal Section -->
  </div>
</template>

<script>
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

export default {
  name: "DataPengembalianPinjaman",
  data() {
    return {
      returnedLoans: [
        {
          namaPeminjam: "John Doe",
          alat: "Hammer",
          bengkel: "Bengkel Mesin",
          jumlah: 2,
          tanggalPinjam: "2024-08-01",
          tanggalPermasalahan: "2024-08-10",
          kondisi: "hilang",
        },
        // Tambahkan data lainnya di sini
      ],
      displayedData: [],
      rowsPerPage: 5,
      startDate: "",
      endDate: "",
      searchQuery: "",
      dropdownIndex: null,
      dropdownOpen: false,
      tampilModal: false,
      newPeminjaman: {},
    };
  },
  mounted() {
    this.updateDisplayedData();
  },
  methods: {
    updateDisplayedData() {
      let filteredData = this.returnedLoans;

      // Filter berdasarkan tanggal
      if (this.startDate || this.endDate) {
        filteredData = filteredData.filter((record) => {
          const permasalahanDate = new Date(record.tanggalPermasalahan);
          return (
            (!this.startDate || permasalahanDate >= new Date(this.startDate)) &&
            (!this.endDate || permasalahanDate <= new Date(this.endDate))
          );
        });
      }

      // Filter berdasarkan pencarian
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filteredData = filteredData.filter((record) => {
          return (
            record.namaPeminjam.toLowerCase().includes(query) ||
            record.alat.toLowerCase().includes(query) ||
            record.bengkel.toLowerCase().includes(query)
          );
        });
      }

      // Ambil data sesuai dengan rowsPerPage
      this.displayedData = filteredData.slice(0, this.rowsPerPage);
    },
    filterData() {
      this.updateDisplayedData();
    },
    exportData(type) {
      const exportData = this.displayedData;

      if (type === "csv") {
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "DataPengembalian");
        XLSX.writeFile(wb, "data_pengembalian.csv");
      } else if (type === "pdf") {
        const doc = new jsPDF();
        doc.autoTable({
          head: [
            [
              "Nama Peminjam",
              "Alat",
              "Bengkel",
              "Jumlah",
              "Tanggal Pinjam",
              "Tanggal Permasalahan",
              "Kondisi"
            ],
          ],
          body: exportData.map((record) => [
            record.namaPeminjam,
            record.alat,
            record.bengkel,
            record.jumlah,
            record.tanggalPinjam,
            record.tanggalPermasalahan,
            record.kondisi,
          ]),
        });
        doc.save("data_pengembalian.pdf");
      }
    },
    openPengelunasanModal(peminjaman) {
      console.log('Button clicked!');
      console.log(peminjaman);
      this.newPeminjaman = { ...peminjaman }; // Copy data peminjaman ke newPeminjaman
      this.tampilModal = true;
    },
    closeModal() {
      this.tampilModal = false;
    },
    resetForm() {
      this.newPeminjaman = {
        namaPeminjam: "",
        alat: "",
        bengkel: "",
        jumlahAlat: "",
        tanggalPinjam: "",
        tanggalPengembalian: ""
      };
      this.editIndex = null;
    },
    toggleDropdown(index) {
      this.dropdownIndex = this.dropdownIndex === index ? null : index;
    },
    filterByDate() {
      this.currentPage = 1; // Reset to first page after filtering
    },
    resetFilters() {
      this.startDate = "";
      this.endDate = "";
      this.searchQuery = "";
      this.updateDisplayedData();
    },
    toggleDropdown(index) {
      this.dropdownIndex = this.dropdownIndex === index ? null : index;
    },
  },
};
</script>

<style scoped>
.header-DataPinjaman {
  font-weight: bold;
  color: #274278;
  font-size: 1.7rem;
  margin-bottom: 10px;
  margin-top: 30px;
  animation: fadeInDown 1s ease-in-out;
}

.filters {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.filters2 {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.date-inputs {
  display: flex;
  justify-content: space-between; 
  align-items: center; 
}

.date-filter {
  padding: 0.5rem 0.9rem;
  width: 13rem;
  border: 1px solid #d3d2d2 !important;
  border-radius: 5px;
  background-color: white;
  color: #7b8291;
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

.btn {
  z-index: 9999; /* Pastikan button berada di atas elemen lain */
  position: relative;
}

.search-icon {
  color: #888;
  margin-right: 5px;
}

.filter-wrapper {
  width: 100%;
  overflow-x: auto;
  background-color: white;
  margin-top: 1rem;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
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

.filters label {
  font-weight: bold;
}

.filters2 select,
.filters input[type="date"],
.filters2 input[type="text"] {
  margin-left: 10px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
  color: #333; /* Warna teks agar kontras dengan latar belakang */
}

.filters input[type="date"] {
  background-color: #f9f9f9; /* Warna latar belakang untuk input tanggal */
  color: #7b8291; /* Warna teks untuk input tanggal */
}

.filters2 input[type="text"] {
  background-color: #fff; /* Warna latar belakang untuk input teks */
}

.search-bar-container {
  position: relative;
  display: inline-block;
  margin-left: 1.5rem;
}

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

.btn-reset {
  background-color: #ffffff;
  border: 1px solid #d3d2d2 !important;
  color: #4b6cb7;
  padding: 5px 5px;
  cursor: pointer;
  margin-right: 0;
  transition: background-color 0.3s ease-in-out;
}

.btn-filter,
.btn-export {
  border-radius: 5px;
  border: 1px solid #d3d2d2 !important;
  cursor: pointer;
  text-align: left;
  margin-right: -2.3rem;
  z-index: 99999;
}

.btn-reset:hover {
  background-color: #f5f5f5;
}

.pagination-container {
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px; /* Add space between the buttons and text */
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
}

th {
  background-color: #f4f4f4;
}
</style>
