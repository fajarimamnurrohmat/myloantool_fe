<template>
<div>
    <div class="header-tooltip">
        <h3 class="header-DataPinjaman">Data Pinjaman Telah Dikembalikan</h3>
        <div>
            <button type="button" class="btn" data-toggle="tooltip" data-placement="top" title="Data pada halaman ini merupakan data barang yang memiliki kondisi baik.">
                <span class="material-symbols-outlined">
                    info
                </span>
            </button>
        </div>
    </div>

    <!-- filter wrapper -->
    <div class="filter-wrapper">
        <!-- Date Filter Section -->
        <div class="date-inputs">
            <div class="date-input-wrapper">
                <label for="startDate" class="date-sort">Sort Date From:</label>
                <input type="date" id="startDate" v-model="startDate" class="date-filter" />
                <i class="fas fa-calendar-alt calendar-icon"></i>
            </div>
            <div class="date-input-wrapper">
                <label for="endDate" class="date-sort">To:</label>
                <input type="date" id="endDate" v-model="endDate" class="date-filter" />
                <i class="fas fa-calendar-alt calendar-icon"></i>
            </div>
            <!-- filter button section -->
            <div class="filter-buttons">
                <button @click="resetFilters" class="btn-reset" style="height: 2.7rem; width: 3rem">
                    <i class="fa fa-sync" aria-hidden="true"></i>
                </button>
                <div class="dropdown d-inline-block">
                    <button class="btn-export" type="button" @click="toggleDropdown" :aria-expanded="dropdownOpen" style="
                color: #4b6cb7;
                background-color: white;
                width: 6.5rem;
                height: 2.72rem;
              ">
                        <i class="fa-solid fa-arrow-up-from-bracket" style="
                          margin-left: 0.7rem;
                          margin-right: 0.4rem;
                          color: #4b6cb7;
                        ">
                        </i>
                        Export
                    </button>
                    <div v-if="dropdownOpen" class="dropdown-menu-export">
                        <a class="dropdown-item-export" @click="exportData('pdf')" style="color: #4b6cb7">
                            <i class="fa fa-file-pdf" aria-hidden="true" style="margin-left: 0.5rem; margin-right: 0.1rem"></i>
                            .pdf
                        </a>
                        <a class="dropdown-item-export" @click="exportData('csv')" style="color: #4b6cb7">
                            <i class="fa-solid fa-file-csv" aria-hidden="true" style="margin-left: 0.5rem; margin-right: 0.1rem"></i>
                            .csv
                        </a>
                    </div>
                </div>
            </div>
            <!-- search -->
            <div class="search-bar-container">
                <i class="fas fa-search search-icon"></i>
                <input type="text" v-model="searchQuery" class="search-input" style="padding-right: 30px; width: 10rem" placeholder="Cari data..." />
            </div>
            <!-- search -->
        </div>
        <!-- End of Date Filter Section -->
    </div>
    <!-- End of filter wrapper -->

    <div class="table-wrapper">
      <div class="info-page">
        <div style="text-align: left">
            Tampilkan:
            <select v-model="rowsPerPage" class="select-rows" style="width: 3rem">
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="100">100</option>
            </select>
            baris
        </div>
        <div>
          <p class="page-info">{{ pageInfo }}</p>
        </div>
      </div>
        <!-- Tabel Data -->
        <table>
            <thead>
                <tr>
                    <th>Nama Peminjam <span class="material-symbols-outlined swap-sort" @click="toggleSort('nama_siswa')">
                            swap_vert
                        </span>
                    </th>
                    <th>Alat <span class="material-symbols-outlined swap-sort" @click="toggleSort('nama_alat')">
                            swap_vert
                        </span></th>
                    <th>Bengkel <span class="material-symbols-outlined swap-sort" @click="toggleSort('ruang_bengkel')">
                            swap_vert
                        </span></th>
                    <th>Jumlah kembali<span class="material-symbols-outlined swap-sort" @click="toggleSort('jumlah')">
                            swap_vert
                        </span></th>
                    <th>Tanggal Pinjam<span class="material-symbols-outlined swap-sort" @click="toggleSort('tanggal_pinjam')">
                            swap_vert
                        </span></th>
                    <!-- <th>Jumlah Pengembalian <span class="material-symbols-outlined swap-sort" @click="toggleSort('jumlah_pengembalian')">
                            swap_vert
                        </span></th> -->
                    <th>Tanggal Kembali<span class="material-symbols-outlined swap-sort" @click="toggleSort('tgl_kembali')">
                            swap_vert
                        </span></th>
                </tr>
            </thead>
            <tbody>
              <tr v-if="displayedData.length === 0">
                <td colspan="6" style="text-align: center">Tidak ada data</td>
              </tr>
              <tr v-for="(record, index) in displayedData" :key="index">
                <td>{{ record.nama_siswa }}</td>
                <td>{{ record.nama_alat }}</td>
                <td>{{ record.ruang_bengkel }}</td>
                <td>{{ record.jumlah }}</td>
                <td>{{ formatDate(record.tanggal_pinjam) }}</td>
                <td>{{ formatDate(record.tgl_kembali) }}</td>
              </tr>
            </tbody>
        </table>

        <div v-if="totalPages > 1" class="pagination-container">
            <button @click="currentPage--" :disabled="currentPage === 1" class="pagination-button">
                Previous
            </button>
            <span class="pagination-info">
                Page {{ currentPage }} of {{ totalPages }}
            </span>
            <button @click="currentPage++" :disabled="currentPage === totalPages" class="pagination-button">
                Next
            </button>
        </div>
    </div>
</div>
</template>

<script>
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

export default {
    name: "DataPengembalianPinjaman",
    data() {
        return {
            returnedLoans: [], // Data pengembalian
            rowsPerPage: 5,
            currentPage: 1,
            startDate: "",
            endDate: "",
            searchQuery: "",
            sortBy: "nama_siswa",
            sortDirection: "asc",
            dropdownOpen: false, // Dropdown state
            displayedData: [],
        };
    },
    methods: {
        formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString("id-ID", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            });
        },
        exportData(type) {
            const exportData = this.filteredLoans;
            if (type === "csv") {
                const ws = XLSX.utils.json_to_sheet(exportData);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "DataPengembalian");
                XLSX.writeFile(wb, "data_pengembalian.csv");
            } else if (type === "pdf") {
                const doc = new jsPDF();
                doc.autoTable({
                    head: [
                        ["Nama Peminjam", "Alat", "Bengkel", "Jumlah dikembalikan", "Tanggal Pinjam", "Tanggal Kembali"]
                    ],
                    body: exportData.map((record) => [
                        record.nama_siswa,
                        record.nama_alat,
                        record.ruang_bengkel,
                        record.jumlah,
                        this.formatDate(record.tanggal_pinjam),
                        this.formatDate(record.tgl_kembali),
                    ]),
                });
                doc.save("data_pengembalian.pdf");
            }
        },
        toggleDropdown() {
            this.dropdownOpen = !this.dropdownOpen;
            if (this.dropdownOpen) {
                document.addEventListener("click", this.closeDropdownOnOutsideClick);
            }
        },
        closeDropdownOnOutsideClick(event) {
            if (!this.$el.contains(event.target)) {
                this.dropdownOpen = false;
                document.removeEventListener("click", this.closeDropdownOnOutsideClick);
            }
        },
        resetFilters() {
            this.startDate = "";
            this.endDate = "";
            this.searchQuery = "";
        },
        fetchReturnedLoans() {
            const accessToken = localStorage.getItem("accessToken");
            axios
                .get("http://localhost:3000/pengembalian", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    },
                })
                .then((response) => {
                    if (response.data.status === "success") {
                        this.returnedLoans = response.data.data.pengembalian;
                    } else {
                        console.error("Data tidak ditemukan");
                    }
                })
                .catch((error) => {
                    console.error("Terjadi kesalahan saat memuat data:", error);
                });
        },
        toggleSort(column) {
            if (this.sortBy === column) {
                this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
            } else {
                this.sortBy = column;
                this.sortDirection = "asc";
            }
        },
        updateDisplayedData() {
            const startIndex = (this.currentPage - 1) * this.rowsPerPage;
            const endIndex = startIndex + this.rowsPerPage;
            this.displayedData = this.filteredLoans.slice(startIndex, endIndex);
        },
    },
  computed: {
    pageInfo() {
      const totalData = this.filteredLoans.length;
      const startIndex = (this.currentPage - 1) * this.rowsPerPage + 1;
      const endIndex = Math.min(
        startIndex + this.rowsPerPage - 1,
        totalData
      );
      return `Menampilkan ${startIndex} sampai ${endIndex} dari ${totalData} data`;
    },
        filteredLoans() {
            let filtered = this.returnedLoans;
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                filtered = filtered.filter((record) =>
                    record.nama_siswa.toLowerCase().includes(query)
                );
            }
            filtered.sort((a, b) => {
                const valA = a[this.sortBy]?.toString().toLowerCase() || "";
                const valB = b[this.sortBy]?.toString().toLowerCase() || "";
                return this.sortDirection === "asc" ?
                    valA.localeCompare(valB) :
                    valB.localeCompare(valA);
            });
            return filtered;
        },
        totalPages() {
            return Math.ceil(this.filteredLoans.length / this.rowsPerPage);
        },
        displayedData() {
            const start = (this.currentPage - 1) * this.rowsPerPage;
            const end = start + this.rowsPerPage;
            return this.filteredLoans.slice(start, end);
        },
    },
    watch: {
        currentPage() {
            this.updateDisplayedData();
        },
        rowsPerPage() {
            this.updateDisplayedData();
        },
        filteredLoans() {
            this.updateDisplayedData();
        },
    },
    created() {
        this.fetchReturnedLoans();
        this.updateDisplayedData(); // Initialize displayed data
    },
};
</script>

<style scoped>
.header-tooltip {
    text-align: left;
    margin-bottom: 1rem;
    margin-top: 3rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.header-DataPinjaman {
    font-weight: bold;
    color: #274278;
    font-size: 1.7rem;
    margin: 0;
}

.header-tooltip button {
    background: none;
    border: none;
    margin-top: 0.5rem;
    padding: 0;
    cursor: pointer;
}

.filter-wrapper {
    width: 100%;
    /* overflow-x: auto; */
    background-color: white;
    margin-top: 0.2rem !important;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.table-wrapper {
    width: 100%;
    /* overflow-x: auto; */
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
    border: 1px solid #d3d2d2;
    /* Same as the date-filter border */
    border-radius: 5px;
    /* Optional, to match the rounded corners */
    padding: 0.25rem 0.9rem;
    /* Similar padding to the date-filter */
    background-color: white;
}

.search-icon {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #7b8291;
    /* Change the color of the icon if needed */
    pointer-events: none;
    /* Make sure the icon doesn't interfere with input interactions */
}

.search-input,
.select-rows {
    padding: 5px;
    border: 1px solid #ccc;
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
    height: 2rem;
    /* reduce the height */
    width: 2.5rem;
    padding: 0.2rem;
    /* add some padding */
}

.filter-buttons button i {
    font-size: 1rem;
    /* increase the font size of the icon */
}

.search-bar-container {
    position: relative;
    display: inline-block;
    margin-left: 1.5rem;
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

/* Dropdown Styling */
.dropdown-menu-export {
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
/* end of dropdown style */

.pagination-container {
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 15px;
}

.info-page {
    display: flex;
    justify-content: space-between;
    align-items: center; /* Memastikan elemen sejajar vertikal */
    margin-bottom: 1rem;
}

.select-rows {
    padding: 0.25rem; /* Konsisten padding */
    font-size: 1rem;
    line-height: 1.5; /* Sama dengan elemen teks lainnya */
}

.page-info {
    font-size: 0.9rem; /* Ukuran font serupa dengan teks lainnya */
    line-height: 1.5; /* Konsistensi line-height */
    color: #555;
    margin: 0; /* Hilangkan margin tambahan */
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

/* Untuk layar device berukuran kecil (misalnya kurang dari 410px) */
@media screen and (max-width: 450px) {
    .header-tooltip {
        margin-top: 3rem;
    }

    .filter-wrapper,
    .date-inputs,
    .date-input-wrapper,
    .date-input-wrapper {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        /* Agar konten rata kiri */
        width: 100%;
        /* Menyesuaikan lebar konten */
    }

    .date-input-wrapper {
        width: 100%;
    }

    .date-filter {
        width: 100%;
    }

    .date-filter-modal {
        padding: 0.5rem 0.9rem;
        width: 90%;
        border: 1px solid #d3d2d2 !important;
        border-radius: 5px;
        background-color: white;
        color: #7b8291;
    }

    .calendar-icon {
        position: absolute;
        right: 1rem;
        /* Sedikit jarak dari tepi kanan */
        top: 70%;
        transform: translateY(-50%);
        /* Menempatkan ikon di tengah secara vertikal */
        font-size: 1.2rem;
        /* Sesuaikan ukuran ikon agar proporsional */
        pointer-events: none;
    }

    .calendar-icon-i {
        position: absolute;
        right: 3rem;
        /* Sedikit jarak dari tepi kanan */
        top: 50%;
        transform: translateY(-50%);
        /* Menempatkan ikon di tengah secara vertikal */
        font-size: 1.2rem;
        /* Sesuaikan ukuran ikon agar proporsional */
        color: #7b8291;
        /* Warna ikon sesuai dengan kebutuhan */
        pointer-events: none;
        /* Agar klik tetap pada input */
    }

    .filter-buttons {
        display: flex;
        gap: 0.5rem;
        align-items: flex-start;
        margin-left: 0rem;
    }

    .btn-reset,
    .btn-export {
        width: auto;
        height: 2.7rem;
    }

    .search-bar-container {
        margin-left: 0rem;
        text-align: left;
    }
}
</style>
