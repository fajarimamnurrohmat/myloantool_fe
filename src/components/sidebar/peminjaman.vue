<template>
  <div style="text-align: left">
    <h3 class="header-peminjaman">Halaman Peminjaman</h3>
  </div>
  <div class="bordered-form">
    <div class="form-row">
      <div class="form-group">
        <label for="namaPeminjam">Nama Peminjam</label>
        <p>Nama lengkap peminjam</p>
        <input
          type="text"
          id="namaPeminjam"
          class="form-control"
          placeholder="Masukkan nama peminjam"
          v-model="newPeminjaman.namaPeminjam"
        />
      </div>
      <div class="form-group">
        <label for="alat">Alat</label>
        <p>Nama dan bengkel alat</p>
        <input
          type="text"
          id="alat"
          class="form-control"
          placeholder="Masukkan nama alat"
          v-model="newPeminjaman.alat"
        />
      </div>
      <div class="form-group">
        <label for="tanggalPinjam">Tanggal Pinjam</label>
        <p>Tanggal pinjam alat</p>
        <input
          type="date"
          id="tanggalPinjam"
          class="form-control"
          v-model="newPeminjaman.tanggalPinjam"
        />
      </div>
    </div>
    <div class="form-row" style="margin-top: 20px;">
      <div class="form-group">
        <label for="jumlahAlat">Jumlah Alat</label>
        <input
          style="width: 250px;"
          type="number"
          id="jumlahAlat"
          class="form-control"
          placeholder="Masukkan jumlah alat"
          v-model="newPeminjaman.jumlahAlat"
        />
      </div>
    </div>
    <div style="margin-top: 20px; text-align: left;">
      <button
        style="border-radius: 10px;"
        class="btn_add_peminjaman"
        id="btn_add_peminjaman"
        @click="addPeminjaman"
      >
        Input Data
      </button>
    </div>
  </div>

  <hr>

  <div style="margin-top: 20px">
    <div class="search-bar">
      <div>
        Tampilkan:
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
            <div class="action-buttons">
              <button class="btn-action" @click="editPeminjaman(index)">
                <i class="fas fa-edit"></i> Edit
              </button>
              <button
                class="btn-action btn-delete"
                @click="deletePeminjaman(index)"
              >
                <i class="fas fa-trash-alt"></i> Hapus
              </button>
              <div class="dropdown">
                <button
                  class="btn-action dropdown-toggle"
                  @click="toggleDropdown(index)"
                >
                  <i class="fas fa-ellipsis-v"></i> Action
                </button>
                <div v-if="dropdownIndex === index" class="dropdown-content">
                  <router-link to="/mainsidebar/pengembalian">Dikembalikan</router-link>
                  <router-link to="/perpanjangan">Perpanjangan</router-link>
                </div>
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
      newPeminjaman: {
        namaPeminjam: "",
        alat: "",
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
        this.newPeminjaman.namaPeminjam = "";
        this.newPeminjaman.alat = "";
        this.newPeminjaman.tanggalPinjam = "";
        this.newPeminjaman.jumlahAlat = "";
      } else {
        alert("Mohon isi semua data");
      }
    },
    editPeminjaman(index) {
      this.newPeminjaman = { ...this.peminjamanList[index] };
      this.editIndex = index;
    },
    deletePeminjaman(index) {
      this.peminjamanList.splice(index, 1);
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
.header-peminjaman {
  font-weight: bold;
  font-size: 1.7rem;
  color: #274278;
  margin-bottom: 10px;
  margin-top: 50px;
  animation: fadeInDown 1s ease-in-out;
}

.bordered-form {
  border: 2px solid #ccc;
  padding: 20px;
  border-radius: 10px;
  margin-top: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease-in-out;
}

.bordered-form:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

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
  text-align: left;
  color: #4E4E4E;
}

.form-group p {
  text-align: left;
  color: #979393;
  line-height: 1;
  font-size: 13px;
}

.form-group input {
  border-radius: 10px;
}
.form-control {
  width: 100%;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.btn_add_peminjaman {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
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

.action-buttons {
  display: flex;
  gap: 10px;
}

.btn-action {
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  font-size: 14px;
  padding: 5px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.btn-action:hover {
  text-decoration: underline;
}

.btn-delete {
  color: red;
}

.dropdown {
  position: relative;
}

.dropdown-content {
  display: block;
  position: absolute;
  background-color: #fff;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
  border-radius: 5px;
  padding: 10px;
}

.dropdown-content router-link {
  color: black;
  padding: 10px;
  text-decoration: none;
  display: block;
}

.dropdown-content router-link:hover {
  background-color: #f1f1f1;
}

.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

.dropdown-content a:hover {
  background-color: #f1f1f1;
}

.dropdown-toggle:focus + .dropdown-content {
  display: block;
}

.pagination-controls {
  margin-top: 10px;
  text-align: center;
}

.pagination-controls button {
  margin: 0 5px;
}
</style>
