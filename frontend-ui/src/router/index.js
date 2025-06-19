import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Locations from '../views/Locations.vue'

const routes = [
  { path: '/', name: 'Dashboard', component: Dashboard },
  { path: '/locations', name: 'Locations', component: Locations },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
