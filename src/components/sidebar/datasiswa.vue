<template>
  <div style="text-align: left">
    <h3 class="header-siswa">Halaman Data Siswa</h3>
    <button @click="showModal = true" class="btn_add_siswa">
      <i class="fas fa-plus"></i> Inputkan Data Siswa
    </button>
  </div>

  <!-- Modal -->
  <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-header">
        <h4>Input Data Siswa</h4>
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

      <div style="margin-top: 20px; text-align: left">
        <button @click="addSiswa" class="btn_add_siswa">
          <i class="fas fa-save"></i> Simpan Data
        </button>
      </div>
    </div>
  </div>

  <!-- Tabel Siswa -->
  <div style="margin-top: 30px">
    <div class="search-bar">
      <div>
        Tampilkan
        <select v-model="rowsPerPage" class="select-rows">
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
        baris
      </div>
      <div>
        Pencarian:
        <input
          type="text"
          v-model="searchQuery"
          class="search-input"
          placeholder="Cari..."
        />
      </div>
    </div>
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
        <tr v-for="(siswa, index) in paginatedSiswaList" :key="index">
          <td>{{ index + 1 + (currentPage - 1) * rowsPerPage }}</td>
          <td>{{ siswa.nomorInduk }}</td>
          <td>{{ siswa.nama }}</td>
          <td>{{ siswa.jenisKelamin }}</td>
          <td>{{ siswa.jurusan }}</td>
          <td>
            <i class="fas fa-edit" @click="editSiswa(index)"></i>
            <i
              class="fas fa-trash-alt"
              @click="deleteSiswa(index)"
              style="color: red; margin-left: 10px; cursor: pointer"
            ></i>
          </td>
        </tr>
        <tr v-if="paginatedSiswaList.length === 0">
          <td colspan="6" style="text-align: center">Tidak ada data</td>
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
      siswaList: [],
      rowsPerPage: 5,
      currentPage: 1,
      searchQuery: "",
      editIndex: null,
    };
  },
  computed: {
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
    paginatedSiswaList() {
      const start = (this.currentPage - 1) * this.rowsPerPage;
      const end = start + this.rowsPerPage;
      return this.filteredSiswaList.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredSiswaList.length / this.rowsPerPage);
    },
  },
  methods: {
    addSiswa() {
      if (
        this.newSiswa.nomorInduk &&
        this.newSiswa.nama &&
        this.newSiswa.jenisKelamin &&
        this.newSiswa.jurusan
      ) {
        if (this.editIndex !== null) {
          this.siswaList.splice(this.editIndex, 1, { ...this.newSiswa });
          this.editIndex = null;
        } else {
          this.siswaList.push({ ...this.newSiswa });
        }
        this.closeModal();
        this.resetForm();
      } else {
        alert("Mohon isi semua data");
      }
    },
    editSiswa(index) {
      this.newSiswa = { ...this.siswaList[index] };
      this.editIndex = index;
      this.showModal = true;
    },
    deleteSiswa(index) {
      this.siswaList.splice(index, 1);
    },
    closeModal() {
      this.showModal = false;
      this.resetForm();
    },
    resetForm() {
      this.newSiswa = {
        nomorInduk: "",
        nama: "",
        jenisKelamin: "",
        jurusan: "",
      };
      this.editIndex = null;
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

.data-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

.data-table th {
  background-color: #4b6cb7;
  color: rgb(69, 67, 67);
}

.data-table tr:nth-child(even) {
  background-color: #f2f2f2;
}

.data-table tr:hover {
  background-color: #ddd;
}

.pagination-container {
  margin-top: 20px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px; /* Add space between the buttons and text */
}

.pagination-button {
  background-color: #007bff; /* Button background color */
  color: white; /* Button text color */
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.pagination-button:hover {
  background-color: #0056b3; /* Button color on hover */
}

.pagination-button:disabled {
  background-color: #ccc; /* Disabled button color */
  cursor: not-allowed;
}

.pagination-info {
  font-weight: bold;
  color: #333;
  font-size: 14px;
}

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
