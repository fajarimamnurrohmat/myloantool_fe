<template>
<!-- Header Section -->
<div class="header-peminjaman-container">
    <h3 class="header-peminjaman">Halaman Peminjaman</h3>
    <button @click="showModal = true" class="btn-add" style="background-color: #007bff">
        <i class="fas fa-plus" style="margin-right: 1rem"></i> Input Peminjaman
    </button>
</div>
<!-- End of Header Section -->

<!-- Start of Modal Section -->
<div v-if="showModal" class="modal-overlay" @click.self="closeModal">
    <!-- Modal Content -->
    <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
            <h4>
                {{
            editIndex !== null
              ? "Edit Data Peminjaman"
              : "Input Data Peminjaman"
          }}
            </h4>
            <span class="close-modal" @click="closeModal">&times;</span>
        </div>
        <!-- End of Modal Header -->
        <!-- Modal Body -->
        <div class="modal-body">
            <!-- form row atas -->
            <div class="form-row">
                <!-- alat -->
                <div class="form-group">
                    <label for="alat">Alat dan Ruang Bengkel</label>
                    <p>Pilih Nama Alat - Ruang Bengkel</p>
                    <select id="alat" class="form-control-alat" v-model="newPeminjaman.id_alat" :disabled="isEditMode">
                        <option disabled value="">Pilih Alat dan Ruang Bengkel</option>
                        <option v-for="alat in alatList" :key="alat.id_alat" :value="alat.id_alat">
                            {{ alat.nama_alat }} - {{ alat.ruang_bengkel }}
                        </option>
                    </select>
                </div>
                <!-- end of alat -->
                <!-- peminjam -->
                <div class="form-group-nama">
                    <label for="namaPeminjam">Nama Peminjam</label>
                    <p>Pilih Nama Siswa - Jurusan</p>
                    <select id="namaPeminjam" class="form-control-peminjaman" v-model="newPeminjaman.nisPeminjam" :disabled="isEditMode">
                        <option disabled value="">Pilih Siswa</option>
                        <option v-for="siswa in siswaList" :key="siswa.nis" :value="siswa.nis">
                            {{ siswa.nama_siswa }} - {{ siswa.jurusan }}
                        </option>
                    </select>
                </div>
                <!-- end of peminjam -->
            </div>
            <!-- end of form row atas -->

            <!-- form row bawah -->
            <div class="form-row">
                <!-- tgl pinjam -->
                <div class="form-group">
                    <label for="tanggalPinjam">Tanggal Pinjam</label>
                    <p>Masukkan tanggal pinjam alat</p>
                    <div class="date-input-wrapper">
                        <input type="date" id="tanggalPinjam" v-model="newPeminjaman.tanggalPinjam" class="date-filter-modal" />
                        <i class="fas fa-calendar-alt calendar-icon-i"></i>
                    </div>
                </div>
                <!-- end of tgl pinjam -->
                <!-- jumlah -->
                <div class="form-group-jumlah">
                    <label for="jumlahAlat">Jumlah Pinjaman</label>
                    <p>Masukkan jumlah alat yang dipinjam</p>
                    <input type="number" id="jumlahAlat" class="form-control-jumlah" v-model="newPeminjaman.jumlahAlat" />
                </div>
                <!-- end of jumlah -->
            </div>
            <!-- form row bawah -->
        </div>
        <!-- End of Modal Body -->
        <!-- Modal Footer -->
        <div class="modal-footer">
            <button @click="addOrUpdatePeminjaman" class="btn_add_peminjaman">
                {{ editIndex !== null ? "Update Data" : "Simpan Data" }}
            </button>
        </div>
        <!-- End of Modal Footer -->
    </div>
    <!-- End of Modal Content -->
</div>
<!-- End of Modal Section -->

<!-- filter wrapper -->
<div class="filter-wrapper">
    <!-- Date Filter Section -->
    <div class="date-inputs">
        <div class="date-input-wrapper">
            <label for="startDate" class="date-sort">Sort Date From:</label>
            <input type="date" id="startDate" v-model="startDate" class="date-filter" />
            <i class="fas fa-calendar-alt calendar-icon"></i>
        </div>
        <div class="date-input-wrapper">
            <label for="endDate" class="date-sort">To:</label>
            <input type="date" id="endDate" v-model="endDate" class="date-filter" />
            <i class="fas fa-calendar-alt calendar-icon"></i>
        </div>
        <!-- filter button section -->
        <div class="filter-buttons">
            <button @click="resetFilter" class="btn-reset" style="height: 2.7rem; width: 3rem">
                <i class="fa fa-sync" aria-hidden="true"></i>
            </button>
            <div class="dropdown d-inline-block">
                <button class="btn-export" type="button" @click="toggleDropdown(index)" :aria-expanded="dropdownIndex === index" style="
              color: #4b6cb7;
              background-color: white;
              width: 6.5rem;
              height: 2.72rem;
            ">
                    <i class="fa-solid fa-arrow-up-from-bracket" style="margin-left: 0.7rem; margin-right: 0.4rem; color: #4b6cb7"></i>
                    Export
                </button>
                <div class="dropdown-menu-exports" :class="{ show: dropdownIndex === index }">
                    <a class="dropdown-item-export" @click="exportData('pdf')" style="color: #4b6cb7">
                        <i class="fa fa-file-pdf" aria-hidden="true" style="margin-left: 0.5rem; margin-right: 0.1rem"></i>
                        .pdf
                    </a>
                    <a class="dropdown-item-export" @click="exportData('csv')" style="color: #4b6cb7">
                        <i class="fa-solid fa-file-csv" aria-hidden="true" style="
                  margin-left: 0.5rem;
                  margin-right: 0.1rem;
                  margin-top: 0.5rem;
                ">
                        </i>
                        .csv
                    </a>
                </div>
            </div>
        </div>
        <!-- filter button section -->
        <!-- search -->
        <div class="search-bar-container">
            <i class="fas fa-search search-icon"></i>
            <input type="text" v-model="searchQuery" class="search-input" style="padding-right: 30px; width: 13rem" placeholder="Cari data..." />
        </div>
        <!-- search -->
    </div>
    <!-- End of Date Filter Section -->
</div>
<!-- End of filter wrapper -->

<!-- Table wrapper -->
<div class="table-wrapper">
    <!-- Info Rows Per Page -->
    <div class="info-page">
        <div style="text-align: left">
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
    <!-- End of Info Rows Per Page -->
    <!-- Table -->
    <table class="data-table">
        <thead>
            <tr>
                <th>No</th>
                <th>
                    Nama Peminjam
                    <span class="material-symbols-outlined swap-sort" @click="toggleSort('nama_siswa')">
                        swap_vert
                    </span>
                </th>
                <th>
                    Alat
                    <span class="material-symbols-outlined swap-sort" @click="toggleSort('nama_alat')">
                        swap_vert
                    </span>
                </th>
                <th>
                    Bengkel
                    <span class="material-symbols-outlined swap-sort" @click="toggleSort('ruang_bengkel')">
                        swap_vert
                    </span>
                </th>
                <th>
                    Tanggal Pinjam<span class="material-symbols-outlined swap-sort" @click="toggleSort('tanggal_pinjam')">
                        swap_vert
                    </span>
                </th>
                <th>
                    Jumlah
                    <span class="material-symbols-outlined swap-sort" @click="toggleSort('jumlah')">
                        swap_vert
                    </span>
                </th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(peminjaman, index) in paginatedPeminjamanList" :key="index">
                <td>{{ index + 1 + (currentPage - 1) * rowsPerPage }}</td>
                <td>{{ peminjaman.nama_siswa }}</td>
                <td>{{ peminjaman.nama_alat }}</td>
                <td>{{ peminjaman.ruang_bengkel }}</td>
                <td>{{ formatDate(peminjaman.tanggal_pinjam) }}</td>
                <td>{{ peminjaman.jumlah }}</td>
                <td>
                    <!-- Action Dropdown -->
                    <div class="dropdown d-inline-block">
                        <button class="btn btn-sm" type="button" @click="toggleDropdown(index)" :aria-expanded="dropdownIndex === index">
                            <i class="fas fa-ellipsis-h"></i>
                        </button>
                        <div class="dropdown-menu-act" :class="{ show: dropdownIndex === index }">
                            <button class="dropdown-item" @click="editPeminjaman(peminjaman)" style="color: #274278">
                                Edit
                            </button>
                            <button @click="openPengembalianModal(peminjaman)" class="dropdown-item" style="color: #274278">
                                Pengembalian
                            </button>
                        </div>
                    </div>
                    <!-- End of Action Dropdown -->
                </td>
            </tr>
            <tr v-if="paginatedPeminjamanList.length === 0">
                <td colspan="7" style="text-align: center">Tidak ada data</td>
            </tr>
        </tbody>
    </table>
    <!--- End of Table -->

    <!-- Start of Modal Pengembalian Section -->
    <div v-if="tampilModal" class="modal-overlay" @click.self="closeModal">
        <!-- Content Modal -->
        <div class="modal-content" style="margin-top: 5rem">
            <!-- Header Modal -->
            <div class="modal-header" style="margin-top: -1rem">
                <h4>Input Data Pengembalian</h4>
                <span class="close-modal" @click="closeModal">&times;</span>
            </div>
            <div class="modal-body">
                <!-- End of Header Modal -->
                <!-- Navigation Text -->
                <div class="nav-text">
                    <span :class="{ active: selectedOption === 'baik' }" @click="selectOption('baik')" style="cursor: pointer">
                        Baik
                    </span>
                    <span :class="{ active: selectedOption === 'bermasalah' }" @click="selectOption('bermasalah')" style="cursor: pointer">
                        Bermasalah
                    </span>
                </div>
                <!-- Conditional Rendering for 'Baik' Content -->
                <div v-if="selectedOption === 'baik'">
                    <!-- form row atas -->
                    <div class="form-row">
                        <!-- alat -->
                        <div class="form-group">
                            <label for="alat">Alat dan Ruang Bengkel</label>
                            <p>Pilih Nama Alat - Ruang Bengkel</p>
                            <select id="alat" class="form-control-alat" v-model="newPeminjaman.id_alat" :disabled="isEditMode">
                                <option disabled value="">
                                    Pilih Alat dan Ruang Bengkel
                                </option>
                                <option v-for="alat in alatList" :key="alat.id_alat" :value="alat.id_alat" disabled>
                                    {{ alat.nama_alat }} - {{ alat.ruang_bengkel }}
                                </option>
                            </select>
                        </div>
                        <!-- end of alat -->
                        <!-- peminjam -->
                        <div class="form-group-nama">
                            <label for="namaPeminjam">Nama Peminjam</label>
                            <p>Pilih Nama Siswa - Jurusan</p>
                            <select id="namaPeminjam" class="form-control-peminjaman" v-model="newPeminjaman.nisPeminjam" :disabled="isEditMode">
                                <option disabled value="">Pilih Siswa</option>
                                <option v-for="siswa in siswaList" :key="siswa.nis" :value="siswa.nis" disabled>
                                    {{ siswa.nama_siswa }} - {{ siswa.jurusan }}
                                </option>
                            </select>
                        </div>
                        <!-- end of peminjam -->
                    </div>
                    <!-- form row atas -->

                    <!-- form row tengah -->
                    <div class="form-row">
                        <!-- tgl pinjam -->
                        <div class="form-group">
                            <label for="tanggalPinjam">Tanggal Pinjam</label>
                            <p>Masukkan tanggal pinjam alat</p>
                            <div class="date-input-wrapper">
                                <input type="date" id="tanggalPinjam" v-model="newPeminjaman.tanggalPinjam" class="date-filter-modal" disabled/>
                                <i class="fas fa-calendar-alt calendar-icon-i"></i>
                            </div>
                        </div>
                        <!-- end of tgl pinjam -->
                        <!-- jumlah -->
                        <div class="form-group-jumlah">
                            <label for="jumlahAlat">Jumlah Pinjaman</label>
                            <p>Masukkan jumlah alat yang dipinjam</p>
                            <input type="number" id="jumlahAlat" class="form-control-jumlah" v-model="newPeminjaman.jumlahAlat" disabled />
                        </div>
                        <!-- end of jumlah -->
                    </div>
                    <!-- form row tengah -->

                    <hr style="color: white" />

                    <!-- form row bawah -->
                    <div class="form-row">
                        <!-- tgl pengembalian -->
                        <div class="form-group">
                            <label for="tanggalPengembalian">Tanggal Pengembalian</label>
                            <p>Masukkan tanggal pengembalian alat</p>
                            <div class="date-input-wrapper">
                                <input type="date" id="tanggalPengembalian" v-model="newPengembalian.tanggalPengembalian" class="date-filter" style="width: 15.7rem" />
                                <i class="fas fa-calendar-alt calendar-icon"></i>
                            </div>
                        </div>
                        <!-- end of tgl pengembalian -->
                        <!-- jumlah pengembalian-->
                        <div class="form-group-jumlah">
                            <label for="jumlahAlat">Jumlah Pengembalian</label>
                            <p>Masukkan jumlah alat yang dikembalikan</p>
                            <input type="number" id="jumlahAlat" class="form-control-jumlah" v-model="newPengembalian.jumlahAlatDikembalikan" />
                        </div>
                        <!-- end of jumlah pengembalian -->
                    </div>
                    <!-- end of form row bawah -->
                    <button @click="addPengembalian" class="btn_add_peminjaman">
                        Simpan Data
                    </button>
                </div>
                <!-- End of Content Modal Baik -->

                <!-- Conditional Rendering for 'Bermasalah' Content -->
                <div v-if="selectedOption === 'bermasalah'">
                    <!-- form row atas -->
                    <div class="form-row">
                        <!-- alat -->
                        <div class="form-group">
                            <label for="alat">Alat dan Ruang Bengkel</label>
                            <p>Pilih Nama Alat - Ruang Bengkel</p>
                            <select id="alat" class="form-control-alat" v-model="newPeminjaman.id_alat" :disabled="isEditMode">
                                <option disabled value="">
                                    Pilih Alat dan Ruang Bengkel
                                </option>
                                <option v-for="alat in alatList" :key="alat.id_alat" :value="alat.id_alat" disabled>
                                    {{ alat.nama_alat }} - {{ alat.ruang_bengkel }}
                                </option>
                            </select>
                        </div>
                        <!-- end of alat -->
                        <!-- peminjam -->
                        <div class="form-group-nama">
                            <label for="namaPeminjam">Nama Peminjam</label>
                            <p>Pilih Nama Siswa - Jurusan</p>
                            <select id="namaPeminjam" class="form-control-peminjaman" v-model="newPeminjaman.nisPeminjam" :disabled="isEditMode">
                                <option disabled value="">Pilih Siswa</option>
                                <option v-for="siswa in siswaList" :key="siswa.nis" :value="siswa.nis" disabled>
                                    {{ siswa.nama_siswa }} - {{ siswa.jurusan }}
                                </option>
                            </select>
                        </div>
                        <!-- end of peminjam -->
                    </div>
                    <!-- end of form row atas -->

                    <!-- form row tengah -->
                    <div class="form-row">
                        <!-- tgl pinjam -->
                        <div class="form-group">
                            <label for="tanggalPinjam">Tanggal Pinjam</label>
                            <p>Masukkan tanggal pinjam alat</p>
                            <div class="date-input-wrapper">
                                <input type="date" id="tanggalPinjam" v-model="newPeminjaman.tanggalPinjam" class="date-filter-modal" disabled/>
                                <i class="fas fa-calendar-alt calendar-icon-i"></i>
                            </div>
                        </div>
                        <!-- end of tgl pinjam -->
                        <!-- jumlah -->
                        <div class="form-group-jumlah">
                            <label for="jumlahAlat">Jumlah Pinjaman</label>
                            <p>Masukkan jumlah alat yang dipinjam</p>
                            <input type="number" id="jumlahAlat" class="form-control-jumlah" v-model="newPeminjaman.jumlahAlat" disabled/>
                        </div>
                        <!-- end of jumlah -->
                    </div>
                    <!-- end of form row tengah -->

                    <hr style="color: white" />

                    <!-- form row bawah -->
                    <div class="form-row">
                        <!-- tgl pengembalian -->
                        <div class="form-group">
                            <label for="tanggalPengembalian">Tanggal Pengembalian</label>
                            <p>Masukkan tanggal pengembalian alat</p>
                            <div class="date-input-wrapper">
                                <input type="date" id="tanggalPengembalian" v-model="newPengembalianBermasalah.tanggalPermasalahan" class="date-filter" style="width: 15.7rem" />
                                <i class="fas fa-calendar-alt calendar-icon"></i>
                            </div>
                        </div>
                        <!-- end of tgl pengembalian -->
                        <!-- kondisi alat -->
                        <div class="form-group kondisi-alat">
                            <label for="kondisiAlat">Kondisi Alat</label>
                            <p>Pilih Kondisi Alat</p>
                            <select v-model="newPengembalianBermasalah.kondisi" class="select-condi">
                                <option disabled value="">Pilih Kondisi</option>
                                <option value="rusak">Rusak</option>
                                <option value="hilang">Hilang</option>
                            </select>
                        </div>
                        <!-- end of kondisi alat -->
                        <!-- jml alat rusak -->
                        <div class="form-group alat-rusak">
                            <label for="jumlahAlatRusak">Jumlah Kerusakan</label>
                            <p>Jumlah Kerusakan Alat</p>
                            <input type="number" id="jumlahAlatRusak" class="form-control" v-model="newPengembalianBermasalah.jumlahAlatBermasalah" />
                        </div>
                        <!-- end of jml alat rusak -->
                    </div>
                    <!-- form row bawah -->
                    <button @click="addPengembalianBermasalah" class="btn_add_peminjaman">
                        Simpan Data
                    </button>
                </div>
                <!-- End of Content Modal Baik -->
            </div>
            <!-- End of Body Modal -->
        </div>
        <!-- End of Content Modal Pengembalian -->
    </div>
    <!-- End of Modal Section -->

    <!-- Pagination -->
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
    <!-- End of Pagination -->
</div>
</template>

<script>
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Papa from "papaparse";
import Swal from "sweetalert2";

export default {
    data() {
        return {
            showModal: false,
            tampilModal: false,
            selectedOption: "baik",
            isClosing: false,
            sortBy: "tanggal_pinjam",
            sortDirection: "asc",
            newPeminjaman: {
                id_peminjaman: "",
                nisPeminjam: "",
                id_alat: "",
                jumlahAlat: "",
                tanggalPinjam: "",
            },
            newPengembalian: {
                tanggalPengembalian: "",
                jumlahAlatDikembalikan: "",
            },
            newPengembalianBermasalah: {
                tanggalPermasalahan: "",
                kondisi: "",
                jumlahAlatBermasalah: "",
            },
            peminjamanList: [],
            alatList: [],
            siswaList: [],
            startDate: "",
            endDate: "",
            rowsPerPage: 5,
            currentPage: 1,
            searchQuery: "",
            editIndex: null,
            dropdownIndex: null,
        };
    },

    methods: {
        //format tanggal
        formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString("id-ID", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            });
        },
        // fetching data alat
        async fetchDataAlat() {
            try {
                const token = localStorage.getItem("accessToken");
                const response = await axios.get("http://localhost:3000/alat", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.data.status === "success") {
                    this.alatList = response.data.data.alat;
                }
            } catch (error) {
                console.error("Gagal mengambil data alat:", error);
            }
        },

        // fetching data siswa
        async fetchDataSiswa() {
            try {
                const token = localStorage.getItem("accessToken");
                const response = await axios.get("http://localhost:3000/siswa", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.data.status === "success") {
                    this.siswaList = response.data.data.siswa;
                }
            } catch (error) {
                console.error("Gagal mengambil data siswa:", error);
            }
        },

        // fetching data peminjaman
        async fetchDataPeminjaman() {
            try {
                const token = localStorage.getItem("accessToken");
                const response = await axios.get("http://localhost:3000/peminjaman", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.data.status === "success") {
                    this.peminjamanList = response.data.data.peminjaman;
                }
            } catch (error) {
                console.error("Gagal mengambil data peminjaman:", error);
            }
        },

        // update peminjaman function
        async updatePeminjaman() {
            //console.log("Data newPeminjaman sebelum validasi:", this.newPeminjaman);
            if (
                this.newPeminjaman.nisPeminjam &&
                this.newPeminjaman.id_alat &&
                this.newPeminjaman.tanggalPinjam &&
                this.newPeminjaman.jumlahAlat
            ) {
                try {
                    const dataToUpdate = {
                        nis: this.newPeminjaman.nisPeminjam,
                        id_alat: this.newPeminjaman.id_alat,
                        tanggal_pinjam: this.newPeminjaman.tanggalPinjam,
                        jumlah: this.newPeminjaman.jumlahAlat,
                    };

                    const token = localStorage.getItem("accessToken");
                    const response = await axios.put(
                        `http://localhost:3000/peminjaman/${this.newPeminjaman.id_peminjaman}`,
                        dataToUpdate, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    if (
                        (response.status === 200 || response.status === 201) &&
                        response.data.status === "success"
                    ) {
                        // Update list langsung tanpa reload
                        await this.fetchDataPeminjaman();

                        this.resetForm();
                        this.closeModal();

                        Swal.fire({
                            title: "Sukses!",
                            text: "Data peminjaman berhasil diperbarui.",
                            icon: "success",
                            confirmButtonText: "OK",
                        });
                    } else {
                        throw new Error("Terjadi kesalahan saat memperbarui data.");
                    }
                } catch (error) {
                    Swal.fire({
                        title: "Error!",
                        text: `Gagal memperbarui data: ${error.message}`,
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                }
            } else {
                Swal.fire({
                    title: "Error!",
                    text: "Mohon isi semua data!",
                    icon: "error",
                    confirmButtonText: "OK",
                });
            }
        },

        // add peminjaman function
        async addPeminjaman() {
            //console.log(JSON.stringify(this.newPeminjaman));
            if (
                this.newPeminjaman.nisPeminjam &&
                this.newPeminjaman.id_alat &&
                this.newPeminjaman.tanggalPinjam &&
                this.newPeminjaman.jumlahAlat
            ) {
                try {
                    const dataToSend = {
                        nis: this.newPeminjaman.nisPeminjam,
                        id_alat: this.newPeminjaman.id_alat,
                        tanggal_pinjam: this.newPeminjaman.tanggalPinjam,
                        jumlah: this.newPeminjaman.jumlahAlat,
                    };

                    const token = localStorage.getItem("accessToken");
                    const response = await axios.post(
                        "http://localhost:3000/peminjaman",
                        dataToSend, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    if (
                        (response.status === 200 || response.status === 201) &&
                        response.data.status === "success"
                    ) {
                        await this.fetchDataPeminjaman();

                        this.resetForm();
                        this.closeModal();

                        Swal.fire({
                            title: "Sukses!",
                            text: "Data peminjaman berhasil disimpan.",
                            icon: "success",
                            confirmButtonText: "OK",
                        });
                    } else {
                        throw new Error("Terjadi kesalahan saat menyimpan data.");
                    }
                } catch (error) {
                    Swal.fire({
                        title: "Error!",
                        text: `Gagal menyimpan data: ${error.message}`,
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                }
            } else {
                Swal.fire({
                    title: "Error!",
                    text: "Mohon isi semua data!",
                    icon: "error",
                    confirmButtonText: "OK",
                });
            }
        },

        // add pengembalian function
        async addPengembalian() {
            //console.log(JSON.stringify(this.newPengembalian));
            if (
                this.newPeminjaman.id_peminjaman &&
                this.newPengembalian.tanggalPengembalian &&
                this.newPengembalian.jumlahAlatDikembalikan
            ) {
                try {
                    const dataToSend = {
                        id_peminjaman: this.newPeminjaman.id_peminjaman,
                        tgl_kembali: this.newPengembalian.tanggalPengembalian,
                        jumlah: this.newPengembalian.jumlahAlatDikembalikan,
                    };

                    const token = localStorage.getItem("accessToken");
                    const response = await axios.post(
                        "http://localhost:3000/pengembalian",
                        dataToSend, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    if (
                        (response.status === 200 || response.status === 201) &&
                        response.data.status === "success"
                    ) {
                        await this.fetchDataPeminjaman();

                        this.resetForm();
                        this.closeModal();

                        Swal.fire({
                            title: "Sukses!",
                            text: "Data pengembalian berhasil disimpan.",
                            icon: "success",
                            confirmButtonText: "OK",
                        });
                    } else {
                        throw new Error("Terjadi kesalahan saat menyimpan data.");
                    }
                } catch (error) {
                    Swal.fire({
                        title: "Error!",
                        text: `Gagal menyimpan data: ${error.message}`,
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                }
            } else {
                Swal.fire({
                    title: "Error!",
                    text: "Mohon isi semua data!",
                    icon: "error",
                    confirmButtonText: "OK",
                });
            }
        },

        // add pengembalian bermasalah function
        async addPengembalianBermasalah() {
            //console.log(JSON.stringify(this.newPengembalianBermasalah));
            if (
                this.newPeminjaman.id_peminjaman &&
                this.newPengembalianBermasalah.tanggalPermasalahan &&
                this.newPengembalianBermasalah.kondisi &&
                this.newPengembalianBermasalah.jumlahAlatBermasalah
            ) {
                try {
                    const dataToSend = {
                        id_peminjaman: this.newPeminjaman.id_peminjaman,
                        tgl_permasalahan: this.newPengembalianBermasalah.tanggalPermasalahan,
                        kondisi: this.newPengembalianBermasalah.kondisi,
                        jumlah: this.newPengembalianBermasalah.jumlahAlatBermasalah,
                    };

                    const token = localStorage.getItem("accessToken");
                    const response = await axios.post(
                        "http://localhost:3000/alat-bermasalah",
                        dataToSend, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    if (
                        (response.status === 200 || response.status === 201) &&
                        response.data.status === "success"
                    ) {
                        await this.fetchDataPeminjaman();

                        this.resetForm();
                        this.closeModal();

                        Swal.fire({
                            title: "Sukses!",
                            text: "Data bermasalah berhasil disimpan.",
                            icon: "success",
                            confirmButtonText: "OK",
                        });
                    } else {
                        throw new Error("Terjadi kesalahan saat menyimpan data.");
                    }
                } catch (error) {
                    Swal.fire({
                        title: "Error!",
                        text: `Gagal menyimpan data: ${error.message}`,
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                }
            } else {
                Swal.fire({
                    title: "Error!",
                    text: "Mohon isi semua data!",
                    icon: "error",
                    confirmButtonText: "OK",
                });
            }
        },

        addOrUpdatePeminjaman() {
            if (this.editIndex !== null) {
                this.updatePeminjaman();
            } else {
                this.addPeminjaman();
            }
        },
        resetPengembalianForm() {
            this.newPengembalian = {
                tanggalPengembalian: "",
                jumlahAlatRusak: "",
            };
        },
        selectOption(option) {
            this.selectedOption = option;
        },
        editPeminjaman(peminjaman) {
            // Debugging untuk memastikan objek peminjaman diterima
            //console.log("Peminjaman yang diterima:", peminjaman);

            this.editPeminjamanId = peminjaman.id_peminjaman; // Menyimpan ID peminjaman untuk referensi

            const siswa = this.siswaList.find(
                (s) => s.nama_siswa === peminjaman.nama_siswa
            );
            const alat = this.alatList.find(
                (alat) => alat.nama_alat === peminjaman.nama_alat
            );

            const tanggalPinjam = new Date(
                peminjaman.tanggal_pinjam
            ).toLocaleDateString("en-CA"); // Format yyyy-mm-dd

            this.newPeminjaman = {
                id_peminjaman: peminjaman.id_peminjaman,
                nisPeminjam: siswa ? siswa.nis : "",
                id_alat: alat ? alat.id_alat : null,
                jumlahAlat: peminjaman.jumlah,
                tanggalPinjam: tanggalPinjam,
            };

            //console.log("Data Peminjaman yang baru:", this.newPeminjaman);

            this.editIndex = this.peminjamanList.findIndex(
                (b) => b.id_peminjaman === peminjaman.id_peminjaman
            );

            // Menampilkan modal edit
            this.showModal = true;
        },
        openPengembalianModal(peminjaman) {
            // Debugging untuk memastikan objek peminjaman diterima
            //console.log("Peminjaman yang diterima:", peminjaman);

            // Mengaktifkan mode edit
            this.editPeminjamanId = peminjaman.id_peminjaman; // Menyimpan ID peminjaman untuk referensi

            const siswa = this.siswaList.find(
                (s) => s.nama_siswa === peminjaman.nama_siswa
            );
            const alat = this.alatList.find(
                (alat) => alat.nama_alat === peminjaman.nama_alat
            );

            const tanggalPinjam = new Date(
                peminjaman.tanggal_pinjam
            ).toLocaleDateString("en-CA"); // Format yyyy-mm-dd

            this.newPeminjaman = {
                id_peminjaman: peminjaman.id_peminjaman,
                nisPeminjam: siswa ? siswa.nis : "",
                id_alat: alat ? alat.id_alat : null,
                jumlahAlat: peminjaman.jumlah,
                tanggalPinjam: tanggalPinjam,
            };

            //console.log("Data Peminjaman yang baru:", this.newPeminjaman);

            this.editIndex = this.peminjamanList.findIndex(
                (b) => b.id_peminjaman === peminjaman.id_peminjaman
            );

            // Menampilkan modal edit
            this.tampilModal = true;
        },
        closeModal() {
            this.isClosing = true;
            this.resetForm();
            const modalContent = document.querySelector(".modal-content");
            modalContent.classList.add("closing");
            setTimeout(() => {
                this.showModal = false;
                this.tampilModal = false;
                this.isClosing = false;
                modalContent.classList.remove("closing");
            }, 300);
        },
        resetForm() {
            this.newPeminjaman = {
                nisPeminjam: "",
                id_alat: "",
                jumlahAlat: "",
                tanggalPinjam: "",
            };
            this.newPengembalian = {
                tanggalPengembalian: "",
                jumlahAlatRusak: "",
            };
            this.newPengembalianBermasalah = {
                tanggalPermasalahan: "",
                kondisi: "",
                jumlahAlatBermasalah: "",
            };
            this.showCondi = "";
            this.editIndex = null;
        },
        toggleDropdown(index) {
            this.dropdownIndex = this.dropdownIndex === index ? null : index;
        },
        filterByDate() {
            this.currentPage = 1;
        },
        resetFilter() {
            this.startDate = "";
            this.endDate = "";
            this.filterByDate();
        },
        exportData(format) {
            if (format === "pdf") {
                this.exportPDF();
            } else if (format === "csv") {
                this.exportCSV();
            }
        },
        exportPDF() {
            const doc = new jsPDF();

            doc.text("Daftar Peminjaman belum dikembalikan", 14, 16);
            doc.autoTable({
                startY: 20,
                head: [
                    ["Nama Peminjam", "Alat", "Bengkel", "Tanggal Pinjam", "Jumlah Alat"],
                ],
                body: this.filteredPeminjamanList.map((peminjaman) => [
                    peminjaman.nama_siswa,
                    peminjaman.nama_alat,
                    peminjaman.ruang_bengkel,
                    this.formatDate (peminjaman.tanggal_pinjam),
                    peminjaman.jumlah,
                ]),
            });

            doc.save("peminjaman.pdf");
        },
        exportCSV() {
            const csv = Papa.unparse({
                fields: [
                    "Nama Peminjam",
                    "Alat",
                    "Bengkel",
                    "Tanggal Pinjam",
                    "Jumlah Alat",
                ],
                data: this.filteredPeminjamanList.map((peminjaman) => [
                    peminjaman.nama_siswa,
                    peminjaman.nama_alat,
                    peminjaman.ruang_bengkel,
                    this.formatDate(peminjaman.tanggal_pinjam),
                    peminjaman.jumlah,
                ]),
            });

            const blob = new Blob([csv], {
                type: "text/csv;charset=utf-8;",
            });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);

            link.setAttribute("href", url);
            link.setAttribute("download", "peminjaman.csv");
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
        toggleSort(column) {
            if (this.sortBy === column) {
                this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
            } else {
                this.sortBy = column;
                this.sortDirection = "asc";
            }
        },
    },
    computed: {
        pageInfo() {
            const totalData = this.peminjamanList.length;
            const startIndex = (this.currentPage - 1) * this.rowsPerPage + 1;
            const endIndex = Math.min(startIndex + this.rowsPerPage - 1, totalData);
            return `Menampilkan ${startIndex} sampai ${endIndex} dari ${totalData} data`;
        },
        filteredPeminjamanList() {
            let filteredList = this.peminjamanList;

            // Filter by search query
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                filteredList = filteredList.filter((peminjaman) => {
                    return (
                        peminjaman.nama_siswa.toLowerCase().includes(query) ||
                        peminjaman.nama_alat.toLowerCase().includes(query) ||
                        peminjaman.ruang_bengkel.toLowerCase().includes(query) ||
                        peminjaman.tanggal_pinjam.toLowerCase().includes(query)
                    );
                });
            }

            // Filter by date range
            if (this.startDate && this.endDate) {
                filteredList = filteredList.filter((peminjaman) => {
                    const tanggalPinjam = new Date(peminjaman.tanggal_pinjam); // Perbaikan properti tanggal
                    return (
                        tanggalPinjam >= new Date(this.startDate) &&
                        tanggalPinjam <= new Date(this.endDate)
                    );
                });
            }

            // Sort by selected column and direction
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
        paginatedPeminjamanList() {
            const start = (this.currentPage - 1) * this.rowsPerPage;
            const end = start + this.rowsPerPage;
            return this.filteredPeminjamanList.slice(start, end);
        },
        totalPages() {
            return Math.ceil(this.filteredPeminjamanList.length / this.rowsPerPage);
        },
    },
    watch: {
        rowsPerPage() {
            this.currentPage = 1;
        },
    },
    mounted() {
        // Panggil metode fetch ketika komponen dimuat
        this.fetchDataAlat();
        this.fetchDataSiswa();
        this.fetchDataPeminjaman();
        //this.fetchDataBengkel();
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

.form-group.kondisi-alat {
    display: flex;
    flex-direction: column;
    margin-left: 0.4rem;
}

.form-group.kondisi-alat label {
    font-weight: bold;
}

.form-group.kondisi-alat select {
    margin-top: -0rem;
    width: 8rem;
    height: 2.6rem;
    border-radius: 4px;
    border: 1px solid #ffffff;
    background-color: #f9f9f9;
}

.form-group.alat-rusak {
    margin-left: -2.5rem;
    margin-top: 0.13rem;
}

.form-group.alat-rusak label {
    font-size: 0.9rem;
    font-weight: bold;
}

.form-group.alat-rusak input {
    height: 2.7rem;
    width: 10rem;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

.form-group-nama {
    flex: 1;
    margin-left: -4rem;
}

.form-group-nama label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

.form-group-jumlah {
    flex: 1;
    margin-left: -4rem;
}

.form-group-jumlah label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

.date-input-wrapper {
    position: relative;
    display: inline-block;
}

.calendar-icon {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    color: #7b8291;
    pointer-events: none;
}

.calendar-icon-i {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    color: #7b8291;
    pointer-events: none;
}

.select-condi {
    width: 6.3rem;
    padding: 0.4rem;
    margin-top: 1.2rem;
    height: 2.5rem;
    background-color: white;
    border-radius: 5px;
    border-color: solid #6e6d6d;
    color: #000000;
}

.date-input-wrapper:hover .calendar-icon {
    color: #636468;
}

.modal-content {
    background: #274278 !important;
    padding: 20px;
    border-radius: 10px;
    width: 40rem !important;
    max-width: 100% !important;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    animation: fadeIn 0.3s ease-in-out;
    transition: fadeOut 0.3s ease-out;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;
}

.header-peminjaman-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 2rem;
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

.form-control {
    width: 100%;
    padding: 8px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.form-control-peminjaman {
    width: 100%;
    padding: 8px;
    font-size: 14px;
    border: 1px solid #ccc;
    background-color: white;
    color: #000000;
    border-radius: 4px;
    width: 16rem;
    height: 2.5rem;
}

.form-control-alat {
    width: 100%;
    padding: 8px;
    font-size: 14px;
    border: 1px solid #ccc;
    background-color: white;
    color: #000000;
    border-radius: 4px;
    width: 16rem;
    height: 2.5rem;
}

.form-control-peminjaman {
    width: 100%;
    padding: 8px;
    font-size: 14px;
    border: 1px solid #ccc;
    background-color: white;
    color: #000000;
    border-radius: 4px;
    width: 19.4rem;
    height: 2.5rem;
}

.form-control-bengkel {
    width: 100%;
    padding: 8px;
    font-size: 14px;
    border: 1px solid #ccc;
    background-color: white;
    color: #000000;
    border-radius: 4px;
    width: 16rem;
    height: 2.5rem;
}

.form-control-jumlah {
    width: 100%;
    padding: 8px;
    font-size: 14px;
    border: 1px solid #ccc;
    background-color: white;
    color: #000000;
    border-radius: 4px;
    width: 5.58rem;
    height: 2.7rem;
}

.filter-wrapper {
    width: 100%;
    /* overflow-x: auto; */
    background-color: white;
    margin-top: 0.2rem !important;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.table-wrapper {
    width: 100%;
    overflow-x: auto;
    background-color: white;
    margin-top: 1rem !important;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.search-bar-container {
    position: relative;
    display: inline-block;
    margin-left: 1.5rem;
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

.nav-text span {
    font-size: 16px;
    font-weight: bold;
    color: white;
}

.nav-text span.active {
    text-decoration: underline;
    color: #f30202;
}

.header-peminjaman {
    font-weight: bold;
    font-size: 1.7rem;
    color: #274278;
    margin-top: 1rem;
    margin-bottom: 1.5rem;
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

.search-icon {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #7b8291;
    pointer-events: none;
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

.search-input,
.select-rows {
    padding: 5px;
    border: 1px solid #fff;
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
    text-align: center;
}

.data-table tbody tr:nth-child(odd) {
    background-color: none;
}

.swap-sort {
    cursor: pointer;
    font-size: 1rem;
    color: gray;
    transition: color 0.2s;
}

.swap-sort:hover {
    color: black;
}

.data-table tbody tr:hover {
    background-color: #f1f1f1;
}

/* Dropdown Styling */
.dropdown-menu-act {
    display: none;
    position: absolute;
    top: 100%;
    right: auto;
    left: 1rem;
    background-color: #fff;
    width: 8.7rem;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    z-index: 1;
    border-radius: 5px;
    padding: 10px;
    max-height: 300px;
    /* overflow-y: auto; */
    transform: translateX(-50%);
    text-align: left;
}

.dropdown-menu-act.show {
    display: block;
}

.dropdown-menu-act button:hover {
    background-color: #f1f1f1;
    color: #274278;
    font-weight: 600;
}

.dropdown-item {
    margin-top: 0.3rem;
}

/* Dropdown Styling */
.dropdown-menu-exports {
    display: none;
    position: absolute;
    top: 100%;
    right: auto;
    left: 3.3rem;
    background-color: #fff;
    width: 6.5rem;
    box-shadow: 0px 0.2rem 0.5rem 0px rgba(73, 73, 73, 0.2);
    z-index: 1;
    border-radius: 5px;
    padding: 10px;
    max-height: 26rem;
    overflow-y: auto;
    margin-top: 5px;
    transform: translateX(-50%);
    text-align: left;
}

.dropdown-menu-exports.show {
    display: block;
}
/* end of dropdown style */

.button-row {
    display: flex;
    gap: 1rem;
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: 1rem;
}

.btn-pengembalian {
    background-color: #274278;
    color: white;
    border-color: white;
    border-radius: 1rem;
    height: 100%;
    padding: 0.7rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    cursor: pointer;
}

.date-inputs {
    display: flex;
    gap: 20px;
    align-items: center;
}

.date-sort {
    color: #7a7979;
    font-weight: 300;
}

.date-inputs label {
    font-weight: bold;
    margin-right: 10px;
}

.date-filter {
    padding: 0.5rem 0.9rem;
    width: 13rem;
    border: 1px solid #d3d2d2 !important;
    border-radius: 5px;
    background-color: white;
    color: #7b8291;
}

.date-filter-modal {
    padding: 0.5rem 0.9rem;
    width: 16rem;
    border: 1px solid #d3d2d2 !important;
    border-radius: 5px;
    background-color: white;
    color: #7b8291;
}

.filter-buttons {
    display: flex;
    margin-left: auto;
}

.filter-buttons button {
    border-radius: 5px;
    height: 2rem;
    width: 2.5rem;
    padding: 0.2rem;
}

.filter-buttons button i {
    font-size: 1rem;
}

.btn-reset {
    background-color: #ffffff;
    border: 1px solid #d3d2d2 !important;
    color: #4b6cb7;
    padding: 10px 20px;
    cursor: pointer;
    margin-right: 0.5rem;
    transition: background-color 0.3s ease-in-out;
}

.btn-filter,
.btn-export {
    border-radius: 5px;
    border: 1px solid #d3d2d2 !important;
    cursor: pointer;
    text-align: left;
    margin-right: -4rem;
}

.btn-reset:hover {
    background-color: #f5f5f5;
}

.pagination-container {
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 15px;
}

.nav-text {
    margin-bottom: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1rem;
    text-align: center;
}

.nav-text span {
    flex: 1;
    text-align: center;
    cursor: pointer;
    color: rgb(199, 199, 199);
    font-weight: 400;
}

.nav-text span:first-child {
    text-align: center;
    margin-left: -1rem;
}

.nav-text span:last-child {
    text-align: center;
    margin-left: -2rem;
}

.nav-text span.active {
    font-weight: bold;
    color: rgb(255, 255, 255);
    border-bottom: 2px solid rgb(255, 255, 255);
}

.calendar-icon {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    color: #7b8291;
    pointer-events: none;
}

@media screen and (max-width: 450px) {
    .modal-content {
        width: 90% !important;
    }

    .header-peminjaman-container {
        display: block;
        text-align: left;
    }

    .header-peminjaman {
        margin-bottom: 1rem;
    }

    .btn-add {
        width: auto;
        margin-bottom: 1rem;
    }

    .filter-wrapper,
    .date-inputs,
    .date-input-wrapper,
    .date-input-wrapper {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        width: 100%;
    }

    .date-input-wrapper {
        width: 100%;
    }

    .date-filter {
        width: 100%;
    }

    .date-filter-modal {
        padding: 0.5rem 0.9rem;
        width: 90%;
        border: 1px solid #d3d2d2 !important;
        border-radius: 5px;
        background-color: white;
        color: #7b8291;
    }

    .calendar-icon {
        position: absolute;
        right: 1rem;
        top: 70%;
        transform: translateY(-50%);
        font-size: 1.2rem;
        pointer-events: none;
    }

    .calendar-icon-i {
        position: absolute;
        right: 3rem;
        top: 50%;
        transform: translateY(-50%);
        font-size: 1.2rem;
        color: #7b8291;
        pointer-events: none;
    }

    .filter-buttons {
        display: flex;
        gap: 0.5rem;
        align-items: flex-start;
        margin-left: -11rem;
    }

    .btn-reset,
    .btn-export {
        width: auto;
        height: 2.7rem;
    }

    .modal-header h4 {
        font-size: 1.5rem;
    }

    .form-control {
        font-size: 2rem;
        padding: 10px;
    }

    .modal-body .form-row {
        flex-direction: column;
        gap: 3px;
    }

    .form-group-nama {
        margin-top: 0.5rem;
        margin-left: 0rem;
    }

    .form-group {
        margin-top: 0.5rem;
        width: 90%;
    }

    .form-control-alat {
        width: 90%;
    }

    .form-control-peminjaman {
        width: 90%;
    }

    .form-control-bengkel {
        width: 90%;
    }

    .form-group-jumlah {
        margin-top: 0.5rem;
        margin-left: 0.2rem;
    }

    .btn_add_peminjaman {
        width: 100%;
        padding: 10px;
        font-size: 14px;
    }
}
</style>
