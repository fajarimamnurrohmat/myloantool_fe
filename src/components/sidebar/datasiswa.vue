<template>
  <div>
    <!-- Header dan Tombol Tambah Siswa -->
    <div style="text-align: left">
      <h3 class="header-siswa">Halaman Data Siswa</h3>
      <button @click="showModal = true" class="btn_add_siswa">
        <i class="fas fa-plus"></i> Inputkan Data
      </button>
    </div>

    <!-- Modal Input/Edit Siswa -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h4>{{ editIndex !== null ? 'Edit Data Siswa' : 'Input Data Siswa' }}</h4>
          <span
            class="close-modal"
            @click="closeModal"
            style="color: red; text-align: right"
            >&times;</span
          >
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="nomorInduk">Nomor Induk</label>
            <p>Masukkan nomor induk</p>
            <input
              type="text"
              id="nomorInduk"
              class="form-control"
              v-model="newSiswa.nomorInduk"
            />
          </div>
          <div class="form-group">
            <label for="namaSiswa">Nama Siswa</label>
            <p>Masukkan nama siswa</p>
            <input
              type="text"
              id="namaSiswa"
              class="form-control"
              v-model="newSiswa.nama"
            />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="jenisKelamin">Jenis Kelamin</label>
            <p>Pilih jenis kelamin</p>
            <select
              id="jenisKelamin"
              class="form-control"
              v-model="newSiswa.jenisKelamin"
            >
              <option value="">Pilih jenis kelamin</option>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>
          <div class="form-group">
            <label for="jurusan">Jurusan</label>
            <p>Masukkan Jurusan</p>
            <input
              type="text"
              id="jurusan"
              class="form-control"
              v-model="newSiswa.jurusan"
            />
          </div>
        </div>

        <div style="margin-top: 10px; text-align: left">
          <button @click="addOrUpdateSiswa" class="btn_add_siswa">
            {{ editIndex !== null ? 'Update Data' : 'Simpan Data' }}
          </button>
        </div>
      </div>
    </div>

    <hr />

    <!-- Section Filter dan Pencarian -->
    <div class="filter-section">
      <div class="date-inputs">
        <div>
          <div class="tampil-baris" style="text-align: left;">
            Tampilkan:
            <select v-model="rowsPerPage" class="select-rows" style="width: 3rem">
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="100">100</option>
            </select>
            baris
          </div>
        </div>
        <!-- Tombol Reset Filter -->
        <div class="filter-buttons">
          <button @click="resetFilter" class="btn-reset" style="margin-right: -2rem;">
            <i class="fa fa-sync" aria-hidden="true"></i>
          </button>
        </div>
        <!-- Pencarian -->
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
      </div>
    </div>
    <!-- End Section Filter dan Pencarian -->

    <!-- Tabel Siswa -->
    <div style="margin-top: 30px">
      <table class="data-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Nomor Induk</th>
            <th>Nama Siswa</th>
            <th>Jenis Kelamin</th>
            <th>Jurusan</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(siswa, index) in paginatedSiswaList" :key="siswa.nomorInduk">
            <td>{{ index + 1 + (currentPage - 1) * rowsPerPage }}</td>
            <td>{{ siswa.nomorInduk }}</td>
            <td>{{ siswa.nama }}</td>
            <td>{{ siswa.jenisKelamin }}</td>
            <td>{{ siswa.jurusan }}</td>
            <td>
              <!-- Dropdown Action -->
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
                    @click="editSiswa(index)"
                    style="color: #274278"
                  >Edit</button>
                  <button
                    class="dropdown-item"
                    @click="deleteSiswa(index)"
                    style="color: red"
                  >Hapus</button>
                </div>
              </div>
              <!-- End Dropdown Action -->
            </td>
          </tr>
          <tr v-if="paginatedSiswaList.length === 0">
            <td colspan="6" style="text-align: center">Tidak ada data</td>
          </tr>
        </tbody>
      </table>
      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pagination-container">
        <button
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="pagination-button"
        >
          Previous
        </button>
        <span class="pagination-info">
          Page {{ currentPage }} of {{ totalPages }}
        </span>
        <button
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="pagination-button"
        >
          Next
        </button>
      </div>
      <!-- End Pagination -->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showModal: false,
      newSiswa: {
        nomorInduk: "",
        nama: "",
        jenisKelamin: "",
        jurusan: "",
      },
      siswaList: [], // Daftar siswa yang diambil dari API
      rowsPerPage: 5,
      currentPage: 1,
      searchQuery: "",
      editIndex: null, // Indeks siswa yang sedang diedit
      dropdownIndex: null, // Indeks dropdown yang terbuka
    };
  },
  computed: {
    // Filter siswa berdasarkan query pencarian
    filteredSiswaList() {
      return this.siswaList.filter(
        (siswa) =>
          siswa.nomorInduk
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase()) ||
          siswa.nama.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          siswa.jenisKelamin
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase()) ||
          siswa.jurusan.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    // Paginate daftar siswa
    paginatedSiswaList() {
      const start = (this.currentPage - 1) * this.rowsPerPage;
      const end = start + this.rowsPerPage;
      return this.filteredSiswaList.slice(start, end);
    },
    // Total halaman berdasarkan jumlah siswa
    totalPages() {
      return Math.ceil(this.filteredSiswaList.length / this.rowsPerPage);
    },
  },
  methods: {
    // Mengambil data siswa dari API
    async fetchSiswaData() {
      try {
        const response = await fetch('http://localhost:3000/siswa');
        const data = await response.json();
        if (data.status === "success") {
          this.siswaList = data.data.siswa.map((item) => ({
            nomorInduk: item.nis,
            nama: item.nama_siswa,
            jenisKelamin: item.jenis_kelamin,
            jurusan: item.jurusan,
          }));
        } else {
          console.error("Gagal mengambil data:", data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    // Menambahkan atau memperbarui siswa
    async addOrUpdateSiswa() {
      if (
        this.newSiswa.nomorInduk &&
        this.newSiswa.nama &&
        this.newSiswa.jenisKelamin &&
        this.newSiswa.jurusan
      ) {
        if (this.editIndex !== null) {
          // Update siswa melalui API (jika API mendukung)
          try {
            const response = await fetch(`http://localhost:3000/siswa/${this.newSiswa.nomorInduk}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                nis: this.newSiswa.nomorInduk,
                nama_siswa: this.newSiswa.nama,
                jenis_kelamin: this.newSiswa.jenisKelamin,
                jurusan: this.newSiswa.jurusan,
              }),
            });
            const data = await response.json();
            if (data.status === "success") {
              // Perbarui daftar siswa di frontend
              this.siswaList.splice(this.editIndex, 1, { ...this.newSiswa });
              this.closeModal();
              this.resetForm();
            } else {
              alert("Gagal memperbarui data siswa.");
            }
          } catch (error) {
            console.error("Error updating siswa:", error);
          }
        } else {
          // Tambah siswa melalui API (jika API mendukung)
          try {
            const response = await fetch('http://localhost:3000/siswa', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                nis: this.newSiswa.nomorInduk,
                nama_siswa: this.newSiswa.nama,
                jenis_kelamin: this.newSiswa.jenisKelamin,
                jurusan: this.newSiswa.jurusan,
              }),
            });
            const data = await response.json();
            if (data.status === "success") {
              // Tambahkan siswa ke daftar di frontend
              this.siswaList.push({ ...this.newSiswa });
              this.closeModal();
              this.resetForm();
            } else {
              alert("Gagal menambahkan data siswa.");
            }
          } catch (error) {
            console.error("Error adding siswa:", error);
          }
        }
      } else {
        alert("Mohon isi semua data");
      }
    },
    // Mengedit siswa
    editSiswa(index) {
      this.newSiswa = { ...this.siswaList[index] };
      this.editIndex = index;
      this.showModal = true;
    },
    // Menghapus siswa
    async deleteSiswa(index) {
      const siswa = this.siswaList[index];
      if (confirm(`Apakah Anda yakin ingin menghapus siswa dengan NIS ${siswa.nomorInduk}?`)) {
        try {
          const response = await fetch(`http://localhost:3000/siswa/${siswa.nomorInduk}`, {
            method: 'DELETE',
          });
          const data = await response.json();
          if (data.status === "success") {
            this.siswaList.splice(index, 1);
          } else {
            alert("Gagal menghapus data siswa.");
          }
        } catch (error) {
          console.error("Error deleting siswa:", error);
        }
      }
    },
    // Menutup modal
    closeModal() {
      this.showModal = false;
      this.resetForm();
    },
    // Reset form input
    resetForm() {
      this.newSiswa = {
        nomorInduk: "",
        nama: "",
        jenisKelamin: "",
        jurusan: "",
      };
      this.editIndex = null;
    },
    // Toggle dropdown action
    toggleDropdown(index) {
      this.dropdownIndex = this.dropdownIndex === index ? null : index;
    },
    // Reset filter pencarian dan pagination
    resetFilter() {
      this.searchQuery = "";
      this.rowsPerPage = 5;
      this.currentPage = 1;
    },
    // Mengubah halaman pada pagination
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.dropdownIndex = null;
      }
    },
  },
  watch: {
    // Reset halaman ke 1 ketika jumlah baris per halaman berubah
    rowsPerPage() {
      this.currentPage = 1;
    },
  },
  created() {
    this.fetchSiswaData(); // Mengambil data siswa saat komponen dibuat
  },
};
</script>

<style>
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

.filters2 {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.search-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
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

.search-bar-container {
  position: relative;
  display: inline-block;
  margin-left: 1.5rem;
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
.header-siswa {
  font-weight: bold;
  color: #274278;
  font-size: 1.7rem;
  margin-bottom: 10px;
  margin-top: 20px;
  animation: fadeInDown 1s ease-in-out;
}

.btn_add_siswa {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 16px;
}

.btn_add_siswa:hover {
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
  width: 48%;
}

.form-control {
  width: 100%;
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.search-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.select-rows {
  padding: 5px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.search-input {
  padding: 5px;
  width: 200px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}

.data-table th,
.data-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

.data-table th {
  background-color: #f2f2f2;
}

.data-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.data-table tr:hover {
  background-color: #ddd;
}

.dropdown-menu-act {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 100px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
}

.dropdown-menu-act.show {
  display: block;
}

.dropdown-item {
  padding: 8px 12px;
  cursor: pointer;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
}

.dropdown-item:hover {
  background-color: #f1f1f1;
}

.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 12px;
  margin: 0 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.pagination-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.pagination-button:hover:not(:disabled) {
  background-color: #0056b3;
}

.pagination-info {
  font-size: 16px;
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
</style>
