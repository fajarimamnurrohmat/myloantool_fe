<template>
  <div>
    <div class="header-tooltip">
      <h3 class="header-dataBermasalah">Halaman Pengembalian Bermasalah</h3>
      <div>
        <button
          type="button"
          class="btn"
          data-toggle="tooltip"
          data-placement="top"
          title="Data pada halaman ini memuat pengembalian barang yang dalam kondisi bermasalah."
        >
          <span class="material-symbols-outlined"> info </span>
        </button>
      </div>
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
        <div class="filter-buttons">
          <button
            @click="resetFilters"
            class="btn-reset"
            style="height: 2.7rem; width: 3rem"
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
                height: 2.72rem;
              "
            >
              <i
                class="fa-solid fa-arrow-up-from-bracket"
                style="
                  margin-left: 0.7rem;
                  margin-right: 0.4rem;
                  color: #4b6cb7;
                "
              ></i>
              Export
            </button>
            <div
              class="dropdown-menu-exports"
              :class="{ show: dropdownIndex === index }"
            >
              <a
                class="dropdown-item-export"
                @click="exportData('pdf')"
                style="color: #4b6cb7"
              >
                <i
                  class="fa fa-file-pdf"
                  aria-hidden="true"
                  style="margin-left: 0.5rem; margin-right: 0.1rem"
                ></i>
                .pdf
              </a>
              <a
                class="dropdown-item-export"
                @click="exportData('csv')"
                style="color: #4b6cb7"
              >
                <i
                  class="fa-solid fa-file-csv"
                  aria-hidden="true"
                  style="margin-left: 0.5rem; margin-right: 0.1rem"
                ></i>
                .csv
              </a>
            </div>
          </div>
        </div>
        <div class="search-bar-container">
          <i class="fas fa-search search-icon"></i>
          <input
            type="text"
            v-model="searchQuery"
            class="search-input"
            style="padding-right: 30px; width: 13rem"
            placeholder="Cari data..."
          />
        </div>
      </div>
    </div>

    <div class="table-wrapper">
      <div class="info-page">
        <div class="tampil-baris" style="text-align: left">
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
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>
              Nama Peminjam
              <span
                class="material-symbols-outlined swap-sort"
                @click="toggleSort('nama_siswa')"
              >
                swap_vert
              </span>
            </th>
            <th>
              Alat
              <span
                class="material-symbols-outlined swap-sort"
                @click="toggleSort('nama_alat')"
              >
                swap_vert
              </span>
            </th>
            <th>
              Bengkel
              <span
                class="material-symbols-outlined swap-sort"
                @click="toggleSort('ruang_bengkel')"
              >
                swap_vert
              </span>
            </th>
            <th>
              Jumlah
              <span
                class="material-symbols-outlined swap-sort"
                @click="toggleSort('jumlah')"
              >
                swap_vert
              </span>
            </th>
            <th>
              Tgl Pinjam<span
                class="material-symbols-outlined swap-sort"
                @click="toggleSort('tanggal_pinjam')"
              >
                swap_vert
              </span>
            </th>
            <th>
              Tgl Permasalahan<span
                class="material-symbols-outlined swap-sort"
                @click="toggleSort('tgl_permasalahan')"
              >
                swap_vert
              </span>
            </th>
            <th>Kondisi</th>
            <th style="text-align: center">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(record, index) in displayedData"
            :key="record.id_alat_bermasalah"
          >
            <td>{{ index + 1 + (currentPage - 1) * rowsPerPage }}</td>
            <td>{{ record.nama_siswa }}</td>
            <td>{{ record.nama_alat }}</td>
            <td>{{ record.ruang_bengkel }}</td>
            <td>{{ record.jumlah }}</td>
            <td>{{ formatDate(record.tanggal_pinjam) }}</td>
            <td>{{ formatDate(record.tgl_permasalahan) }}</td>
            <td>{{ record.kondisi }}</td>
            <td style="text-align: center">
              <button
                class="btn btn-sm"
                @click="preparPostAlatBermasalah(record)"
              >
                <span class="material-symbols-outlined"> redo </span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Start of Modal Section -->
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <!-- Modal Content -->
        <div class="modal-content">
          <!-- Modal Header -->
          <div class="modal-header">
            <h4>Ubah Status Pinjaman Bermasalah</h4>
            <span class="close-modal" @click="closeModal">&times;</span>
          </div>
          <!-- End of Modal Header -->
          <!-- Modal Body -->
          <div class="modal-body">
            <!-- Row atas -->
            <div class="form-row">
              <!-- alat dipinjam -->
              <div class="form-group">
                <label for="alat">Alat Dipinjam</label>
                <p>Alat - Ruang Bengkel</p>
                <select
                  id="alat"
                  class="form-control-alat"
                  v-model="newPengembalianAlatBermasalah.alat_dipinjam"
                >
                  <option disabled value="">Pilih Siswa</option>
                  <option
                    v-for="record in displayedData"
                    :key="record.id_alat_bermasalah"
                    :value="record.nama_alat"
                    disabled
                  >
                    {{ record.nama_alat }} - {{ record.ruang_bengkel }}
                  </option>
                </select>
              </div>
              <!-- peminjam -->
              <div class="form-group-nama">
                <label for="namaPeminjam">Nama Peminjam</label>
                <p>Nama Peminjam</p>
                <select
                  id="namaPeminjam"
                  class="form-control-peminjaman"
                  v-model="newPengembalianAlatBermasalah.nama_peminjam"
                >
                  <option disabled value="">Pilih Siswa</option>
                  <option
                    v-for="record in displayedData"
                    :key="record.id_alat_bermasalah"
                    :value="record.nama_siswa"
                    disabled
                  >
                    {{ record.nama_siswa }}
                  </option>
                </select>
              </div>
            </div>
            <div class="form-row">
              <!-- tgl pinjam -->
              <div class="form-group">
                <label for="tanggalPinjam">Tanggal Pinjam</label>
                <p>Masukkan tanggal pinjam alat</p>
                <div class="date-input-wrapper">
                  <input
                    type="date"
                    id="tanggalPinjam"
                    v-model="newPengembalianAlatBermasalah.tgl_peminjaman"
                    class="date-filter-modal"
                    disabled
                  />
                  <i class="fas fa-calendar-alt calendar-icon-i"></i>
                </div>
              </div>
              <!-- end of tgl pinjam -->
              <!-- jumlah -->
              <div class="form-group-jumlah">
                <label for="jumlahAlat">Jumlah Pinjaman</label>
                <p>Masukkan jumlah alat yang dipinjam</p>
                <input
                  type="number"
                  id="jumlahAlat"
                  class="form-control-jumlah"
                  v-model="newPengembalianAlatBermasalah.jumlah"
                  disabled
                />
              </div>
              <!-- end of jumlah -->
            </div>
            <!-- garis pemisah -->
            <hr style="color: white" />
            <!-- form row -->
            <div class="form-row">
              <!-- tgl pinjam -->
              <div class="form-group">
                <label for="tanggalPengembalian">Tanggal Pengembalian</label>
                <p>Masukkan tanggal pengembalian alat</p>
                <div class="date-input-wrapper">
                  <input
                    type="date"
                    id="tanggalKembali"
                    v-model="newPengembalianAlatBermasalah.tgl_kembali"
                    class="date-filter-modal"
                  />
                  <i class="fas fa-calendar-alt calendar-icon-i"></i>
                </div>
              </div>
              <!-- tgl pinjam -->
              <!-- jml alat rusak -->
              <div class="form-group-jumlah-kembali">
                <label for="jumlahPengembalian">Jumlah Pengembalian</label>
                <p>Masukkan jumlah pengembalian alat</p>
                <input
                  type="number"
                  style="margin-top: 0.5rem; height: 2.5rem; width: 6.3rem"
                  id="jumlahPengembalian"
                  class="form-control"
                  v-model="newPengembalianAlatBermasalah.jumlah_dikembalikan"
                />
              </div>
              <!-- jml alat rusak -->
            </div>
            <!-- form row -->
            <button
              @click="addPengembalianAlatBermasalah(id_alat_bermasalah)"
              class="btn_add_peminjaman"
            >
              Simpan Data
            </button>
          </div>
        </div>
      </div>
      <!-- End of Modal Section -->
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
import Swal from "sweetalert2";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import axios from "axios";
import { Tooltip } from "bootstrap";

export default {
  name: "DataPinjamanBermasalah",
  data() {
    return {
      alatBermasalah: [],
      displayedData: [],
      rowsPerPage: 5,
      currentPage: 1,
      startDate: "",
      endDate: "",
      sortBy: "tgl_permasalahan",
      sortDirection: "asc",
      searchQuery: "",
      editIndex: null,
      isClosing: false,
      showModal: false,
      dropdownIndex: null,
      newPengembalianAlatBermasalah: {
        alat_dipinjam: "",
        nama_peminjam: "",
        tgl_peminjaman: "",
        jumlah: "",
        id_peminjaman: "",
        tgl_kembali: "",
        jumlah_dikembalikan: "",
      },
    };
  },
  mounted() {
    this.fetchData();
    const tooltipElements = document.querySelectorAll(
      '[data-toggle="tooltip"]'
    );
    tooltipElements.forEach((tooltipEl) => {
      new Tooltip(tooltipEl);
    });
  },
  methods: {
    // Method untuk mempersiapkan data saat tombol pada record ditekan
    preparPostAlatBermasalah(record) {
      //console.log(record);
      this.newPengembalianAlatBermasalah = {
        alat_dipinjam: record.nama_alat,
        nama_peminjam: record.nama_siswa,
        tgl_peminjaman: this.convertToDateInputFormat(record.tanggal_pinjam),
        jumlah: record.jumlah,
        id_peminjaman: record.id_peminjaman,
      };
      this.showModal = true;
      this.id_alat_bermasalah = record.id_alat_bermasalah;
    },

    // Method untuk mengonversi format tanggal ke format input date (YYYY-MM-DD)
    convertToDateInputFormat(dateString) {
      if (!dateString) return ""; // Jika tanggal kosong, kembalikan string kosong

      const date = new Date(dateString); // Buat objek Date dari string
      if (isNaN(date)) return ""; // Validasi: jika tanggal tidak valid, kembalikan string kosong

      const year = date.getFullYear(); // Ambil tahun
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Ambil bulan, tambahkan leading zero jika perlu
      const day = String(date.getDate()).padStart(2, "0"); // Ambil hari, tambahkan leading zero jika perlu

      return `${year}-${month}-${day}`; // Gabungkan menjadi format YYYY-MM-DD
    },
    async addPengembalianAlatBermasalah(id_alat_bermasalah) {
      // console.log(
      //   "ID Alat Bermasalah di addPengembalianAlatBermasalah:",
      //   id_alat_bermasalah
      // );
      //console.log(JSON.stringify(this.newPengembalianAlatBermasalah));
      if (
        this.newPengembalianAlatBermasalah.id_peminjaman &&
        this.newPengembalianAlatBermasalah.tgl_kembali &&
        this.newPengembalianAlatBermasalah.jumlah_dikembalikan
      ) {
        try {
          const dataToSend = {
            id_peminjaman: this.newPengembalianAlatBermasalah.id_peminjaman,
            tgl_kembali: this.newPengembalianAlatBermasalah.tgl_kembali,
            jumlah: this.newPengembalianAlatBermasalah.jumlah_dikembalikan,
          };

          const token = localStorage.getItem("accessToken");
          const response = await axios.post(
            `http://localhost:3000/pengembalian-alat-bermasalah/${id_alat_bermasalah}`,
            dataToSend,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (
            (response.status === 200 || response.status === 201) &&
            response.data.status === "success"
          ) {
            await this.fetchData();

            this.resetForm();
            this.closeModal();

            Swal.fire({
              title: "Sukses!",
              text: "Data pengembalian berhasil disimpan.",
              icon: "success",
              confirmButtonText: "OK",
            });
          } else {
            throw new Error("Terjadi kesalahan saat menyimpan data.");
          }
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: `Gagal menyimpan data: ${error.message}`,
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      } else {
        Swal.fire({
          title: "Error!",
          text: "Mohon isi semua data!",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    },
    toggleDropdown(index) {
      this.dropdownIndex = this.dropdownIndex === index ? null : index;
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    },
    async fetchData() {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          console.error("Access token not found.");
          return;
        }
        const response = await axios.get(
          "http://localhost:3000/alat-bermasalah",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        this.alatBermasalah = response.data.data.alatBermasalah;
        this.updateDisplayedData();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    updateDisplayedData() {
      const startIndex = (this.currentPage - 1) * this.rowsPerPage;
      const endIndex = startIndex + this.rowsPerPage;
      this.displayedData = this.filteredAlat.slice(startIndex, endIndex);
    },
    toggleSort(column) {
      if (this.sortBy === column) {
        this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
      } else {
        this.sortBy = column;
        this.sortDirection = "asc";
      }
    },
    resetFilters() {
      this.startDate = "";
      this.endDate = "";
      this.searchQuery = "";
      //this.updateDisplayedData();
    },
    exportData(type) {
      const exportData = this.displayedData.map((record) => ({
        ...record,
        tanggal_pinjam: this.formatDate(record.tanggal_pinjam),
        tgl_permasalahan: this.formatDate(record.tgl_permasalahan),
      }));

      if (type === "csv") {
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "DataPinjamanBermasalah");
        XLSX.writeFile(wb, "DataPinjamanBermasalah.csv");
      } else if (type === "pdf") {
        const doc = new jsPDF();
        doc.autoTable({
          head: [
            [
              "Nama Peminjam",
              "Alat",
              "Bengkel",
              "Jumlah",
              "Tgl Pinjam",
              "Tgl Permasalahan",
              "Kondisi",
            ],
          ],
          body: exportData.map((row) => [
            row.nama_siswa,
            row.nama_alat,
            row.ruang_bengkel,
            row.jumlah,
            row.tanggal_pinjam,
            row.tgl_permasalahan,
            row.kondisi,
          ]),
        });
        doc.save("DataPinjamanBermasalah.pdf");
      }
    },
    editPengembalian(index) {
      this.newPeminjaman = {
        ...this.displayedData[index],
      };
      this.editIndex = index;
      this.showModal = true;
    },
    openPengembalianModal(peminjaman) {
      this.newPeminjaman = {
        ...peminjaman,
      };
      this.showModal = true; // Sesuaikan dengan properti yang digunakan
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
      this.editIndex = null;
    },
  },
  computed: {
    pageInfo() {
      const totalData = this.filteredAlat.length;
      const startIndex = (this.currentPage - 1) * this.rowsPerPage + 1;
      const endIndex = Math.min(startIndex + this.rowsPerPage - 1, totalData);
      return `Menampilkan ${startIndex} sampai ${endIndex} dari ${totalData} data`;
    },
    filteredAlat() {
      let filtered = this.alatBermasalah;

      // Filter berdasarkan query pencarian
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter((record) =>
          record.nama_siswa.toLowerCase().includes(query)
        );
      }

      // Filter berdasarkan tanggal
      if (this.startDate) {
        const start = new Date(this.startDate).getTime();
        filtered = filtered.filter((record) => {
          const recordDate = new Date(record.tgl_permasalahan).getTime();
          return recordDate >= start;
        });
      }

      if (this.endDate) {
        const end = new Date(this.endDate).getTime();
        filtered = filtered.filter((record) => {
          const recordDate = new Date(record.tgl_permasalahan).getTime();
          return recordDate <= end;
        });
      }

      // Sortir data
      filtered.sort((a, b) => {
        const valA = a[this.sortBy]?.toString().toLowerCase() || "";
        const valB = b[this.sortBy]?.toString().toLowerCase() || "";
        if (this.sortDirection === "asc") {
          return valA.localeCompare(valB);
        } else {
          return valB.localeCompare(valA);
        }
      });

      return filtered;
    },
    totalPages() {
      return Math.ceil(this.filteredAlat.length / this.rowsPerPage);
    },
  },
  watch: {
    startDate: "updateDisplayedData",
    endDate: "updateDisplayedData",
    searchQuery: "updateDisplayedData",
    rowsPerPage: "updateDisplayedData",
    currentPage: "updateDisplayedData",
    sortBy: "updateDisplayedData",
    sortDirection: "updateDisplayedData",
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

.header-dataBermasalah {
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
  font-variation-settings: "FILL" 0, "wght" 100, "GRAD" 0, "opsz" 24;
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
  color: #333;
}

.filters input[type="date"] {
  background-color: #f9f9f9;
  color: #7b8291;
}

.filters2 input[type="text"] {
  background-color: #fff;
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
  gap: 15px;
}

.info-page {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.select-rows {
  padding: 0.25rem;
  font-size: 1rem;
  line-height: 1.5;
}

.page-info {
  font-size: 0.9rem;
  line-height: 1.5;
  color: #555;
  margin: 0;
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

.date-filter-modal {
  padding: 0.5rem 0.9rem;
  width: 16rem;
  border: 1px solid #d3d2d2 !important;
  border-radius: 5px;
  background-color: white;
  color: #7b8291;
}

.calendar-icon {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  color: #7b8291;
  pointer-events: none;
}

.modal-content {
  background: #274278 !important;
  padding: 20px;
  border-radius: 10px;
  width: 40rem !important;
  max-width: 100% !important;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.3s ease-in-out;
  transition: fadeOut 0.3s ease-out;
}

.form-group-jumlah-kembali {
  flex: 1;
  margin-left: -4rem;
}

.form-group-jumlah-kembali label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

@media screen and (max-width: 450px) {
  .modal-content {
    width: 90% !important;
  }
  .header-dataBermasalah {
    font-weight: bold;
    color: #274278;
    font-size: 1.7rem;
    margin: 0;
  }

  .filter-wrapper,
  .date-inputs,
  .date-input-wrapper,
  .date-input-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
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
    top: 70%;
    transform: translateY(-50%);
    font-size: 1.2rem;
    pointer-events: none;
  }

  .calendar-icon-i {
    position: absolute;
    right: 3rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1.2rem;
    color: #7b8291;
    pointer-events: none;
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

  .date-input-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
  }

  .calendar-icon {
    position: absolute;
    right: 1rem;
    top: 70%;
    transform: translateY(-50%);
    font-size: 1.2rem;
    pointer-events: none;
  }

  .calendar-icon-i {
    position: absolute;
    right: 3rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1.2rem;
    color: #7b8291;
    pointer-events: none;
  }

  .form-group-jumlah-kembali {
    flex: 1;
    margin-left: 0rem;
    margin-top: 0.5rem;
  }
}
</style>
