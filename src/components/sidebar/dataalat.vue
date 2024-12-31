<template>
<div>
    <!-- Header dan Tombol Tambah Alat -->
    <div class="header-alat-container">
        <h3 class="header-alat">Halaman Data Alat</h3>
        <button @click="openAddModal" class="btn_add_alat">
            <i class="fas fa-plus"></i> Inputkan Data
        </button>
    </div>

    <!-- Modal Input/Edit Alat -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content">
            <div class="modal-header">
                <h4>{{ isEditMode ? "Edit Data Alat" : "Input Data Alat" }}</h4>
                <span class="close-modal" @click="closeModal">&times;</span>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="namaAlat">Nama Alat</label>
                    <p>Masukkan nama alat</p>
                    <input type="text" id="namaAlat" class="form-control" v-model="newAlat.namaAlat" placeholder="Masukkan nama alat" />
                </div>
                <div class="form-group">
                    <label for="ruangBengkel">Ruang Bengkel</label>
                    <p>Pilih ruang bengkel</p>
                    <select id="ruangBengkel" class="form-control" v-model="newAlat.id_bengkel" :disabled="isEditMode">
                        <option disabled value="">Pilih Ruang Bengkel</option>
                        <option v-for="bengkel in bengkelList" :key="bengkel.id_bengkel" :value="bengkel.id_bengkel">
                            {{ bengkel.ruang_bengkel }}
                        </option>
                    </select>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="jumlah">Jumlah</label>
                    <p>Masukkan jumlah alat</p>
                    <input type="number" id="jumlah" class="form-control" v-model.number="newAlat.jumlah" min="1" placeholder="Masukkan jumlah alat" />
                </div>
            </div>
            <div style="margin-top: 10px; text-align: left">
                <button @click="saveAlat" class="btn_add_alat">
                    {{ isEditMode ? "Update Data" : "Simpan Data" }}
                </button>
            </div>
        </div>
    </div>

    <!-- Import Button and File Input -->
    <div class="import-search-wrapper">
        <!-- Import Button and File Input -->
        <div class="import-data">
            <button class="btn-import" type="button" @click="showFileUploadModal" style="">
                <i class="fa-solid fa-arrow-up-from-bracket" style="margin-right: 0.4rem; color: #4b6cb7">
                </i>
                Import
            </button>
        </div>
        <!-- End of Import Button and File Input -->

        <!-- Modal for File Upload -->
        <div v-if="showFileUpload" class="modal-overlay-upload" @click.self="closeFileUploadModal">
            <div class="modal-content-upload">
                <div class="modal-header-upload">
                    <div class="header-content">
                        <h5>Upload File Excel</h5>
                        <p>Upload a CSV or Excel file to import tools data</p>
                    </div>
                    <span class="close-modal-upload" @click="closeFileUploadModal">&times;</span>
                </div>

                <div class="upload-box">
                    <p v-if="!fileSelected" class="upload-box-text">
                        Click here to upload your file
                    </p>
                    <p v-else class="upload-box-text">
                       {{ fileName }}
                    </p>
                    <input id="file-upload" type="file" class="upload-box-input" accept=".xls,.xlsx,.csv" @change="handleFileUpload" />
                </div>
                <div class="modal-footer">
                    <!-- Cancel Button -->
                    <button @click="cancelFileSelection" class="btn btn-cancel">
                        Cancel
                    </button>
                    <!-- Add Button -->
                    <button @click="submitExcelData" class="btn-add-alat" :disabled="!fileSelected">
                        Submit
                    </button>
                </div>
            </div>
        </div>

        <!-- Search Bar -->
        <div class="search-bar-container">
            <i class="fas fa-search search-icon"></i>
            <input type="text" v-model="searchQuery" class="search-input" placeholder="Cari data..." />
        </div>
        <!-- End of Search Bar -->
    </div>
    <!-- End of Import Button and File Input -->
    <div class="table-wrapper">
        <div class="info-page">
            <div class="tampil-baris" style="text-align: left">
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
        <table class="data-table">
            <thead>
                <tr>
                    <th>No</th>
                    <th>
                        Nama Alat
                        <span class="material-symbols-outlined swap-sort" @click="toggleSort('nama_alat')">
                            swap_vert
                        </span>
                    </th>
                    <th>
                        Jumlah Alat
                        <span class="material-symbols-outlined swap-sort" @click="toggleSort('jumlah')">
                            swap_vert
                        </span>
                    </th>
                    <th>
                        Ruang Bengkel
                        <span class="material-symbols-outlined swap-sort" @click="toggleSort('ruang_bengkel')">
                            swap_vert
                        </span>
                    </th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(alat, index) in paginatedAlatList" :key="alat.id_alat">
                    <td>{{ index + 1 + (currentPage - 1) * rowsPerPage }}</td>
                    <td>{{ alat.nama_alat }}</td>
                    <td>{{ alat.jumlah }}</td>
                    <td>{{ alat.ruang_bengkel }}</td>
                    <td>
                        <div class="action-set">
                            <button class="dropdown-item" @click="openEditModal(alat)" style="color: #274278">
                                <i class="fa-solid fa-pen"></i>
                            </button>
                            <button class="dropdown-item" @click="deleteAlat(alat.id_alat)" style="color: red">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
                <tr v-if="paginatedAlatList.length === 0">
                    <td colspan="5" style="text-align: center">Tidak ada data</td>
                </tr>
            </tbody>
        </table>
        <!-- Pagination -->
        <div v-if="totalPages > 1" class="pagination-container">
            <button @click="prevPage" :disabled="currentPage === 1" class="pagination-button">
                Previous
            </button>
            <span class="pagination-info">
                Page {{ currentPage }} of {{ totalPages }}</span>
            <button @click="nextPage" :disabled="currentPage === totalPages" class="pagination-button">
                Next
            </button>
        </div>
    </div>
</div>
</template>

<script>
import Swal from "sweetalert2";
import axios from "axios";
import * as XLSX from "xlsx"; // Import the XLSX library for reading Excel files

export default {
    data() {
        return {
            showModal: false,
            newAlat: {
                namaAlat: "",
                jumlah: "",
                id_bengkel: "",
            },
            alatList: [],
            bengkelList: [],
            rowsPerPage: 5,
            sortBy: "nama_alat",
            sortDirection: "asc",
            currentPage: 1,
            searchQuery: "",
            editAlatId: null, // Menyimpan ID alat yang akan diedit
            dropdownIndex: null,
            showFileUpload: false,
            selectedFile: null,
            fileName: null,
            fileSelected: false,
            isEditMode: false, // Menandakan apakah modal dalam mode edit
        };
    },
    computed: {
        pageInfo() {
            const totalData = this.alatList.length;
            const startIndex = (this.currentPage - 1) * this.rowsPerPage + 1;
            const endIndex = Math.min(startIndex + this.rowsPerPage - 1, totalData);
            return `Menampilkan ${startIndex} sampai ${endIndex} dari ${totalData} data`;
        },
        filteredAlatList() {
            const filteredList = this.alatList.filter((alat) => {
                const ruangBengkel = this.getRuangBengkel(
                    alat.id_bengkel
                ).toLowerCase();
                return (
                    alat.nama_alat
                    .toLowerCase()
                    .includes(this.searchQuery.toLowerCase()) ||
                    alat.jumlah.toString().includes(this.searchQuery) ||
                    ruangBengkel.includes(this.searchQuery.toLowerCase())
                );
            });

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
        toggleSort(column) {
            if (this.sortBy === column) {
                this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
            } else {
                this.sortBy = column;
                this.sortDirection = "asc";
            }
        },
        async fetchBengkelList() {
            try {
                const token = localStorage.getItem("accessToken");
                const response = await axios.get("http://localhost:3000/bengkel", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.data.status === "success") {
                    this.bengkelList = response.data.data.bengkel.rows;
                } else {
                    console.error("Gagal mendapatkan data bengkel:", response.data);
                    Swal.fire({
                        title: "Error!",
                        text: "Gagal mengambil data bengkel.",
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                }
            } catch (error) {
                console.error("Error fetching data bengkel:", error);
                Swal.fire({
                    title: "Error!",
                    text: "Terjadi kesalahan saat mengambil data bengkel.",
                    icon: "error",
                    confirmButtonText: "OK",
                });
            }
        },
        async fetchAlatList() {
            try {
                const token = localStorage.getItem("accessToken");
                const response = await axios.get("http://localhost:3000/alat", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.data.status === "success") {
                    this.alatList = response.data.data.alat;
                } else {
                    console.error("Gagal mendapatkan data alat:", response.data);
                    Swal.fire({
                        title: "Error!",
                        text: "Gagal mengambil data alat.",
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                }
            } catch (error) {
                console.error("Error fetching data alat:", error);
                Swal.fire({
                    title: "Error!",
                    text: "Terjadi kesalahan saat mengambil data alat.",
                    icon: "error",
                    confirmButtonText: "OK",
                });
            }
        },
        openAddModal() {
            this.isEditMode = false;
            this.editAlatId = null;
            this.newAlat = {
                namaAlat: "",
                jumlah: "",
                id_bengkel: "",
            };
            this.showModal = true;
        },
        openEditModal(alat) {
            this.isEditMode = true;
            this.editAlatId = alat.id_alat;
            // Temukan bengkel yang sesuai dengan ruang_bengkel dari alat
            const bengkel = this.bengkelList.find(
                (bengkel) => bengkel.ruang_bengkel === alat.ruang_bengkel
            );

            // Ambil id_bengkel dari bengkel yang ditemukan, atau gunakan null jika tidak ditemukan
            this.newAlat = {
                namaAlat: alat.nama_alat,
                jumlah: alat.jumlah,
                id_bengkel: bengkel ? bengkel.id_bengkel : null,
            };

            this.showModal = true;
        },
        async saveAlat() {
            if (
                this.newAlat.namaAlat &&
                this.newAlat.id_bengkel &&
                this.newAlat.jumlah > 0
            ) {
                const token = localStorage.getItem("accessToken");
                const payload = {
                    id_bengkel: this.newAlat.id_bengkel,
                    nama_alat: this.newAlat.namaAlat,
                    jumlah: Number(this.newAlat.jumlah),
                };
                try {
                    if (this.isEditMode && this.editAlatId) {
                        const response = await axios.put(
                            `http://localhost:3000/alat/${this.editAlatId}`,
                            payload, {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );
                        //console.log(response.data);

                        // Cek response.data mengandung alat atau hanya pesan
                        if (response.data.status === "success") {
                            if (response.data.data && response.data.data.alat) {
                                // Update alat jika respons berisi data alat
                                const updatedAlat = response.data.data.alat;
                                const index = this.alatList.findIndex(
                                    (alat) => alat.id_alat === this.editAlatId
                                );
                                if (index !== -1) {
                                    this.$set(this.alatList, index, updatedAlat);
                                }
                            } else {
                                // Jika tidak ada data alat, cukup tampilkan notifikasi sukses
                                this.fetchAlatList(); // Perbarui daftar alat dari server
                            }
                            this.closeModal();
                            Swal.fire({
                                title: "Sukses!",
                                text: "Data alat berhasil diperbarui.",
                                icon: "success",
                                confirmButtonText: "OK",
                            });
                        }
                    } else {
                        const response = await axios.post(
                            "http://localhost:3000/alat",
                            payload, {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );
                        //console.log(response.data);
                        if (response.data.status === "success") {
                            this.fetchAlatList();
                            this.closeModal();
                            Swal.fire({
                                title: "Sukses!",
                                text: "Data alat berhasil disimpan.",
                                icon: "success",
                                confirmButtonText: "OK",
                            });
                        }
                    }
                } catch (error) {
                    console.error("Error saving alat:", error);
                    Swal.fire({
                        title: "Error!",
                        text: "Terjadi kesalahan saat menyimpan data alat.",
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                }
            } else {
                Swal.fire({
                    title: "Peringatan!",
                    text: "Lengkapi semua data alat dengan benar.",
                    icon: "warning",
                    confirmButtonText: "OK",
                });
            }
        },
        async deleteAlat(alatId) {
            const result = await Swal.fire({
                title: "Anda yakin?",
                text: "Data alat ini akan dihapus!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Ya, hapus!",
            });
            if (result.isConfirmed) {
                const token = localStorage.getItem("accessToken");
                try {
                    const response = await axios.delete(
                        `http://localhost:3000/alat/${alatId}`, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    if (response.data.status === "success") {
                        const index = this.alatList.findIndex(
                            (alat) => alat.id_alat === alatId
                        );
                        if (index !== -1) {
                            this.alatList.splice(index, 1);
                        }
                        Swal.fire({
                            title: "Terhapus!",
                            text: "Data alat berhasil dihapus.",
                            icon: "success",
                            confirmButtonText: "OK",
                        });
                    } else {
                        console.error("Gagal menghapus alat:", response.data);
                        Swal.fire({
                            title: "Error!",
                            text: response.data.message || "Gagal menghapus data alat.",
                            icon: "error",
                            confirmButtonText: "OK",
                        });
                    }
                } catch (error) {
                    console.error("Error deleting alat:", error);
                    Swal.fire({
                        title: "Error!",
                        text: "Terjadi kesalahan saat menghapus data alat.",
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                }
            }
        },
        // Display the file upload modal
        showFileUploadModal() {
            this.showFileUpload = true;
            this.resetFileState();
        },

        // Close the file upload modal
        closeFileUploadModal() {
            this.showFileUpload = false;
            this.selectedFile = null;
            this.resetFileState();
        },

        // Handle file upload
        handleFileUpload(event) {
            this.selectedFile = event.target.files[0];
            if (this.selectedFile) {
                this.fileName = this.selectedFile.name; // Simpan nama file
                this.fileSelected = true; // Tandai file sebagai terpilih
            }
        },
        cancelFileSelection() {
            // Menghapus file yang dipilih
            this.selectedFile = null;
            this.fileName = null; // Reset nama file
            this.fileSelected = false; // Tandai file tidak terpilih

            // Reset input file
            const fileInput = document.getElementById("file-upload");
            if (fileInput) fileInput.value = null; // Menghapus nilai input file
        },
        async submitExcelData() {
            if (!this.selectedFile) {
                Swal.fire({
                    title: "Peringatan!",
                    text: "Silakan pilih file terlebih dahulu.",
                    icon: "warning",
                    confirmButtonText: "OK",
                });
                return;
            }

            const formData = new FormData();
            formData.append("file", this.selectedFile); // Kirim file ke backend

            try {
                const response = await fetch("http://localhost:3000/alat/import", {
                    method: "POST",
                    body: formData,
                });

                const result = await response.json();

                if (response.ok) {
                    Swal.fire({
                        title: "Sukses!",
                        text: result.message || "Data siswa berhasil diperbarui.",
                        icon: "success",
                        confirmButtonText: "OK",
                    });
                    this.closeFileUploadModal();
                    this.fetchAlatList();
                } else {
                    Swal.fire({
                        title: "Gagal!",
                        text: result.message || "Terjadi kesalahan saat mengunggah file.",
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                }
            } catch (error) {
                console.error(error);
                alert("Gagal mengunggah file: " + error.message);
            }
        },

        closeModal() {
            this.showModal = false;
            this.resetForm();
        },
        resetForm() {
            this.newAlat = {
                namaAlat: "",
                jumlah: "",
                id_bengkel: "",
            };
            this.editAlatId = null;
            this.isEditMode = false;
        },
        toggleDropdown(index) {
            this.dropdownIndex = this.dropdownIndex === index ? null : index;
        },
        resetFilter() {
            this.searchQuery = "";
            this.rowsPerPage = 5;
            this.currentPage = 1;
        },
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.dropdownIndex = null;
            }
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
                this.dropdownIndex = null;
            }
        },
        getRuangBengkel(bengkelId) {
            const bengkel = this.bengkelList.find(
                (bengkel) => bengkel.id_bengkel === bengkelId
            );
            return bengkel ? bengkel.nama_ruang : "";
        },
        resetFileState() {
            this.fileName = null;
            this.fileSelected = false;
            this.fileError = null;
        },
    },
    mounted() {
        this.fetchBengkelList();
        this.fetchAlatList();
    },
};
</script>

<style scoped>
.btn-import {
    color: #4b6cb7;
    background-color: white;
    justify-content: space-between;
    text-align: left;
    width: 7.5rem;
}

.btn-import:hover {
    background-color: #f7f7f7;
}

/* Modal Styles For Upload Modal */
.modal-overlay-upload {
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

/* Modal Content */
.modal-content-upload {
    background: #ffffff;
    padding: 20px;
    border-radius: 10px;
    width: 500px;
    max-width: 90%;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
    animation: fadeIn 0.3s ease-in-out;
}

/* Modal Header */
.modal-header-upload {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
}

.header-content {
    margin-top: 0.5rem;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
}

.modal-header-upload h5 {
    margin: 0;
    color: #4b6cb7;
}

.modal-header-upload p {
    margin-top: 8px;
    color: #555;
    font-size: 14px;
}

.close-modal-upload {
    font-size: 24px;
    cursor: pointer;
    color: red;
    margin-left: 10px;
}

/* Upload Box */
.upload-box {
    border: 2px dashed #4b6cb7;
    border-radius: 10px;
    padding: 30px;
    background-color: #f9f9f9;
    margin-bottom: 20px;
    cursor: pointer;
    position: relative;
}

.upload-box:hover {
    background-color: #eef3fc;
}

.upload-box-text {
    color: #4b6cb7;
    font-size: 16px;
    margin: 0;
}

.upload-box-input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
}

/* File Info */
.file-info {
    color: #4b6cb7;
    font-size: 14px;
}

.file-error {
    color: red;
    font-size: 14px;
}

/* Submit Button */
.upload-actions {
    margin-top: 20px;
    text-align: center;
}

.modal-footer {
    display: flex;
    justify-content: space-between;
}

.btn {
    padding: 10px 20px;
    cursor: pointer;
}

.btn-cancel {
    background-color: #ffffff;
    /* Merah */
    color: #575656;
    font-weight: 600;
    border: 1px solid #888;
    border-radius: 10px;
}

.btn-cancel:hover {
    background-color: #d8d5d5;
}

.btn-add-alat {
    background-color: #4b6cb7;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 10px;
    cursor: pointer;
}

.btn-add-alat:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

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
    color: white;
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

.form-control {
    width: 16rem;
    padding: 8px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: white;
    color: #274278;
}

.btn_add_alat {
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    border: none;
    margin-bottom: 1rem;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.3s ease;
    font-size: 16px;
}

.btn_add_alat:hover {
    background-color: #0056b3;
    transform: scale(1.05);
}

.header-alat-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 3rem;
}

.header-alat {
    font-weight: bold;
    color: #274278;
    font-size: 1.7rem;
    animation: fadeInDown 1s ease-in-out;
}

.date-inputs {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.tampil-baris {
    display: flex;
    align-items: center;
}

.select-rows {
    padding: 5px;
    border-radius: 4px;
    border: 1px solid #ccc;
    margin: 0 5px;
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
    padding: 5px;
    width: 200px;
}

.search-icon {
    color: #888;
    margin-right: 5px;
}

.info-page {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.select-rows {
    padding: 0.25rem;
    font-size: 1rem;
    line-height: 1.5;
}

.page-info {
    font-size: 0.9rem;
    line-height: 1.5;
    color: #555;
    margin: 0;
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
    margin-top: 20px;
    overflow-x: auto;
}

.data-table th,
.data-table td {
    border: 1px solid #ccc;
    padding: 10px;
    text-align: left;
}

.data-table tbody tr:nth-child(odd) {
    background-color: none;
}

.data-table tbody tr:hover {
    background-color: #f1f1f1;
}

.pagination-container {
    display: flex;
    justify-content: center;
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

/* Dropdown Styles */
.dropdown {
    position: relative;
    display: inline-block;
}

.dropdown-menu-act {
    display: none;
    position: absolute;
    background-color: white;
    min-width: 120px;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    z-index: 1;
    right: 0;
}

.dropdown-menu-act.show {
    display: block;
}

.dropdown-menu-act button {
    width: 100%;
    padding: 8px 12px;
    border: none;
    background: none;
    text-align: left;
    cursor: pointer;
}

.dropdown-menu-act button:hover {
    background-color: #f1f1f1;
}

.import-search-wrapper {
    display: flex;
    justify-content: space-between;
    width: 100%;
    align-items: center;
}

.import-data {
    display: flex;
    align-items: center;
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

@media (max-width: 768px) {

    .data-table th,
    .data-table td {
        font-size: 0.875rem;
        padding: 6px;
    }

    .header-alat {
        font-size: 1.5rem;
    }

    .search-bar-container {
        width: 100%;
        margin-top: 10px;
    }

    .search-input {
        width: 100%;
    }

    .tampil-baris {
        width: 100%;
        margin-bottom: 10px;
    }

    .pagination-info {
        margin: 10px 0;
    }
}

@media screen and (max-width: 450px) {
    .header-alat-container {
        display: block;
        text-align: left;
    }

    .header-alat {
        margin-bottom: 1rem;
    }

    .modal-content-alat {
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

    .import-search-wrapper {
        gap: 0.5rem;
    }
}
</style>
