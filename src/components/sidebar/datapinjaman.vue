<template>
  <div>
    <div style="text-align: left; margin-bottom: 1rem">
      <h3 class="header-DataPinjaman">Data Pinjaman Telah Dikembalikan</h3>
      <p>
        Data pada halaman ini merupakan data barang yang memiliki kondisi baik.
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
                class="dropdown-menu-export"
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
                    width: 10rem;"
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
          <th>Tanggal Pinjam</th>
          <th>Tanggal Kembali</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="peminjamanList.length === 0">
            <td colspan="6" style="text-align: center;">Tidak ada data</td>
          </tr>
          <tr v-for="(record, index) in peminjamanList" :key="index">
            <td>{{ record.namaPeminjam }}</td>
            <td>{{ record.alat }}</td>
            <td>{{ record.bengkel }}</td>
            <td>{{ record.jumlahAlat }}</td>
            <td>{{ record.tanggalPinjam }}</td>
            <td>{{ record.tanggalPengembalian }}</td>
          </tr>
        </tbody>
    </table>
  </div>
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
      peminjamanList: [],
      displayedData: [],
      rowsPerPage: 5,
      startDate: "",
      endDate: "",
      searchQuery: "",
      dropdownIndex: null,
    };
  },
  created() {
    // Ambil data peminjaman dari route params jika tersedia
    if (this.$route.params.peminjamanList) {
      this.peminjamanList = this.$route.params.peminjamanList;
    }
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

.filter-wrapper {
  width: 100%;
  overflow-x: auto;
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

.search-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
}

.search-bar-container {
  position: relative;
  display: inline-block;
  border: 1px solid #d3d2d2; /* Same as the date-filter border */
  border-radius: 5px;         /* Optional, to match the rounded corners */
  padding: 0.25rem 0.9rem;     /* Similar padding to the date-filter */
  background-color: white;
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
  border: 1px solid #d3d2d2 !important;
  border-radius: 5px;
  background-color: white;
  color: #7b8291;
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

.btn-reset {
  background-color: #ffffff;
  border: 1px solid #d3d2d2 !important;
  color: #4b6cb7;
  padding: 10px 20px;
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
