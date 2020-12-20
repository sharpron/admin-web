import { constantRoutes } from '@/router'
import crud from '@/api/menu'
import Layout from '@/layout/index'

const state = {
  routes: [],
  addRoutes: [],
  perms: []
}

function generateRoutes(menus, routes, level) {
  for (const menu of menus) {
    if (menu.hide) {
      continue
    }
    console.log('menu', menu)
    const route = {
      path: menu.path,
      name: menu.title,
      component: createComponent(menu.component),
      meta: { title: menu.title, icon: 'dashboard', affix: true }
    }
    routes.push(route)
    if (menu.children.length) {
      route.children = []
      generateRoutes(menu.children, route.children, level + 1)
    }
  }
}

function createComponent(componentName) {
  if (componentName.toLowerCase() === 'layout') {
    return Layout
  }
  return resolve => require([`@/views/${componentName}`], resolve)
}

function extractPerms(menus, perms) {
  for (const menu of menus) {
    if (menu.perm) {
      perms.push(menu.perm)
    }
    extractPerms(menu.children, perms)
  }
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  SET_PERMS: (state, perms) => {
    state.perms = perms
  }
}

const actions = {
  generateRoutes({ commit }) {
    return new Promise(resolve => {
      crud.query().then(res => {
        console.log('menus', res)
        const routes = []
        generateRoutes(res.data, routes)
        console.log('routes', routes)
        commit('SET_ROUTES', routes)
        console.log(routes)
        const perms = []
        extractPerms(res.data, perms)
        console.log(perms)
        commit('SET_PERMS', perms)
        resolve(routes)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
