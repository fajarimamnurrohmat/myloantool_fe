<template>
  <div class="col d-flex align-items-center justify-content-center">
    <div class="form-container">
      <div class="text-center mb-4 mt-2">
        <div class="name_brand">MyLoanTool</div>
        <div class="name_desc">Peminjaman Alat Bengkel</div>
      </div>
      <!-- form -->
      <form>
        <div class="mb-4 input-group">
          <span class="input-group-text">
            <i class="fas fa-user" style="color: #182848"></i>
          </span>
          <input
            type="text"
            class="form-control"
            placeholder="Username"
            autocomplete="off"
          />
        </div>
        <div class="mb-4 input-group">
          <span class="input-group-text">
            <i class="fas fa-lock" style="color: #182848"></i>
          </span>
          <input
            :type="passwordFieldType"
            class="form-control"
            placeholder="Password"
            autocomplete="off"
          />
          <span
            class="input-group-text toggle-password"
            @click="togglePasswordVisibility"
          >
            <i :class="passwordFieldIcon" style="color: #182848"></i>
          </span>
        </div>
        <router-link to="/mainsidebar/dashboard">
          <button
            type="submit"
            class="btn btn-custom mt-4"
            style="background-color: white"
          >
            Login
          </button>
        </router-link>
        <a href="#" class="forgot-password">Lupa password?</a>
      </form>
      <!-- form end -->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      passwordFieldType: "password",
      passwordFieldIcon: "fas fa-eye",
    };
  },
  methods: {
    togglePasswordVisibility() {
      if (this.passwordFieldType === "password") {
        this.passwordFieldType = "text";
        this.passwordFieldIcon = "fas fa-eye-slash";
      } else {
        this.passwordFieldType = "password";
        this.passwordFieldIcon = "fas fa-eye";
      }
    },
  },
};
</script>

<style>
input {
  outline: none !important;
  border: none !important;
}

.form-container {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border: none;
  padding: 40px;
  width: 400px;
  border-radius: 20px;
  background: linear-gradient(135deg, #4b6cb7, #182848);
  color: white;
}

.input-group {
  position: relative;
  border-radius: 30px;
  overflow: hidden;
  background-color: #f0f0f0;
}

.input-group-text {
  border-right: none;
}

.form-control {
  border-left: none;
  border-radius: 0;
}

.input-group .form-control:focus {
  box-shadow: none;
}

.input-group-text,
.form-control {
  background-color: transparent;
  border: none;
  color: rgb(5, 5, 5);
  padding: 15px 20px;
}

.forgot-password {
  display: block;
  text-align: center;
  color: rgb(255, 255, 255);
  margin-top: 20px;
  font-size: 0.9rem;
}

.form-control {
  border-radius: 0 30px 30px 0;
}

.toggle-password {
  cursor: pointer;
}

.btn-custom {
  width: 100%;
  padding: 15px;
  border-radius: 30px;
  background-color: #f8c291;
  color: #182848;
  font-weight: bold;
  transition: all 0.3s ease;
  border: none;
  text-align: center;
  margin-top: 40px;
}

.btn-custom:hover {
  background-color: #182848;
  color: #182848;
  box-shadow: 0 8px 15px #4b6cb7;
  transform: translateY(-3px);
}

.btn-custom:active {
  transform: scale(0.95);
}

/* Media query for responsiveness */
@media (max-width: 768px) {
  .form-container {
    width: 90%;
    padding: 20px;
  }
}
</style>
