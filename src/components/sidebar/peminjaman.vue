<template>
  <div style="text-align: left">
    <h3 class="header-peminjaman">Halaman Peminjaman</h3>
    <button @click="showModal = true" class="btn_add_siswa">
      <i class="fas fa-plus"></i> Input Peminjaman
    </button>
  </div>

  <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-header">
        <h4>Input Data Peminjaman</h4>
        <span class="close-modal" @click="closeModal">&times;</span>
      </div>
      <div class="modal-body">
        <div class="form-row">
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
        </div>
        <div class="form-row">
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
          <div class="form-group" style="margin-left: -2.3rem">
            <label for="tanggalPinjam">Tanggal Pinjam</label>
            <p>Masukkan tanggal pinjam alat</p>
            <input
              type="date"
              style="width: 16rem"
              id="tanggalPinjam"
              class="form-control"
              v-model="newPeminjaman.tanggalPinjam"
            />
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button @click="addPeminjaman" class="btn_add_peminjaman">
          <i class="fas fa-save"></i> Simpan Data
        </button>
      </div>
    </div>
  </div>
  <hr />
  <div style="margin-top: 20px">
    <div class="search-bar">
      <div>
        Tampilkan:
        <select v-model="rowsPerPage" class="select-rows" style="width: 3rem">
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="20">100</option>
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

    <!-- table section -->
    <table class="data-table">
      <thead>
        <tr>
          <th>No</th>
          <th>Nama Peminjam</th>
          <th>Alat</th>
          <th>Bengkel</th>
          <th>Jumlah</th>
          <th>Tanggal Pinjam</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(peminjaman, index) in paginatedPeminjamanList" :key="index">
          <td>{{ index + 1 + (currentPage - 1) * rowsPerPage }}</td>
          <td>{{ peminjaman.namaPeminjam }}</td>
          <td>{{ peminjaman.alat }}</td>
          <td>{{ peminjaman.bengkel }}</td>
          <td>{{ peminjaman.jumlahAlat }}</td>
          <td>{{ peminjaman.tanggalPinjam }}</td>
          <td>
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
                <a
                  class="dropdown-item"
                  @click="editPeminjaman(index)"
                  style="color: #274278"
                  ><i class="fas fa-edit"></i> Edit</a
                >
                <router-link
                  to="/mainsidebar/pengembalian"
                  class="dropdown-item"
                  style="color: #274278"
                  ><i class="fas fa-thumbs-up"></i> Dikembalikan</router-link
                >
                <a
                  class="dropdown-item"
                  @click="deletePeminjaman(index)"
                  style="color: red"
                  ><i class="fas fa-trash-alt"></i> Hapus</a
                >
              </div>
            </div>
          </td>
        </tr>
        <tr v-if="paginatedPeminjamanList.length === 0">
          <td colspan="7" style="text-align: center">Tidak ada data</td>
        </tr>
      </tbody>
    </table>
    <!--- end of the table -->

    <div v-if="totalPages > 1" style="margin-top: 10px; text-align: center">
      <button @click="currentPage--" :disabled="currentPage === 1">
        Previous
      </button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="currentPage++" :disabled="currentPage === totalPages">
        Next
      </button>
    </div>
  </div>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showModal: false,
      isClosing: false,
      newPeminjaman: {
        namaPeminjam: "",
        alat: "",
        bengkel: "",
        tanggalPinjam: "",
        jumlahAlat: "",
      },
      peminjamanList: [],
      rowsPerPage: 5,
      currentPage: 1,
      searchQuery: "",
      editIndex: null,
      dropdownIndex: null,
    };
  },
  computed: {
    filteredPeminjamanList() {
      return this.peminjamanList.filter(
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
  color: white;
  text-align: left;
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
  margin-bottom: 10px;
}

.search-input,
.select-rows {
  width: 250px;
  padding: 5px;
  border: 1px solid #ccc;
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
  text-align: left;
}

.data-table th {
  background-color: #f2f2f2;
}

.data-table tbody tr:nth-child(odd) {
  background-color: #f9f9f9;
}

.data-table tbody tr:hover {
  background-color: #f1f1f1;
}

/* Dropdown Styling */
.dropdown-menu-act {
  display: none;
  position: absolute;
  top: 100%;
  right: 0;
  left: auto;
  background-color: #fff;
  width: 150px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
  border-radius: 5px;
  padding: 10px;
  max-height: 300px;
  overflow-y: auto;
  margin-top: 5px;
  transform: translateX(-50%);
  left: 170%;
}

.dropdown-menu-act.show {
  display: block;
}

.dropdown-menu-act button:hover {
  background-color: #f1f1f1;
}

.pagination-controls {
  margin-top: 10px;
  text-align: center;
}

.pagination-controls button {
  margin: 0 5px;
}
</style>
