<template>
  <div class="seller-dashboard">
    <!-- Sekme Menü -->
    <div class="tabs">
      <button 
        :class="{ active: activeTab === 'listProduct' }" 
        @click="setActiveTab('listProduct')">
        List A Product
      </button>
      <button 
        :class="{ active: activeTab === 'incomingOrders' }" 
        @click="setActiveTab('incomingOrders')">
        Incoming Orders
      </button>
    </div>

    <!-- List A Product Form -->
    <div v-if="activeTab === 'listProduct'" class="list-product">
      <h3>List A Product</h3>
      <form @submit.prevent="submitProductForm">
        <div class="form-group">
          <label for="productId">Product ID:</label>
          <input v-model="productForm.productId" type="number" id="productId" required />
        </div>
        <div class="form-group">
          <label for="brand">Brand:</label>
          <input v-model="productForm.brand" type="text" id="brand" required />
        </div>
        <div class="form-group">
          <label for="description">Description:</label>
          <textarea v-model="productForm.description" id="description" required></textarea>
        </div>
        <div class="form-group">
          <label for="price">Price:</label>
          <input v-model="productForm.price" type="number" id="price" required />
        </div>
        <div class="form-group">
          <label for="stockQuantity">Stock Quantity:</label>
          <input v-model="productForm.stockQuantity" type="number" id="stockQuantity" required />
        </div>
        <button type="submit">List Product</button>
      </form>
    </div>

    <!-- Incoming Orders -->
    <div v-if="activeTab === 'incomingOrders'" class="incoming-orders">
      <h3>Incoming Orders</h3>
      <div v-if="orders.length === 0">No incoming orders.</div>
      <ul v-else>
        <li v-for="order in orders" :key="order.orderItemId">
          <div><strong>Order ID:</strong> {{ order.orderItemId }}</div>
          <div><strong>Customer:</strong> {{ order.customerName }} ({{ order.customerMailAddress }})</div>
          <div><strong>Product Name:</strong> {{ order.productName }}</div>
          <div><strong>Brand:</strong> {{ order.brand }}</div>
          <div><strong>Quantity:</strong> {{ order.quantity }}</div>
          <div><strong>Price:</strong> {{ order.unitPrice }} TL</div>
          <div><strong>Ordered At:</strong> {{ new Date(order.orderedAt).toLocaleString() }}</div>
          <div><strong>Address:</strong> {{ order.customerAddress }}, {{ order.customerCity }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>


<script>
import api from '@/api';  // api klasörü ve index.js dosyasını import et


export default {
  data() {
    return {
      activeTab: 'listProduct', // Varsayılan sekme
      productForm: {
        productId: '',
        brand: '',
        description: '',
        price: '',
        stockQuantity: ''
      },
      orders: [] // Incoming orders için veri
    };
  },
  methods: {
    // Sekme değiştirme fonksiyonu
    setActiveTab(tab) {
      this.activeTab = tab;
      if (tab === 'incomingOrders') {
        this.fetchIncomingOrders();
      }
    },

    // Ürün listeleme formunu gönderme
    async submitProductForm() {
      const formData = { 
        productId: Number(this.productForm.productId),
        brand: this.productForm.brand,
        description: this.productForm.description,
        price: Number(this.productForm.price),
        stockQuantity: Number(this.productForm.stockQuantity) };
      // Post request atma
      await api.post(`/products/${formData.productId}/listed-products`, formData)
        .then(response => {
          alert('Product listed successfully!' + response);
          this.resetProductForm();
        })
        .catch(error => {
          console.error('Error listing product:', error);
        });
    },

    // Formu sıfırlama
    resetProductForm() {
      this.productForm = {
        productId: '',
        brand: '',
        description: '',
        price: '',
        stockQuantity: ''
      };
    },

    // Incoming orders'ı almak
    async fetchIncomingOrders() {
      await api.get('/incoming-orders')
        .then(response => {
          this.orders = response.data;
        })
        .catch(error => {
          console.error('Error fetching orders:', error);
        });
    }
  }
};
</script>


<style scoped>
.seller-dashboard {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center; /* Dashboard içeriğini ortalar */
  justify-content: center;
  height: 100vh; /* Sayfa yüksekliğini tam doldurur */
}

.tabs {
  position: fixed; /* Sekmeleri sabitler */
  top: 20px; /* Üstten mesafe */
  left: 20px; /* Soldan mesafe */
  margin-bottom: 20px;
  display: flex;
  flex-direction: row; /* Sekmeleri dikeyde sıralar */
  gap: 10px; /* Sekmeler arasına boşluk ekler */
}

.tabs button {
  padding: 10px;
  margin-right: 10px;
  cursor: pointer;
  border: none;
  background-color: #87CEFA;
  border-radius: 5px;
}

.tabs button.active {
  background-color: rgba(70, 130, 180, 0.5);
  color: white;
}

.form-group {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  align-items: center; /* Form öğelerini ortalar */
}

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

button[type="submit"] {
  margin-top: 20px;
}

.incoming-orders {
  margin-top: 140px; /* Butonlardan aşağıya kaydır */
  width: 100%;
  text-align: center;
  justify-content: center;

}


/* Incoming Orders içindeki liste */
.incoming-orders ul {
  display: grid;
  list-style: none;
  grid-template-columns: repeat(3, 1fr); /* 3 sütun */
  gap: 15px;
  justify-content: center;
  padding: 0;
  max-width: 900px; /* Maksimum genişlik */
  margin: 0 auto;
}

/* Her bir sipariş kartı */
.incoming-orders li {
  background-color: #87CEFA;
  padding: 15px;
  border-radius: 5px;
  min-width: 250px;
  max-width: 280px;
  word-wrap: break-word;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
}

.incoming-orders li div {
  margin-bottom: 10px;
}

/* Responsive düzenleme */
@media (max-width: 900px) {
  .incoming-orders ul {
    grid-template-columns: repeat(2, 1fr); /* Küçük ekranlarda 2 sütuna düş */
  }
}

@media (max-width: 600px) {
  .incoming-orders ul {
    grid-template-columns: repeat(1, 1fr); /* Daha küçük ekranlarda tek sütun */
  }
}

.incoming-orders li div {
  margin-bottom: 5px;
}
</style>
