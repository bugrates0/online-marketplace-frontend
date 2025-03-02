import { createRouter, createWebHistory } from 'vue-router';
import HomeScreen from '@/views/HomeScreen.vue';
import SellerDashboard from '@/views/SellerDashboard.vue';
import CustomerHome from '@/views/CustomerHome.vue';
import AdminDashboard from '@/views/AdminDashboard.vue';

const routes = [
  { path: '/', component: HomeScreen },
  {
    path: '/seller/dashboard',
    name: 'SellerDashboard',
    component: SellerDashboard,
  },
  {
    path: '/customer/home',
    name: 'CustomerHome',
    component: CustomerHome,
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: AdminDashboard,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
