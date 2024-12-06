<template>
<!-- Header dan Tombol Tambah Siswa -->
<div class="header-siswa-container">
    <h3 class="header-siswa">Halaman Data Siswa</h3>
    <button @click="showModal = true" class="btn_add_siswa">
        <i class="fas fa-plus"></i> Inputkan Data
    </button>
</div>

<!-- Modal Input/Edit Siswa -->
<div v-if="showModal" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
        <div class="modal-header">
            <h4>{{ isEditMode ? "Edit Data Siswa" : "Input Data Siswa" }}</h4>
            <span class="close-modal" @click="closeModal" style="color: red">&times;</span>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label for="nomorInduk">Nomor Induk</label>
                <p>Masukkan nomor induk</p>
                <input type="text" id="nomorInduk" class="form-control" v-model="newSiswa.nomorInduk" @input="validateNumberInput" :disabled="isEditMode" />
                <small v-if="errorNomorInduk" style="color: red">{{ errorNomorInduk }}</small>
            </div>
            <div class="form-group">
                <label for="namaSiswa">Nama Siswa</label>
                <p>Masukkan nama siswa</p>
                <input type="text" id="namaSiswa" class="form-control" v-model="newSiswa.nama" />
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label for="jenisKelamin">Jenis Kelamin</label>
                <p>Pilih jenis kelamin</p>
                <select id="jenisKelamin" class="form-control" v-model="newSiswa.jenisKelamin">
                    <option value="">Pilih jenis kelamin</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                </select>
            </div>
            <div class="form-group">
                <label for="jurusan">Jurusan</label>
                <p>Masukkan Jurusan</p>
                <input type="text" id="jurusan" class="form-control" v-model="newSiswa.jurusan" />
            </div>
        </div>

        <div style="margin-top: 10px; text-align: left">
            <button @click="isEditMode ? editSiswa() : addSiswa()" class="btn_add_siswa">
                {{ isEditMode ? "Update Data" : "Simpan Data" }}
            </button>
        </div>
    </div>
</div>

<!-- Tabel Siswa -->
<div style="margin-top: 30px">
    <!-- End of Search and Import Wrapper -->
    <div class="import-search-wrapper">
        <!-- Import Button and File Input -->
        <div class="import-data">
            <button class="btn-import" type="button" @click="importData" style="
            color: #4b6cb7;
            background-color: white;
            justify-content: space-between;
            text-align: left;
            width: 7.5rem;
          ">
                <i class="fa-solid fa-arrow-up-from-bracket" style="margin-right: 0.4rem; color: #4b6cb7">
                </i>
                Import
            </button>
            <input type="file" id="importFile" class="file-input" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" @change="fileChange($event)" style="display: none" />
        </div>
        <!-- End of Import Button and File Input -->
        <!-- Search Bar -->
        <div class="search-bar-container">
            <i class="fas fa-search search-icon"></i>
            <input type="text" v-model="searchQuery" class="search-input" placeholder="Cari data..." />
        </div>
        <!-- End of Search Bar -->
    </div>
    <!-- End of Search and Import Wrapper -->
    <!-- tabel wrapper -->
    <div class="table-wrapper">
      <div class="info-page">
          <div class="tampil-baris" style="text-align: left; margin-bottom: 1rem">
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
        <!-- End Section Filter dan Pencarian -->
        <table class="data-table">
            <thead>
                <tr>
                    <th>No</th>
                    <th>
                        Nomor Induk
                        <span class="material-symbols-outlined swap-sort" @click="toggleSort('nomorInduk')">
                            swap_vert
                        </span>
                    </th>
                    <th>
                        Nama Siswa
                        <span class="material-symbols-outlined swap-sort" @click="toggleSort('nama')">
                            swap_vert
                        </span>
                    </th>
                    <th>
                        Jenis Kelamin
                        <span class="material-symbols-outlined swap-sort" @click="toggleSort('jenisKelamin')">
                            swap_vert
                        </span>
                    </th>
                    <th>
                        Jurusan
                        <span class="material-symbols-outlined swap-sort" @click="toggleSort('jurusan')">
                            swap_vert
                        </span>
                    </th>
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
                        <div class="action-set">
                            <button class="dropdown-item" @click="prepareEditSiswa(siswa)" style="color: #274278">
                                <i class="fa-solid fa-pen"></i>
                            </button>
                            <button class="dropdown-item" @click="deleteSiswa(siswa.nomorInduk)" style="color: red">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
                <tr v-if="paginatedSiswaList.length === 0">
                    <td colspan="6" style="text-align: center">Tidak ada data</td>
                </tr>
            </tbody>
        </table>
        <!-- pagination -->
        <div v-if="totalPages > 1" class="pagination-container">
            <button @click="currentPage--" :disabled="currentPage === 1" class="pagination-button">
                Previous
            </button>
            <span class="pagination-info">
                Page {{ currentPage }} of {{ totalPages }}
            </span>
            <button @click="currentPage++" :disabled="currentPage === totalPages" class="pagination-button">
                Next
            </button>
        </div>
        <!-- pagination -->
    </div>
    <!-- tabel wrapper -->
</div>
<!-- Tabel Siswa -->
</template>

<script>
import Swal from "sweetalert2";

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
            errorNomorInduk: "",
            siswaList: [],
            rowsPerPage: 5,
            sortBy: "nama",
            sortDirection: "asc",
            currentPage: 1,
            searchQuery: "",
            editNomorInduk: null,
            dropdownIndex: null,
        };
    },
  computed: {
    pageInfo() {
      const totalData = this.siswaList.length;
      const startIndex = (this.currentPage - 1) * this.rowsPerPage + 1;
      const endIndex = Math.min(
        startIndex + this.rowsPerPage - 1,
        totalData
      );
      return `Menampilkan ${startIndex} sampai ${endIndex} dari ${totalData} data`;
    },
        isEditMode() {
            return this.editNomorInduk !== null;
        },
        filteredSiswaList() {
            const filteredList = this.siswaList.filter((siswa) =>
                siswa.nomorInduk.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                siswa.nama.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                siswa.jenisKelamin.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                siswa.jurusan.toLowerCase().includes(this.searchQuery.toLowerCase())
            );

            // Sorting
            filteredList.sort((a, b) => {
                const valA = a[this.sortBy].toString().toLowerCase();
                const valB = b[this.sortBy].toString().toLowerCase();

                if (this.sortDirection === "asc") {
                    return valA > valB ? 1 : valA < valB ? -1 : 0;
                } else {
                    return valA < valB ? 1 : valA > valB ? -1 : 0;
                }
            });

            return filteredList;
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
        validateNumberInput() {
            const nomorInduk = this.newSiswa.nomorInduk;
            if (!/^\d*$/.test(nomorInduk)) {
                this.errorNomorInduk = "Nomor Induk hanya boleh berupa angka!";
                this.newSiswa.nomorInduk = nomorInduk.replace(/\D/g, ""); // Hapus karakter non-angka
            } else {
                this.errorNomorInduk = "";
            }
        },
        toggleSort(column) {
            if (this.sortBy === column) {
                // Jika kolom yang sama, ubah arah sortir
                this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
            } else {
                // Jika kolom berbeda, set kolom baru dan arah default (ascending)
                this.sortBy = column;
                this.sortDirection = "asc";
            }
        },
        async fetchSiswaData() {
            try {
                const token = localStorage.getItem("accessToken");
                const response = await fetch("http://localhost:3000/siswa", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
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
        validateSiswaForm() {
            const {
                nomorInduk,
                nama,
                jenisKelamin,
                jurusan
            } = this.newSiswa;

            if (!nomorInduk || !nama || !jenisKelamin || !jurusan) {
                Swal.fire({
                    title: "Peringatan!",
                    text: "Semua kolom harus diisi.",
                    icon: "warning",
                    confirmButtonText: "OK",
                });
                return false;
            }
            return true;
        },
        async addSiswa() {
            if (
                this.newSiswa.nomorInduk &&
                this.newSiswa.nama &&
                this.newSiswa.jenisKelamin &&
                this.newSiswa.jurusan
            ) {
                try {
                    const token = localStorage.getItem("accessToken");
                    const response = await fetch("http://localhost:3000/siswa", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
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
                        this.fetchSiswaData();
                        this.closeModal();
                        this.resetForm();
                        Swal.fire({
                            title: "Sukses!",
                            text: "Data siswa berhasil disimpan.",
                            icon: "success",
                            confirmButtonText: "OK",
                        });
                    } else {
                        console.error("Gagal menambah siswa:", data);
                        Swal.fire({
                            title: "Error!",
                            text: "Gagal menambah siswa. NIS sudah terdaftar.",
                            icon: "error",
                            confirmButtonText: "OK",
                        });
                    }
                } catch (error) {
                    console.error("Error adding siswa:", error);
                    Swal.fire({
                        title: "Error!",
                        text: "Terjadi kesalahan saat menambah siswa.",
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                }
            } else {
                Swal.fire({
                    title: "Peringatan!",
                    text: "Lengkapi data siswa.",
                    icon: "warning",
                    confirmButtonText: "OK",
                });
            }
            if (this.errorNomorInduk) {
                alert("Periksa kembali inputan Anda!");
                return;
            }
        },
        async editSiswa() {
            try {
                const token = localStorage.getItem("accessToken");
                const response = await fetch(
                    `http://localhost:3000/siswa/${this.editNomorInduk}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            nis: this.newSiswa.nomorInduk,
                            nama_siswa: this.newSiswa.nama,
                            jenis_kelamin: this.newSiswa.jenisKelamin,
                            jurusan: this.newSiswa.jurusan,
                        }),
                    }
                );
                const data = await response.json();
                if (data.status === "success") {
                    this.fetchSiswaData();
                    this.closeModal();
                    this.resetForm();
                    Swal.fire({
                        title: "Sukses!",
                        text: "Data siswa berhasil diperbarui.",
                        icon: "success",
                        confirmButtonText: "OK",
                    });
                } else {
                    console.error("Gagal mengedit siswa:", data);
                    Swal.fire({
                        title: "Error!",
                        text: data.message || "Terjadi kesalahan saat mengedit siswa.",
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                }
            } catch (error) {
                console.error("Error editing siswa:", error);
                Swal.fire({
                    title: "Error!",
                    text: "Terjadi kesalahan saat mengedit siswa.",
                    icon: "error",
                    confirmButtonText: "OK",
                });
            }
        },

        // Mempersiapkan data untuk edit
        prepareEditSiswa(siswa) {
            this.newSiswa = {
                ...siswa
            };
            this.editNomorInduk = siswa.nomorInduk;
            this.showModal = true;
        },

        async deleteSiswa(nomorInduk) {
            const result = await Swal.fire({
                title: "Anda yakin?",
                text: "Data siswa ini akan dihapus!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Ya, hapus!",
            });

            if (result.isConfirmed) {
                try {
                    const token = localStorage.getItem("accessToken");
                    const response = await fetch(
                        `http://localhost:3000/siswa/${nomorInduk}`, {
                            method: "DELETE",
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    const data = await response.json();
                    if (data.status === "success") {
                        this.fetchSiswaData();
                        Swal.fire({
                            title: "Terhapus!",
                            text: "Data siswa berhasil dihapus.",
                            icon: "success",
                        });
                    } else {
                        console.error("Gagal menghapus siswa:", data);
                        Swal.fire({
                            title: "Error!",
                            text: "Gagal menghapus data siswa.",
                            icon: "error",
                            confirmButtonText: "OK",
                        });
                    }
                } catch (error) {
                    console.error("Error deleting siswa:", error);
                    Swal.fire({
                        title: "Error!",
                        text: "Gagal menghapus data siswa.",
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                }
            }
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
            this.editNomorInduk = null;
        },
        // Reset filter pencarian
        resetFilter() {
            this.searchQuery = "";
            this.rowsPerPage = 5;
            this.currentPage = 1;
        },
        // Mengganti halaman saat paginasi
        changePage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
                this.dropdownIndex = null;
            }
        },
        // Toggle dropdown
        toggleDropdown(index) {
            if (this.dropdownIndex === index) {
                this.dropdownIndex = null;
            } else {
                this.dropdownIndex = index;
            }
        },
    },
    mounted() {
        this.fetchSiswaData();
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

.date-inputs {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.import-search-wrapper {
    display: flex;
    justify-content: space-between;
    /* Menyebarkan elemen di kiri dan kanan */
    width: 100%;
    /* Pastikan elemen mengambil lebar penuh */
    align-items: center;
}

.search-bar-container {
    display: flex;
    align-items: center;
    border: 1px solid #ccc;
    padding: 0.25rem 0.5rem;
    border-radius: 5px;
    width: fit-content;
}

.search-input {
    border: none;
    outline: none;
    text-align: left;
}

.search-icon {
    color: #888;
}

.search-bar-container:focus-within {
    border-color: #636364;
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

.search-bar-container {
    position: relative;
    display: inline-block;
    margin-left: 1.5rem;
}

.info-page {
    display: flex;
    justify-content: space-between;
    align-items: center; /* Memastikan elemen sejajar vertikal */
    margin-bottom: 1rem;
}

.select-rows {
    padding: 0.25rem; /* Konsisten padding */
    font-size: 1rem;
    line-height: 1.5; /* Sama dengan elemen teks lainnya */
}

.page-info {
    font-size: 0.9rem; /* Ukuran font serupa dengan teks lainnya */
    line-height: 1.5; /* Konsistensi line-height */
    color: #555;
    margin: 0; /* Hilangkan margin tambahan */
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

.header-siswa-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 3rem;
}

.header-siswa {
    font-weight: bold;
    color: #274278;
    font-size: 1.7rem;
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
    width: 16rem;
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

.table-wrapper {
    width: 100%;
    overflow-x: auto;
    background-color: white;
    margin-top: -1rem;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.data-table {
    width: 100%;
    border-collapse: collapse;
    min-width: 600px;
}

.data-table th,
.data-table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
}

.data-table th:last-child,
.data-table td:last-child {
    text-align: center;
    /* Kolom action tetap di tengah */
}

.data-table tr:nth-child(even) {
    background-color: #f2f2f2;
}

.data-table tr:hover {
    background-color: #ddd;
}

.action-set {
    display: flex;
    justify-content: space-between;
}

@media (max-width: 768px) {

    .data-table th,
    .data-table td {
        font-size: 0.875rem;
        padding: 6px;
    }

    .pagination-container {
        justify-content: start;
    }

    .header-siswa {
        font-size: 1.5rem;
    }
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

.pagination-container {
    display: flex;
    justify-content: flex-end;
    padding: 10px 0;
    margin-bottom: -1rem;
}

.pagination-button {
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 5px 10px;
    margin: 0 5px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.pagination-button:hover {
    background-color: #0056b3;
}

.pagination-button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
}

.pagination-info {
    font-size: 0.9rem;
    color: #555;
}

@media screen and (max-width: 450px) {
    .header-siswa-container {
        display: block;
        text-align: left;
    }

    .header-siswa {
        margin-bottom: 1rem;
    }

    .modal-content-siswa {
        width: 90%;
        max-width: 500px;
        margin: auto;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .form-row {
        display: flex;
        flex-direction: column;
    }

    .search-bar-container {
        margin-top: 0rem;
        margin-bottom: 0.7rem;
        height: 2.8rem;
    }

    .import-search-wrapper {
        gap: 0.5rem;
    }
}
</style>
