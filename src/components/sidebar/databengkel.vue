<template>
  <div style="text-align: left">
    <h3 class="header-bengkel">Halaman Data Bengkel</h3>
  </div>
  <div class="bordered-form">
    <div class="form-row">
      <div class="form-group">
        <label for="namaBengkel">Ruang Bengkel</label>
        <input
          type="text"
          id="namaBengkel"
          class="form-control"
          placeholder="Masukkan ruang bengkel"
          v-model="newBengkel.nama"
        />
      </div>
    </div>
    <div style="margin-top: 20px; text-align: right">
      <button class="btn_add_bengkel" id="btn_add_bengkel" @click="addBengkel">
        <i class="fas fa-plus"></i> Input Data
      </button>
    </div>
  </div>

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
          <th>Ruang Bengkel</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(bengkel, index) in paginatedBengkelList" :key="index">
          <td>{{ index + 1 + (currentPage - 1) * rowsPerPage }}</td>
          <td>{{ bengkel.nama }}</td>
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
          <td colspan="4" style="text-align: center">Tidak ada data</td>
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
      newBengkel: {
        nama: "",
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
        bengkel.nama.toLowerCase().includes(this.searchQuery.toLowerCase())
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
      if (this.newBengkel.nama) {
        if (this.editIndex !== null) {
          this.bengkelList.splice(this.editIndex, 1, { ...this.newBengkel });
          this.editIndex = null;
        } else {
          this.bengkelList.push({ ...this.newBengkel });
        }
        this.newBengkel.nama = "";
      } else {
        alert("Mohon isi semua data");
      }
    },
    editBengkel(index) {
      this.newBengkel = { ...this.bengkelList[index] };
      this.editIndex = index;
    },
    deleteBengkel(index) {
      this.bengkelList.splice(index, 1);
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
.header-bengkel {
  font-weight: bold;
  font-style: italic;
  color: #274278;
  font-size: 1.7rem;
  margin-bottom: 10px;
  margin-top: 30px;
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
}

.form-control {
  width: 100%;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.btn_add_bengkel {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out, transform 0.3s ease-in-out;
}

.btn_add_bengkel:hover {
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
  border-radius: 5px;
  border: 1px solid #ccc;
  background-color: #fff; /* Background warna putih */
  color: #333; /* Warna teks */
}

.search-input::placeholder {
  color: #999; /* Warna placeholder */
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

.data-table .fas {
  cursor: pointer;
}

.pagination-controls {
  margin-top: 10px;
  text-align: center;
}

.pagination-controls button {
  margin: 0 5px;
}
</style>
