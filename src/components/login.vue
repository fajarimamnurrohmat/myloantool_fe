<template>
  <div class="col d-flex align-items-center justify-content-center">
    <div class="form-container">
      <div class="text-center mb-4 mt-2">
        <div class="name_brand">MyLoanTool</div>
        <div class="name_desc">Peminjaman Alat Bengkel</div>
      </div>
      <!-- form -->
      <form @submit.prevent="handleLogin">
        <div class="mb-4 input-group">
          <span class="input-group-text">
            <i class="fas fa-user" style="color: #182848"></i>
          </span>
          <input
            type="text"
            class="form-control"
            placeholder="Username"
            autocomplete="off"
            v-model="username"
            required
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
            v-model="password"
            required
          />
          <span
            class="input-group-text toggle-password"
            @click="togglePasswordVisibility"
          >
            <i :class="passwordFieldIcon" style="color: #182848"></i>
          </span>
        </div>
        <button
          type="submit"
          class="btn btn-custom mt-4"
          :disabled="isLoading"
        >
          <span v-if="isLoading">Logging in...</span>
          <span v-else>Login</span>
        </button>
      </form>
      <!-- form end -->
      <div v-if="errorMessage" class="alert alert-danger mt-3">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      password: '',
      passwordFieldType: "password",
      passwordFieldIcon: "fas fa-eye",
      isLoading: false,
      errorMessage: '',
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
    async handleLogin() {
      this.isLoading = true;
      this.errorMessage = '';

      try {
        const response = await axios.post('http://localhost:3000/authentications', {
          username: this.username,
          password: this.password,
        });

        if (response.data.status === 'success') {
          const { accessToken, refreshToken } = response.data.data;

          // Simpan token
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);

          // Redirect ke dashboard
          this.$router.push('/mainsidebar/dashboard');

          // Mulai interval untuk refresh token
          //this.startTokenRefresh();
        } else {
          this.errorMessage = response.data.message || 'Login gagal.';
        }
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          this.errorMessage = error.response.data.message;
        } else {
          this.errorMessage = 'Terjadi kesalahan. Silakan coba lagi.';
        }
      } finally {
        this.isLoading = false;
      }
    },
    // async refreshAccessToken() {
    //   try {
    //     console.log('Attempting to refresh access token...'); // Debugging
    //     const refreshToken = localStorage.getItem('refreshToken');
    //     const response = await axios.put('http://localhost:3000/authentications', {
    //       refreshToken: refreshToken,
    //     });

    //     if (response.data.status === 'success') {
    //       const { accessToken } = response.data.data;
    //       localStorage.setItem('accessToken', accessToken);
    //       console.log('Access token updated:', accessToken); // Debugging
    //     } else {
    //       console.log('Failed to refresh access token:', response.data.message); // Debugging
    //     }
    //   } catch (error) {
    //     console.log('Error while refreshing access token:', error); // Debugging
    //   }
    // },
    // startTokenRefresh() {
    //   const tokenAge = 50;
    //   const refreshTime = tokenAge - 10; //jadinya setiap 40 detik ada udate accessToken

    //   console.log('Starting token refresh interval...'); // Debugging

    //   this.refreshInterval = setInterval(() => {
    //     console.log('Refreshing token...'); // Debugging
    //     this.refreshAccessToken();
    //   }, refreshTime * 1000); // Menggunakan milidetik
    // },
  },
};
</script>

<style>
.name_brand {
  font-family: "Poppins", sans-serif;
  font-size: 1.35rem;
  font-weight: bold;
  color: #f8c291;
}

.name_desc {
  font-family: "Poppins", sans-serif;
  font-size: 0.8rem;
  color: #f0efef;
}

input {
  outline: none !important;
  border: none !important;
}

.form-container {
  box-shadow: -10px 0 15px rgba(41, 41, 41, 0.151), 10px 0 15px rgba(0, 0, 0, 0.1);
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
  background-color: #ffffff;
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
  width: 150px;
  height: 50px;
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
  color: #f8c291;
  box-shadow: 0 8px 15px #4b6cb7;
  transform: translateY(-3px);
}

.btn-custom:active {
  transform: scale(0.95);
}

@media (max-width: 768px) {
  .form-container {
    width: 90%;
    padding: 20px;
  }
}

.alert {
  padding: 10px;
  border-radius: 5px;
  color: white;
  background-color: #e74c3c;
}
</style>
