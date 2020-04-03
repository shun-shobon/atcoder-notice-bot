import Vue from "vue"
import VueRouter from "vue-router"
import Home from "../views/Home.vue"
import LineSignup from "../views/LineSignup.vue"
import LineRevoke from "../views/LineRevoke.vue"
import Error from "../views/Error.vue"

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/line/signup",
    name: "LineSignup",
    component: LineSignup,
  },
  {
    path: "/line/revoke/:id",
    name: "LineRevoke",
    component: LineRevoke,
  },
  {
    path: "/*",
    name: "Error",
    component: Error,
  },
]

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
})

export default router
