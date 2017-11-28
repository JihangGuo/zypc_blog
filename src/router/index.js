import Vue from 'vue'
import Router from 'vue-router'

//引入组件

import  signin from '../components/signin.vue'
import  login from '../components/login.vue'
import admin from '../components/admin.vue'
import document from '../components/document.vue'
import alldocument from '../components/alldocument.vue'
import tag from '../components/tag.vue'
import setting from '../components/setting.vue'
import the_tags from '../components/the_tags.vue'
import edit from '../components/edit.vue'
import detail from '../components/detail.vue'
import collection from '../components/collection.vue'
import recovery from '../components/recovery'
import talk from '../components/talk.vue'

Vue.use(Router);

const routes = [
  { path: '/', redirect: 'login' },
  { path: '/index', redirect: 'login' },
  { path: '/login', component: login },
  { path: '/signin', component: signin },
  {
    path: '/login/:log_name',
    component: login
  },
  { path: '/admin', redirect: '/admin/alldocument' },
  {
    path: '/admin',
    component: admin,
    children: [{
      path: 'edit',
      components: { admin_router: edit }
    }]
  },
 
  {
    path: '/admin',
    component: admin,
    children: [{
      path: 'recovery',
      components: { admin_router: recovery },
      children: [{
        path: 'document',
        components:{recovery_router:document}
      }]
    }]
  },
  {
    path: '/admin',
    component: admin,
    children: [{
      path: 'collection',
      components: { admin_router: collection },
      children: [{
        path: 'document',
        components:{collection_router:document}
      }]
    }]
  },
  {
    path: '/admin',
    component: admin,
    children: [{
      path: 'detail',
      components: { admin_router: detail },
      children: [{
        path: 'page/:blog_id/:index_id',
        components: { detail_router: talk },
      }]
    }]
  },
  {
    path: '/admin',
    component: admin,
    children: [{
      path: 'alldocument',
      components: { admin_router: alldocument }
      }]
    },
  {
    path: '/admin',
    component: admin,
    children: [{
      path: 'tag',
      components: {
        admin_router: tag
      }
    }]
  },
  {
    path: '/admin',
    component: admin,
    children: [{
      path: 'setting',
      components: {
        admin_router: setting
      }
    }]
  },
  {
    path: '/admin',
    component: admin,
    children: [{
      path: 'tag',
      components: { admin_router:tag },
      children: [{
        path: 'the_tags',
        components: { tag_router: the_tags }
      }]
    }]
  },
  {
    path: '/admin',
    component: admin,
    children: [{
      path: 'alldocument',
      components: { admin_router: alldocument },
      children: [{
        path: 'the_tags',
        components: { all_router: the_tags }
      }]
    }]
  }
]

const router = new Router({
  routes
})

export default router


