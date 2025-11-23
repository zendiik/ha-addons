import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: () => import('@/views/Dashboard.vue'),
      meta: { title: 'Dashboard' }
    },
    {
      path: '/energy',
      name: 'energy',
      component: () => import('@/views/Energy.vue'),
      meta: { title: 'Energy' }
    },
    {
      path: '/infrastructure',
      name: 'infrastructure',
      component: () => import('@/views/Infrastructure.vue'),
      meta: { title: 'Infrastructure' }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/Settings.vue'),
      meta: { title: 'Settings' }
    }
  ]
})

router.beforeEach((to, from, next) => {
  // Update page title
  document.title = to.meta.title ? `${to.meta.title} | Vue Dashboard` : 'Vue Dashboard'
  next()
})

export default router
