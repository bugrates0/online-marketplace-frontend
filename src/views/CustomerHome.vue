<template>
  <div class="customer-home">
    <div class="tabs">
      <button :class="{ active: activeTab === 1 }" @click="setActiveTab(1)">Listed Products</button>
      <button :class="{ active: activeTab === 2 }" @click="setActiveTab(2)">My Orders</button>
      <button :class="{ active: activeTab === 3 }" @click="setActiveTab(3)">My Cart</button>
    </div>

    <!-- Listed Products Tab -->
    <div v-if="activeTab === 1" class="products-tab">
      <h2>Listed Products</h2>
      <div v-if="products.length === 0" class="no-products">No products available</div>
      <div v-else>
        <div v-for="product in products" :key="product.productId" class="product">
          <h3>{{ product.productName }}</h3>
          <div v-for="listedProduct in product.listedProducts" :key="listedProduct.listedProductId" class="listed-product">
            <p><strong>Brand:</strong> {{ listedProduct.brand }}</p>
            <p><strong>Description:</strong> {{ listedProduct.description }}</p>
            <p><strong>Price:</strong> TL{{ listedProduct.price }}</p>
            <p><strong>Stock Quantity:</strong> {{ listedProduct.stockQuantity }}</p>
            <button @click="addToCart(listedProduct.listedProductId)">Add to Cart</button>
          </div>
        </div>
      </div>
    </div>

    <!-- My Orders Tab -->
    <div v-if="activeTab === 2" class="orders-tab">
      <h2>My Orders</h2>
      <div v-if="orders.length === 0" class="no-orders">No orders yet</div>
      <div v-else>
        <div v-for="order in orders" :key="order.orderId" class="order">
          <h3>Order ID: {{ order.orderId }}</h3>
          <p><strong>Total Amount:</strong> ${{ order.totalAmount }}</p>
          <p><strong>Ordered At:</strong> {{ new Date(order.orderedAt).toLocaleString() }}</p>
          <div v-for="item in order.orderItemResponses" :key="item.orderItemId" class="order-item">
            <p><strong>Product:</strong> {{ item.productName }}</p>
            <p><strong>Brand:</strong> {{ item.brand }}</p>
            <p><strong>Store:</strong> {{ item.storeName }}</p>
            <p><strong>Unit Price:</strong> TL{{ item.unitPrice }}</p>
            <p><strong>Quantity:</strong> {{ item.quantity }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- My Cart Tab -->
    <div v-if="activeTab === 3" class="cart-tab">
      <h2>My Cart</h2>
      <p v-if="loadingCart">Loading...</p>
      <p v-else-if="cart.length === 0">Your cart is empty.</p>
      <table v-else>
        <thead>
          <tr>
            <th>Store</th>
            <th>Product</th>
            <th>Brand</th>
            <th>Quantity</th>
            <th>Total Price</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in cart" :key="item.cartItemId">
            <td>{{ item.storeName }}</td>
            <td>{{ item.productName }}</td>
            <td>{{ item.brand }}</td>
            <td>{{ item.quantity }}</td>
            <td>{{ item.totalPrice }}</td>
            <td>
              <button @click="removeFromCart(item.listedProductId)">Remove</button>
            </td>
          </tr>
        </tbody>
      </table>
      <button v-if="cart.length > 0" @click="placeOrder">Place Order</button>
    </div>


  </div>
</template>

<script>
import api from '@/api';  // api klasörü ve index.js dosyasını import et

export default {
  data() {
    return {
      activeTab: 1,
      products: [],
      orders: [],
      cart: [],
      loadingCart: false
    };
  },
  methods: {
    setActiveTab(tabIndex) {
      this.activeTab = tabIndex;
      if (tabIndex === 1 && this.products.length === 0) {
        this.fetchListedProducts();
      }
      if (tabIndex === 2 && this.orders.length === 0) {
        this.fetchMyOrders();
      }
      if (tabIndex === 3) {
        this.fetchCart();
      }
    },

    async fetchListedProducts() {
      try {
        const response = await api.get('/products/listed-products');
        const data = response.data;

        this.products = data;
        console.log(this.products);

      } catch (error) {
        console.error("Error fetching listed products:", error);
      }
    },

    async fetchMyOrders() {
      try {
        const response = await api.get('/orders');
        const data = await response.data;
        this.orders = data;
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    },

    async removeFromCart(listedProductId) {
      try {
        await api.delete(`/cart/${listedProductId}`);
        this.cart = this.cart.filter(item => item.listedProductId !== listedProductId);
      } catch (error) {
        console.error("Error removing item from cart:", error);
        alert("Failed to remove item from cart.");
      }
    },

    async fetchCart() {
      this.loadingCart = true;
      try {
        const response = await api.get('/cart');
        this.cart = response.data;
        console.log(response.data);

      } catch (error) {
        console.error("Error fetching cart:", error);
        alert("Failed to fetch cart items.");
      } finally {
        this.loadingCart = false;
      }
    },


    async addToCart(listedProductId) {
      try {
        await api.post(`/cart/${listedProductId}`);
        alert("Product added to cart!");
      } catch (error) {
        console.error("Error adding product to cart:", error);
        alert("Failed to add product to cart.");
      }
    },

    async placeOrder() {
      try {
        await api.post('/orders');
        alert("Order placed successfully!");
        this.cart = [];
      } catch (error) {
        console.error("Error placing order:", error);
        alert("Failed to place order.");
      }
    }

  },
  mounted() {
    this.fetchListedProducts();
    this.fetchMyOrders();
  }
};
</script>

<style scoped>
.customer-home {
  padding: 80px;
}

.tabs {
  position: absolute; /* Sekmeleri sabitler */
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

.products-tab, .orders-tab, .cart-tab {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.product, .order {
  margin-bottom: 20px;
}

.no-products, .no-orders {
  text-align: center;
  font-size: 18px;
  color: #999;
}

.listed-product {
  padding: 10px;
  background-color: #f9f9f9;
  margin-bottom: 10px;
  border-radius: 5px;
}

.order-item {
  padding: 10px;
  background-color: #f9f9f9;
  margin-bottom: 10px;
  border-radius: 5px;
}

.order-item p {
  margin: 5px 0;
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


.cart-tab table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.cart-tab th, .cart-tab td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}

.cart-tab th {
  background-color: #f4f4f4;
}

</style>
