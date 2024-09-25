<template>
  <div>
    <div style="text-align: left; margin-bottom: 1rem">
      <h3 class="header-DataPinjaman">Data Pinjaman Telah Dikembalikan</h3>
      <p>
        Data pada halaman ini merupakan data barang yang memiliki kondisi baik.
      </p>
    </div>
    <hr />

    <!-- Date Filter Section -->
  <div class="filter-section">
    <div class="date-inputs">
      <div class="date-input-wrapper">
        <label for="startDate" class="date-sort">Sort From:</label>
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
    <div class="tampil-baris" style="text-align: left; margin-top: 2rem; margin-bottom: 1rem;">
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
          <th>Tanggal Pinjam</th>
          <th>Tanggal Kembali</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="displayedData.length === 0">
          <td colspan="6" style="text-align: center;">Tidak ada data</td>
        </tr>
        <tr v-for="(record, index) in displayedData" :key="index">
          <td>{{ record.namaPeminjam }}</td>
          <td>{{ record.alat }}</td>
          <td>{{ record.bengkel }}</td>
          <td>{{ record.jumlah }}</td>
          <td>{{ record.tanggalPinjam }}</td>
          <td>{{ record.tanggalKembali }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

export default {
  name: "DataPengembalianPinjaman",
  data() {
    return {
      returnedLoans: [
        
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
          const kembaliDate = new Date(record.tanggalKembali);
          return (
            (!this.startDate || kembaliDate >= new Date(this.startDate)) &&
            (!this.endDate || kembaliDate <= new Date(this.endDate))
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
              "Tanggal Kembali",
            ],
          ],
          body: exportData.map((record) => [
            record.namaPeminjam,
            record.alat,
            record.bengkel,
            record.jumlah,
            record.tanggalPinjam,
            record.tanggalKembali,
          ]),
        });
        doc.save("data_pengembalian.pdf");
      }
    },
    toggleDropdown(index) {
      this.dropdownIndex = this.dropdownIndex === index ? null : index;
    },
    resetFilters() {
      this.startDate = "";
      this.endDate = "";
      this.searchQuery = "";
      this.updateDisplayedData();
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

.filters label {
  font-weight: bold;
}

.filters2 select,
.filters input[type="date"] {
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
