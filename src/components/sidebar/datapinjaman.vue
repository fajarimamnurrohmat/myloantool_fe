<template>
  <div>
    <div style="text-align: left; margin-bottom: 30px">
      <h3 class="header-DataPinjaman">Data Pinjaman Telah Dikembalikan</h3>
      <p>
        Pada halaman data pinjaman ini, dapat melakukan peninjauan serta
        manajemen keseluruhan data pinjaman. Dapat melakukan filter serta ekspor
        data berupa file pdf.
      </p>
    </div>
    <hr />

    <!-- Filter dan Penyortir -->
    <div class="filters" style="margin-top: 30px">
      <div class="date-input-wrapper">
        <label for="startDate" style="color: #7b8291;">From :</label>
        <input
          type="date"
          v-model="startDate"
          @change="filterData"
          class="date-input"
        />
        <i class="fas fa-calendar-alt calendar-icon"></i>
      </div>
      <div class="date-input-wrapper">
        <label for="endDate" style="color: #7b8291;">To :</label>
        <input
          type="date"
          v-model="endDate"
          @change="filterData"
          class="date-input"
        />
        <i class="fas fa-calendar-alt calendar-icon"></i>
      </div>
      <div class="filter-buttons">
        <button @click="resetFilters" class="btn-reset">
          <i class="fa fa-sync" aria-hidden="true"></i>
        </button>
        <button @click="exportData('pdf')" class="btn-export">
          <i class="fa fa-file-pdf" aria-hidden="true"></i>
        </button>
        <button @click="exportData('csv')" class="btn-export">
          <i class="fa fa-file-excel" aria-hidden="true"></i>
        </button>
      </div>
      <div class="search-bar-container">
        <i class="fas fa-search search-icon"></i>
        <input
          type="text"
          @input="filterData"
          v-model="searchQuery"
          class="search-input"
          style="width: 11rem"
          placeholder="Cari.."
        />
      </div>
    </div>

    <!-- Tabel Data -->
    <table>
      <thead>
        <tr>
          <th>Nama Peminjam</th>
          <th>Alat</th>
          <th>Bengkel</th>
          <th>Jumlah</th>
          <th>Tanggal Pinjam</th>
          <th>Tanggal Kembali</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(record, index) in displayedData" :key="index">
          <td>{{ record.namaPeminjam }}</td>
          <td>{{ record.alat }}</td>
          <td>{{ record.bengkel }}</td>
          <td>{{ record.jumlah }}</td>
          <td>{{ record.tanggalPinjam }}</td>
          <td>{{ record.tanggalKembali }}</td>
        </tr>
      </tbody>
    </table>
    <div class="filters2">
      <div>
        <label for="rows" style="font-weight: 400">Tampilkan :</label>
        <select v-model="rowsPerPage" @change="updateDisplayedData">
          <option :value="5">5</option>
          <option :value="10">10</option>
          <option :value="20">20</option>
        </select>
        baris
      </div>
    </div>
  </div>
</template>

<script>
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

export default {
  name: "DataPengembalianPinjaman",
  data() {
    return {
      returnedLoans: [
        {
          namaPeminjam: "John Doe",
          alat: "Hammer",
          bengkel: "Bengkel Mesin",
          jumlah: 2,
          tanggalPinjam: "2024-08-01",
          tanggalKembali: "2024-08-10",
        },
        {
          namaPeminjam: "Jane Smith",
          alat: "Screwdriver",
          bengkel: "Bengkel Elektrik",
          jumlah: 5,
          tanggalPinjam: "2024-08-03",
          tanggalKembali: "2024-08-12",
        },
        {
          namaPeminjam: "Michael Johnson",
          alat: "Wrench",
          bengkel: "Bengkel Otomotif",
          jumlah: 3,
          tanggalPinjam: "2024-08-05",
          tanggalKembali: "2024-08-15",
        },
        // Tambahkan data lainnya di sini
      ],
      displayedData: [],
      rowsPerPage: 5,
      startDate: "",
      endDate: "",
      searchQuery: "",
    };
  },
  mounted() {
    this.updateDisplayedData();
  },
  methods: {
    updateDisplayedData() {
      let filteredData = this.returnedLoans;

      // Filter berdasarkan tanggal
      if (this.startDate || this.endDate) {
        filteredData = filteredData.filter((record) => {
          const kembaliDate = new Date(record.tanggalKembali);
          return (
            (!this.startDate || kembaliDate >= new Date(this.startDate)) &&
            (!this.endDate || kembaliDate <= new Date(this.endDate))
          );
        });
      }

      // Filter berdasarkan pencarian
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filteredData = filteredData.filter((record) => {
          return (
            record.namaPeminjam.toLowerCase().includes(query) ||
            record.alat.toLowerCase().includes(query) ||
            record.bengkel.toLowerCase().includes(query)
          );
        });
      }

      // Ambil data sesuai dengan rowsPerPage
      this.displayedData = filteredData.slice(0, this.rowsPerPage);
    },
    filterData() {
      this.updateDisplayedData();
    },
    exportData(type) {
      const exportData = this.displayedData;

      if (type === "csv") {
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "DataPengembalian");
        XLSX.writeFile(wb, "data_pengembalian.csv");
      } else if (type === "pdf") {
        const doc = new jsPDF();
        doc.autoTable({
          head: [
            [
              "Nama Peminjam",
              "Alat",
              "Bengkel",
              "Jumlah",
              "Tanggal Pinjam",
              "Tanggal Kembali",
            ],
          ],
          body: exportData.map((record) => [
            record.namaPeminjam,
            record.alat,
            record.bengkel,
            record.jumlah,
            record.tanggalPinjam,
            record.tanggalKembali,
          ]),
        });
        doc.save("data_pengembalian.pdf");
      }
    },
    resetFilters() {
      this.startDate = "";
      this.endDate = "";
      this.searchQuery = "";
      this.updateDisplayedData();
    },
  },
};
</script>

<style scoped>
.header-DataPinjaman {
  font-weight: bold;
  font-style: italic;
  color: #274278;
  font-size: 1.7rem;
  margin-bottom: 10px;
  margin-top: 30px;
  animation: fadeInDown 1s ease-in-out;
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

.filters label {
  font-weight: bold;
}

.filters2 select,
.filters input[type="date"] {
  margin-left: 10px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
  color: #333; /* Warna teks agar kontras dengan latar belakang */
}

.filters input[type="date"] {
  background-color: #f9f9f9; /* Warna latar belakang untuk input tanggal */
  color: #7b8291; /* Warna teks untuk input tanggal */
}

.export-button {
  background-color: #274278;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.export-button:hover {
  background-color: #1f3664;
}

.reset-button {
  background-color: #ccc;
  color: #333;
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.reset-button:hover {
  background-color: #999;
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
</style>
