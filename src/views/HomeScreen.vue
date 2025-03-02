<template>
  <div class="container">
    <h1>Online Marketplace App</h1>

    <div class="auth-section">
      <form @submit.prevent="login">
        <input type="text" v-model="loginData.email" placeholder="Email Address" required />
        <input type="password" v-model="loginData.password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>

      <div class="register-options">
        <!-- Register Buttons -->
        <div class="register-button customer" @mouseover="hover = 'customer'" @mouseleave="hover = ''" @click="openCustomerSignUp">
          <p :class="{ 'hovered': hover === 'customer' }">Sign up as a Customer</p>
        </div>
        <div class="register-button seller" @mouseover="hover = 'seller'" @mouseleave="hover = ''" @click="openSellerSignUp">
          <p :class="{ 'hovered': hover === 'seller' }">Sign up as a Seller</p>
        </div>
      </div>
    </div>

    <!-- Customer Sign Up Modal -->
    <div v-if="showSignUpModalCustomer" class="modal">
      <div class="modal-content">
        <h2>Sign up as a Customer</h2>
        
        <!-- Registration Form -->
        <form @submit.prevent="submitSignUpCustomer">
          <input v-model="customerRegisterData.firstName" type="text" placeholder="First Name" required />
          <input v-model="customerRegisterData.lastName" type="text" placeholder="Last Name" required />
          <input v-model="customerRegisterData.email" type="email" placeholder="Email Address" required />
          <input v-model="customerRegisterData.password" type="password" placeholder="Password" required />
          <input v-model="customerRegisterData.phoneNumber" type="text" placeholder="Phone Number" required />
          <input v-model="customerRegisterData.city" type="text" placeholder="City" required />
          <textarea v-model="customerRegisterData.address" placeholder="Address" required></textarea>
          <button type="submit">Sign Up</button>
        </form>

        <!-- Close Button -->
        <button class="close-btn" @click="closeSignUpModal">Close</button>
      </div>
    </div>


    <!-- Seller Sign Up Modal -->
    <div v-if="showSignUpModalSeller" class="modal">
      <div class="modal-content">
        <h2>Sign up as a Seller</h2>
        
        <!-- Registration Form -->
        <form @submit.prevent="submitSignUpSeller">
          <input v-model="sellerRegisterData.firstName" type="text" placeholder="First Name" required />
          <input v-model="sellerRegisterData.lastName" type="text" placeholder="Last Name" required />
          <input v-model="sellerRegisterData.email" type="email" placeholder="Email Address" required />
          <input v-model="sellerRegisterData.password" type="password" placeholder="Password" required />
          <input v-model="sellerRegisterData.phoneNumber" type="text" placeholder="Phone Number" required />
          <input v-model="sellerRegisterData.storeName" type="text" placeholder="Store Name" required />
          <input v-model="sellerRegisterData.city" type="text" placeholder="City" required />
          <textarea v-model="sellerRegisterData.storeAddress" placeholder="Store Address" required></textarea>
          <button type="submit">Sign Up</button>
        </form>

        <!-- Close Button -->
        <button class="close-btn" @click="closeSignUpModal">Close</button>
      </div>
    </div>
   



  </div>
</template>

<script>
import api from '@/api';  // api klasörü ve index.js dosyasını import et
import { getRoleFromToken } from '@/utils/jwt'; // JWT helper fonksiyonunu import et

export default {
  data() {
    return {
      // Login form data
      loginData: {
        email: '',
        password: '',
      },
      // Customer register form data
      customerRegisterData: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        city: '',
        address: '',
      },
      // Seller register form data
      sellerRegisterData: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        storeName: '',
        city: '',
        storeAddress: '',
      },

      showSignUpModalCustomer: false,  // Modal başlangıçta kapalı
      showSignUpModalSeller: false,

      hover: '',  // Bu değişken hover durumunu tutacak
    };
  },
  methods: {
    async login() {
      try {
        const response = await api.post("/authentication/login", {
          eMailAddress: this.loginData.email,
          password: this.loginData.password
        });

        // Eğer JWT aldıysak, bunu depolayabiliriz (localStorage ya da Vuex)
        const token = response.data;

        localStorage.setItem('jwt', token); // Token'ı localStorage'a kaydediyoruz

        // Buradan sonra token ile işlem yapabiliriz (örneğin, yönlendirme vb.)
        // Örnek: this.$router.push('/dashboard'); // Login olduktan sonra başka bir sayfaya yönlendirme

         // Token'ı decode et ve role bilgisine göre yönlendirme yap
         const role = getRoleFromToken(token);

        if (role === 'SELLER') {
          this.$router.push('/seller/dashboard'); // SELLER sayfasına yönlendir
        } else if (role === 'CUSTOMER') {
          this.$router.push('/customer/home'); // CUSTOMER sayfasına yönlendir
        } else if (role === 'ADMIN') {
          this.$router.push('/admin/dashboard'); // ADMIN sayfasına yönlendir
        }


      } catch (error) {
        console.error("Login failed:", error);
        alert("Login failed! Please check your credentials.");
      }
    },

    openCustomerSignUp() {
      this.showSignUpModalCustomer = true; // Modal'ı açıyoruz
    },

    openSellerSignUp() {
      this.showSignUpModalSeller = true;
    },

    closeSignUpModal() {
      this.showSignUpModalCustomer = false; // Modal'ı kapatıyoruz
      this.showSignUpModalSeller = false;
    },

    async submitSignUpCustomer() {
      try {
        const userData = {
          firstName: this.customerRegisterData.firstName,
          lastName: this.customerRegisterData.lastName,
          eMailAddress: this.customerRegisterData.email,
          password: this.customerRegisterData.password,
          phoneNumber: this.customerRegisterData.phoneNumber,
          city: this.customerRegisterData.city,
          address: this.customerRegisterData.address
        };

        await api.post('/authentication/register/customer', userData);
        alert('Sign up successful!');
        this.closeSignUpModal(); // Kayıt işlemi başarılıysa modal'ı kapatıyoruz
      } catch (error) {
        console.error('Sign up failed:', error);
        alert('Sign up failed. Please try again.');
      }
    },

    async submitSignUpSeller() {
      try {
        const userData = {
          firstName: this.sellerRegisterData.firstName,
          lastName: this.sellerRegisterData.lastName,
          eMailAddress: this.sellerRegisterData.email,
          password: this.sellerRegisterData.password,
          phoneNumber: this.sellerRegisterData.phoneNumber,
          storeName: this.sellerRegisterData.storeName,
          city: this.sellerRegisterData.city,
          storeAddress: this.sellerRegisterData.storeAddress
        };

        await api.post('/authentication/register/seller', userData);
        alert('Sign up successful!');
        this.closeSignUpModal(); // Kayıt işlemi başarılıysa modal'ı kapatıyoruz
      } catch (error) {
        console.error('Sign up failed:', error);
        alert('Sign up failed. Please try again.');
      }
    }



  }
};
</script>

<style scoped>
/* Genel stiller */
.container {
  text-align: center;
  font-family: Arial, sans-serif;
}

/* Başlık */
h1 {
  color: #000080; /* Lacivert */
}
h2 {
  color: #000080; /* Lacivert */
}


/* Giriş butonu */
button {
  background-color: #87CEFA; /* Açık mavi */
  color: #000080; /* Lacivert yazı */
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  transition: transform 0.2s ease-in-out, background-color 0.2s ease-in-out;
  width: 200px;
  max-width: 90%;
  display: block;
  margin: 10px auto;
  font-weight: bold;
}

/* Input alanları */
input, textarea {
  width: 100%;
  max-width: 300px;  /* Input genişliğini sınırlandır */
  padding: 12px;
  margin: 10px auto;  /* Ortalamak için */
  border: 2px solid #87CEFA;
  border-radius: 5px;
  font-size: 16px;
  outline: none;
  display: block;
  transition: border 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

input:focus {
  border-color: #4682B4;
  box-shadow: 0 0 8px rgba(70, 130, 180, 0.5);
}

button:hover {
  background-color: #4682B4; /* Daha koyu mavi */
  transform: scale(1.05);
  color: white; /* Hover'da yazı beyaz olsun */
}

/* Kayıt olma butonlarını düzenleme */
.register-options {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

/* Kayıt butonları */
.register-button {
  background-color: #87CEFA; /* Açık mavi */
  color: #000080; /* Lacivert yazı */
  padding: 15px 20px;
  cursor: pointer;
  font-size: 18px;
  border-radius: 8px;
  text-align: center;
  transition: transform 0.3s ease-in-out, background-color 0.3s ease-in-out;
  width: 200px;
  max-width: 90%;
  display: inline-block;
  font-weight: bold;
}

.register-button:hover {
  background-color: #4682B4;
  transform: scale(1.1);
  color: white; /* Hover'da yazı beyaz olsun */
}

/* Hover efekti için yazı büyütme */
.hovered {
  font-size: 20px;
  font-weight: bold;
}



/* Modal stilleri */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Karartma efekti */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px; /* Modal genişliğini sabitleyelim */
  max-width: 90%; /* Ekran boyutuna göre modal'ın genişliği değişebilir */
  box-sizing: border-box; /* Padding'ler dahil edilerek toplam genişlik hesaplanır */
  overflow-y: auto; /* İçerik fazla olursa kaydırma ekleriz */
}


</style>
