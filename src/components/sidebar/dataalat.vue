<template>
  <div style="text-align: left">
    <h3 class="header-alat">Halaman Data Alat</h3>
    <!-- Trigger Button for Modal -->
    <button class="btn_add_alat" @click="showModal = true">
      <i class="fas fa-plus"></i> Inputkan Data
    </button>
  </div>

  <!-- Modal -->
  <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-header">
        <h4>Input Data Alat</h4>
        <span
          class="close-modal"
          @click="closeModal"
          style="color: red; text-align: right"
          >&times;</span
        >
      </div>
      <div class="modal-body">
        <div class="form-row">
          <div class="form-group">
            <label for="namaAlat">Nama Alat</label>
            <p>Masukkan nama alat</p>
            <input
              type="text"
              id="namaAlat"
              class="form-control"
              v-model="newAlat.namaAlat"
            />
          </div>
          <div class="form-group">
          <label for="ruangBengkel">Ruang Bengkel</label>
          <p>Masukkan nama ruang bengkel</p>
          <input
            type="text"
            id="ruangBengkel"
            class="form-control"
            v-model="newAlat.ruangBengkel"
          />
        </div>
        </div>
        <div class="form-group">
            <label for="jumlah">Jumlah</label>
            <p>Masukkan jumlah alat</p>
            <input
              type="number"
              id="jumlah"
              class="form-control"
              v-model="newAlat.jumlah"
            />
          </div>
      </div>
      <div class="modal-footer">
        <button class="btn_add_alat" @click="addAlat">
          Simpan Data
        </button>
      </div>
    </div>
  </div>

  <hr />

  <!-- Date Filter Section -->
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
      <!-- filter button section -->
      <div class="filter-buttons">
        <button @click="resetFilter" class="btn-reset" >
          <i class="fa fa-sync" aria-hidden="true"></i>
        </button>
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

  <!-- Table Section -->
  <div style="margin-top: 30px">
    <table class="data-table">
      <thead>
        <tr>
          <th>No</th>
          <th>Nama Alat</th>
          <th>Jumlah</th>
          <th>Ruang Bengkel</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(alat, index) in paginatedAlatList" :key="index">
          <td>{{ index + 1 + (currentPage - 1) * rowsPerPage }}</td>
          <td>{{ alat.namaAlat }}</td>
          <td>{{ alat.jumlah }}</td>
          <td>{{ alat.ruangBengkel }}</td>
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
                  class="dropdown-item"
                  @click="deletePeminjaman(index)"
                  style="color: red"
                  >Hapus</button
                >
              </div>
            </div>
            <!-- dropdown set -->
          </td>
        </tr>
        <tr v-if="paginatedAlatList.length === 0">
          <td colspan="5" style="text-align: center">Tidak ada data</td>
        </tr>
      </tbody>
    </table>
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
</template>

<script>
export default {
  data() {
    return {
      newAlat: {
        namaAlat: "",
        jumlah: "",
        ruangBengkel: "",
      },
      alatList: [],
      rowsPerPage: 5,
      currentPage: 1,
      searchQuery: "",
      editIndex: null,
      showModal: false,
      dropdownIndex: null,
    };
  },
  computed: {
    filteredAlatList() {
      return this.alatList.filter(
        (alat) =>
          alat.namaAlat
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase()) ||
          alat.jumlah.toString().includes(this.searchQuery) ||
          alat.ruangBengkel
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase())
      );
    },
    paginatedAlatList() {
      const start = (this.currentPage - 1) * this.rowsPerPage;
      const end = start + this.rowsPerPage;
      return this.filteredAlatList.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredAlatList.length / this.rowsPerPage);
    },
  },
  methods: {
    addAlat() {
      if (
        this.newAlat.namaAlat &&
        this.newAlat.ruangBengkel &&
        this.newAlat.jumlah 
      ) {
        if (this.editIndex !== null) {
          this.alatList.splice(this.editIndex, 1, { ...this.newAlat });
          this.editIndex = null;
        } else {
          this.alatList.push({ ...this.newAlat });
        }
        this.newAlat.namaAlat = "";
        this.newAlat.ruangBengkel = "";
        this.newAlat.jumlah = "";
        this.showModal = false;
      } else {
        alert("Mohon isi semua data");
      }
    },
    editAlat(index) {
      this.newAlat = { ...this.alatList[index] };
      this.editIndex = index;
      this.showModal = true;
    },
    deleteAlat(index) {
      this.alatList.splice(index, 1);
    },
    closeModal() {
      this.showModal = false;
      this.newAlat = {
        namaAlat: "",
        ruangBengkel: "",
        jumlah: ""
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

<style scoped>
.header-alat {
  font-weight: bold;
  color: #274278;
  font-size: 1.7rem;
  margin-bottom: 10px;
  margin-top: 30px;
  animation: fadeInDown 1s ease-in-out;
}

.btn_add_alat {
  margin-top: 10px;
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out, transform 0.3s ease-in-out;
}

.btn_add_alat:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  position: relative;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0px;
}

.close-modal {
  font-size: 30px;
  cursor: pointer;
}

.form-group {
  margin-bottom: 1px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-control {
  width: 16rem;
}

.modal-footer {
  text-align: right;
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
  border-radius: 5px;
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
  margin-top: 15px;
}

.data-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

.data-table tr:nth-child(even) {
  background-color: #f2f2f2;
}

.data-table tr:hover {
  background-color: #ddd;
}

.pagination-controls {
  margin-top: 10px;
  text-align: center;
}

.pagination-controls button {
  margin: 0 5px;
}
</style>
