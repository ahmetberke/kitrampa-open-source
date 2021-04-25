/* eslint-disable */
import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/components/Pages/Home.vue'
import User from '@/components/Pages/User.vue'
import Popup from '@/components/Popup'
import Settings from '@/components/Pages/Settings'
import setAccount from '@/components/Pages/Settings/Account'
import setProfile from '@/components/Pages/Settings/Profile'
import NewBook from '@/components/Pages/NewBook'



Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      components: {
        default: Home,
        popup: null
      }
    },
    {
      path: '/kullanici/:username',
      name: 'User',
      components: {
        default: User,
        popup: null
      }
    },
    {
      path: '/yenikitap',
      name: 'NewBook',
      components: {
        default: NewBook,
        popup: null
      }
    },
    {
      path: '/kayit',
      name: 'Register',
      components: {
        default: Home,
        popup: Popup
      }
    },
    {
      path: '/giris',
      name: 'Login',
      components: {
        default: Home,
        popup: Popup,
      }
    },
    {
      path: '/onayla/:id',
      name: 'EmailVerificate',
      components: {
        default: Home,
        popup: Popup
      }
    },
    {
      path: '/ayarlar',
      name: 'Settings',
      components:{
        default: Settings
      },
      children : [
        {
          path:'',
          redirect:'hesap'
        },
        {
          path: 'hesap',
          components : {
            default: Settings,
            settings: setAccount
          }
        },
        {
          path: 'profil',
          components : {
            default: Settings,
            settings: setProfile
          }
        }
      ]
    }
  ]
})
