import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/staking',
      name: 'staking',
      component: () => import('../views/Staking.vue')
      
    },
    {
      path: '/proposals',
      name: 'proposals',
      component: () => import('../views/ProposalsView.vue')
    },
    {
      path: '/stats',
      name: 'stats',
      component: () => import('../views/StatsView.vue')
    },
    {
      path: '/all-validators',
      name: 'allValidators',
      component: () => import('../views/AllValidatorsView.vue')
    },
    {
      path: '/create-prop',
      name: 'createProp',
      component: () => import('../views/CreatePropView.vue')
    },
    {
      path: '/alliance',
      name: 'Alliance',
      component: () => import('../views/AllianceView.vue')
    },
    {
      path: '/swap',
      name: 'Swap',
      component: () => import('../views/SwapView.vue')
    },
    { 
      path: '/:pathMatch(.*)*', 
      name: 'NotFound', 
      component: () => import('../views/HomeView.vue')
    }
  ]
})

export default router
