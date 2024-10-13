<template>
  <div class="header-peminjaman-container">
    <h3 class="header-peminjaman">Halaman Peminjaman</h3>
    <button @click="showModal = true" class="btn-add" style="background-color: #007bff;">
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
              style="width: 15.625rem"
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
              style="width: 100px; margin-top: 1.55rem"
              id="jumlahAlat"
              class="form-control"
              v-model="newPeminjaman.jumlahAlat"
            />
          </div>
          <!-- jumlah -->
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

  <!-- Table wrapper -->
  <div class="table-wrapper">
    <div style="text-align: left;">
          Tampilkan:
          <select v-model="rowsPerPage" class="select-rows" style="width: 3rem">
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="100">100</option>
          </select>
          baris
    </div>
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
                  @click="openPengembalianModal(peminjaman)"
                  class="dropdown-item"
                  style="color: #274278"
                  >Pengembalian</button
                >
                <button
                  class="dropdown-item"
                  @click="confirmDelete(index)"
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
</template>

<script>
import jsPDF from "jspdf";
import "jspdf-autotable";
import Papa from "papaparse";
import Swal from 'sweetalert2';

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
      // Check if all required fields are filled
      if (
        this.newPeminjaman.namaPeminjam &&
        this.newPeminjaman.alat &&
        this.newPeminjaman.bengkel &&
        this.newPeminjaman.tanggalPinjam &&
        this.newPeminjaman.jumlahAlat
      ) {
        // If editIndex is not null, update the entry, otherwise add a new one
        if (this.editIndex !== null) {
          this.peminjamanList.splice(this.editIndex, 1, {
            ...this.newPeminjaman,
          });
          this.editIndex = null;
        } else {
          this.peminjamanList.push({ ...this.newPeminjaman });
        }

        // Indicate success and show success alert
        const success = true; // Set this dynamically if needed

        if (success) {
          // Close the modal and reset the form
          this.closeModal();
          this.resetForm();
          Swal.fire({
              title: "Sukses!",
              text: "Data peminjaman berhasil disimpan.",
              icon: "success",
              confirmButtonText: "OK"
            });
        } else {
          console.error("Gagal menambahkan peminjaman:", data);
            Swal.fire({
              title: "Error!",
              text: "Gagal menambahkan peminjaman.",
              icon: "error",
              confirmButtonText: "OK"
            });
        }
      } else {
        // Show an alert if not all fields are filled
        Swal.fire({
              title: "Peringatan!",
              text: "Mohon isi semua data.",
              icon: "warning",
              confirmButtonText: "OK"
        });
      }
    },
    savePeminjaman() {
      if (
        this.newPeminjaman.namaPeminjam &&
        this.newPeminjaman.alat &&
        this.newPeminjaman.bengkel &&
        this.newPeminjaman.tanggalPinjam &&
        this.newPeminjaman.jumlahAlat
      ) {
        // Push data peminjaman ke array
        this.peminjamanList.push({ ...this.newPeminjaman });
        // Bersihkan form setelah simpan
        this.resetForm();
        // Navigasi ke halaman data peminjaman setelah simpan
        this.$router.push({
          name: "datapinjaman",
          params: { peminjamanList: this.peminjamanList }
        });
      } else {
        Swal.fire({
              title: "Error!",
              text: "Mohon isi semua data!",
              icon: "error",
              confirmButtonText: "OK"
        });
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
    confirmDelete(index) {
      Swal.fire({
        title: 'Anda yakin?',
        text: "Data peminjaman ini akan dihapus!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, hapus!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.deletePeminjaman(index);  // Panggil fungsi hapus data
          Swal.fire(
            'Dihapus!',
            'Data peminjaman telah dihapus.',
            'success'
          );
        }
      });
    },
    deletePeminjaman(index) {
      this.peminjamanList.splice(index, 1);
      this.dropdownIndex = null; // Reset dropdown setelah penghapusan
    },
    openPengembalianModal(peminjaman) {
    this.newPeminjaman = { ...peminjaman }; // Salin data peminjaman ke newPeminjaman
    this.tampilModal = true; // Tampilkan modal
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

.select-condi {
  width: 6.3rem;
  padding: 0.4rem;
  margin-top: 1.2rem;
  height: 2.5rem;
  background-color: white;
  border-radius: 5px;
  color: #000000;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
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

.header-peminjaman-container {
  display: flex;
  justify-content: space-between; 
  align-items: center; 
  margin-top: 3rem;
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

.form-control {
  width: 100%;
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
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

.search-bar-container {
  position: relative;
  display: inline-block;
  margin-left: 1.5rem;
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

.nav-text span {
  font-size: 16px;
  font-weight: bold;
  color: white;
}

.nav-text span.active {
  text-decoration: underline;
  color: #f30202; /* Highlight the active option */
}

.header {
  text-align: left;
}

.header-peminjaman {
  font-weight: bold;
  font-size: 1.7rem;
  color: #274278;
  margin-top: -5rem;
  margin-bottom: 1.5rem;
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

.dropdown-menu-export.show {
  display: block;
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

.nav-text {
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between; /* Space between the two texts */
  align-items: center; /* Vertically centers the text */
  padding: 0 1rem; /* Optional: adds padding inside */
  text-align: center; /* Center the text inside their flex containers */
}

.nav-text span {
  flex: 1; /* Make the text span evenly across */
  text-align: center; /* Center the text within the span */
  cursor: pointer; /* Indicates the text is clickable */
  color: rgb(199, 199, 199); /* Default color for inactive text */
  font-weight: 400;
}

.nav-text span:first-child {
  text-align: center; /* Align "Baik" to the left */
  margin-left: -1rem;
}

.nav-text span:last-child {
  text-align: center; /* Align "Buruk" to the right */
  margin-left: -2rem;
}

/* Optional: Add active styling */
.nav-text span.active {
  font-weight: bold;
  color: rgb(255, 255, 255); /* Example: Change active color */
  border-bottom: 2px solid rgb(255, 255, 255); /* Example: Active underline */
}
</style>
