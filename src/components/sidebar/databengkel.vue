<template>
  <div style="text-align: left">
    <h3 class="header-bengkel">Halaman Data Bengkel</h3>
    <button @click="showModal = true" class="btn-add-bengkel">
      <i class="fas fa-plus"></i> Inputkan Nama Ruang Bengkel
    </button>
  </div>

  <!-- Modal -->
  <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-header">
        <h4>Input Nama Ruang Bengkel</h4>
        <span
          class="close-modal"
          @click="closeModal"
          style="color: red; text-align: right"
          >&times;</span
        >
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="namaRuang">Nama Ruang Bengkel</label>
          <p>Masukkan nama ruang bengkel</p>
          <input
            type="text"
            id="namaRuang"
            class="form-control"
            v-model="newBengkel.namaRuang"
          />
        </div>
      </div>

      <div style="margin-top: 10px; text-align: left">
        <button @click="addBengkel" class="btn-add-bengkel">
          <i class="fas fa-save"></i> Simpan Data
        </button>
      </div>
    </div>
  </div>

  <!-- Tabel Bengkel -->
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
          <th>Nama Ruang Bengkel</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(bengkel, index) in paginatedBengkelList" :key="index">
          <td>{{ index + 1 + (currentPage - 1) * rowsPerPage }}</td>
          <td>{{ bengkel.namaRuang }}</td>
          <td>
            <i class="fas fa-edit" @click="editBengkel(index)"></i>
            <i
              class="fas fa-trash-alt"
              @click="deleteBengkel(index)"
              style="color: red; margin-left: 10px; cursor: pointer"
            ></i>
          </td>
        </tr>
        <tr v-if="paginatedBengkelList.length === 0">
          <td colspan="3" style="text-align: center">Tidak ada data</td>
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
      newBengkel: {
        namaRuang: "",
      },
      bengkelList: [],
      rowsPerPage: 5,
      currentPage: 1,
      searchQuery: "",
      editIndex: null,
    };
  },
  computed: {
    filteredBengkelList() {
      return this.bengkelList.filter((bengkel) =>
        bengkel.namaRuang.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    paginatedBengkelList() {
      const start = (this.currentPage - 1) * this.rowsPerPage;
      const end = start + this.rowsPerPage;
      return this.filteredBengkelList.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredBengkelList.length / this.rowsPerPage);
    },
  },
  methods: {
    addBengkel() {
      if (this.newBengkel.namaRuang) {
        if (this.editIndex !== null) {
          this.bengkelList.splice(this.editIndex, 1, { ...this.newBengkel });
          this.editIndex = null;
        } else {
          this.bengkelList.push({ ...this.newBengkel });
        }
        this.closeModal();
        this.resetForm();
      } else {
        alert("Mohon isi nama ruang bengkel");
      }
    },
    editBengkel(index) {
      this.newBengkel = { ...this.bengkelList[index] };
      this.editIndex = index;
      this.showModal = true;
    },
    deleteBengkel(index) {
      this.bengkelList.splice(index, 1);
    },
    closeModal() {
      this.showModal = false;
      this.resetForm();
    },
    resetForm() {
      this.newBengkel = {
        namaRuang: "",
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
.header-bengkel {
  font-weight: bold;
  color: #274278;
  font-size: 1.7rem;
  margin-bottom: 10px;
  margin-top: 20px;
  animation: fadeInDown 1s ease-in-out;
}

.btn-add-bengkel {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 16px;
}

.btn-add-bengkel:hover {
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
  width: 100%;
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
  background-color: #ebecee;
  color: rgb(69, 67, 67);
}

.data-table th,
.data-table td {
  padding: 10px;
}

.data-table tr:nth-child(even) {
  background-color: #f2f2f2;
}

.data-table tr:hover {
  background-color: #ddd;
}

.pagination-container {
  display: flex;
  margin-top: 20px;
}

.pagination-button {
  background-color: #007bff;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.pagination-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.pagination-info {
  margin: 0 10px;
  align-self: center;
  color: black;
}

.pagination-button:hover:not(:disabled) {
  background-color: #0056b3;
}

/* Add fade-in animation */
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes fadeInDown {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
