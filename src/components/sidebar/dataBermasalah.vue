<template>
  <div>
    <div style="text-align: left; margin-bottom: 1rem" class="header-dataPinjaman-container">
      <h3 class="header-DataPinjaman">Data Pinjaman Bermasalah</h3>
      <p>
        Data pada halaman ini merupakan data alat yang dikembalikan dalam kondisi bermasalah.
      </p>
    </div>
    
    <!-- filter wrapper -->
    <div class="filter-wrapper">
      <!-- Date Filter Section -->
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
            <button @click="resetFilter" 
              class="btn-reset" 
              style="
                height: 2.7rem; 
                width: 3rem;"
              >
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
                  width: 6.5rem;
                  height: 2.72rem;"
              > 
                <i class="fa-solid fa-arrow-up-from-bracket" 
                  style="
                    margin-left: 0.7rem;
                    margin-right: 0.4rem;
                    color: #4b6cb7; ">
                </i>
                Export
              </button>
              <div
                class="dropdown-menu-exports"
                :class="{ show: dropdownIndex === index }"
              >
                <a
                  class="dropdown-item-export"
                  @click="exportData('pdf')"
                  style="color: #4b6cb7;"
                  ><i class="fa fa-file-pdf" 
                      aria-hidden="true"
                      style="
                          margin-left: 0.5rem;
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
                          margin-left: 0.5rem;
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
              style="padding-right: 30px;
                    width: 13rem;"
              placeholder="Cari data..."
            />
          </div>
          <!-- search -->
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
                  @click="toggleDropdown(index)"
                  :aria-expanded="dropdownIndex === index"
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
    </div>
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
.header-dataPinjaman-container {
  margin-top: -3rem;
}

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

.material-symbols-outlined {
  font-variation-settings:
  'FILL' 0,
  'wght' 100,
  'GRAD' 0,
  'opsz' 24
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
.dropdown-menu-exports {
  display: none;
  position: absolute;
  top: 100%;
  right: auto;
  left: 3.3rem;
  background-color: #fff;
  width: 6.5rem;
  box-shadow: 0px 0.2rem 0.5rem 0px rgba(73, 73, 73, 0.2);
  z-index: 1;
  border-radius: 5px;
  padding: 10px;
  max-height: 26rem;
  overflow-y: auto;
  margin-top: 5px;
  transform: translateX(-50%);
  text-align: left;
}

.dropdown-menu-exports.show {
  display: block;
}
/* end of dropdown style */

.btn-reset {
  background-color: #ffffff;
  border: 1px solid #d3d2d2 !important;
  color: #4b6cb7;
  padding: 5px 5px;
  cursor: pointer;
  margin-right: 0.5rem;
  transition: background-color 0.3s ease-in-out;
}

.btn-filter,
.btn-export {
  border-radius: 5px;
  border: 1px solid #d3d2d2 !important;
  cursor: pointer;
  text-align: left;
  margin-right: -2.3rem;
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
