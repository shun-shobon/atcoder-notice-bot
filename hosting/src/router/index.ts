import Vue from "vue"
import VueRouter from "vue-router"
import Home from "../views/Home.vue"
import LineSignup from "../views/LineSignup.vue"

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
]

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
})

export default router
