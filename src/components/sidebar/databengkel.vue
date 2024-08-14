<template>
  <div style="text-align: left">
    <h3 class="header-bengkel">Halaman Data Bengkel</h3>
  </div>
  <div class="bordered-form">
    <div class="form-row">
      <div class="form-group">
        <label for="namaBengkel">Nama Bengkel</label>
        <input
          type="text"
          id="namaBengkel"
          class="form-control"
          placeholder="Masukkan nama bengkel"
        />
      </div>
      <div class="form-group">
        <label for="jurusan">Jurusan</label>
        <input
          type="text"
          id="jurusan"
          class="form-control"
          placeholder="Masukkan jurusan"
        />
      </div>
    </div>
    <div style="margin-top: 20px; text-align: right">
      <button class="btn_add_bengkel" id="btn_add_bengkel" @click="">
        <i class="fas fa-plus"></i> Input Data
      </button>
    </div>
  </div>
</template>

<style>
.header-bengkel {
  font-weight: bold;
  font-style: italic;
  color: #274278;
  font-size: 1.7rem;
  margin-bottom: 10px;
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
</style>
