import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _a93ee018 = () => interopDefault(import('../pages/clinicadmin/index.vue' /* webpackChunkName: "pages/clinicadmin/index" */))
const _16df32f6 = () => interopDefault(import('../pages/login/index.vue' /* webpackChunkName: "pages/login/index" */))
const _00cd84c1 = () => interopDefault(import('../pages/signup/index.vue' /* webpackChunkName: "pages/signup/index" */))
const _3879d31a = () => interopDefault(import('../pages/clinicadmin/service/index.vue' /* webpackChunkName: "pages/clinicadmin/service/index" */))
const _76361b9c = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))

// TODO: remove in Nuxt 3
const emptyFn = () => {}
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onComplete = emptyFn, onAbort) {
  return originalPush.call(this, location, onComplete, onAbort)
}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: decodeURI('/'),
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/clinicadmin",
    component: _a93ee018,
    name: "clinicadmin___en"
  }, {
    path: "/login",
    component: _16df32f6,
    name: "login___en"
  }, {
    path: "/signup",
    component: _00cd84c1,
    name: "signup___en"
  }, {
    path: "/clinicadmin/service",
    component: _3879d31a,
    name: "clinicadmin-service___en"
  }, {
    path: "/",
    component: _76361b9c,
    name: "index___en"
  }],

  fallback: false
}

export function createRouter () {
  return new Router(routerOptions)
}
