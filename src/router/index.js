import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },

  {
    path: '/ums',
    component: Layout,
    redirect: '/transit/table',
    meta: { title: 'Ums', icon: 'user2' },
    children: [
      {
        path: 'admin',
        component: () => import('@/views/ums/admin/table'),
        meta: { title: '管理员管理', icon: 'admin' }
      },
      {
        path: 'menu',
        component: () => import('@/views/ums/menu/table'),
        meta: { title: '菜单管理', icon: 'sub-menu' }
      },
      {
        path: 'role',
        component: () => import('@/views/ums/role/table'),
        meta: { title: '角色管理', icon: 'role' }
      }
    ]
  },
  {
    path: '/transit',
    component: Layout,
    redirect: '/transit/table',
    name: 'Transit',
    meta: { title: 'ProjectMonitor', icon: 'pm' },
    children: [
      {
        path: 'project',
        name: '项目管理',
        component: () => import('@/views/pm/project/table'),
        meta: { title: '项目管理', icon: 'project' }
      },
      {
        path: 'server',
        name: '服务器管理',
        meta: { title: '服务器管理', icon: 'server2' },
        component: () => import('@/views/pm/server/index'),
        children: [
          {
            path: 'type',
            name: '类别管理',
            component: () => import('@/views/pm/serverType/table'),
            meta: { title: '类别管理', icon: 'type' }
          },
          {
            path: 'management',
            name: '服务器管理',
            component: () => import('@/views/pm/server/table'),
            meta: { title: '服务器管理', icon: 'server2' }
          }
        ]
      },
      {
        path: 'db',
        name: '数据库管理',
        component: () => import('@/views/pm/db/table'),
        meta: { title: '数据库管理', icon: 'db' }
      },
      {
        path: 'ding-talk-group',
        name: '钉钉群组管理',
        component: () => import('@/views/pm/dingTalk/groupTable'),
        meta: { title: '钉钉群组管理', icon: 'group' }
      }
    ]
  },
  {
    path: '/day',
    component: Layout,
    redirect: '/day/table',
    name: 'Day',
    meta: { title: 'DayRecord', icon: 'record' },
    children: [
      {
        path: 'progress',
        name: '进度目标',
        component: () => import('@/views/day/progress/table'),
        meta: { title: 'Progress', icon: 'progress' }
      },
      {
        path: 'timeline',
        name: '时间轴',
        component: () => import('@/views/day/timeline/table'),
        meta: { title: '时间轴', icon: 'timeline' }
      },
      {
        path: 'sleep-record',
        name: '睡眠管理',
        component: () => import('@/views/day/sleep/table'),
        meta: { title: '睡眠管理', icon: 'sleep' }
      },
      {
        path: 'meal-record',
        name: '用餐管理',
        component: () => import('@/views/day/meal/table'),
        meta: { title: '用餐管理', icon: 'meal' }
      }
    ]
  },
  {
    path: '/photo',
    component: Layout,
    redirect: '/photo/album/table',
    name: 'Photo',
    meta: { title: 'Photo', icon: 'record' },
    children: [
      {
        path: 'album',
        name: '相册',
        component: () => import('@/views/photo/album/table'),
        meta: { title: '相册', icon: 'album' }
      },
      {
        path: 'photo',
        name: '照片',
        component: () => import('@/views/photo/photo/table'),
        meta: { title: '照片', icon: 'photo' }
      },
      {
        path: 'photo-view',
        name: '照片墙',
        component: () => import('@/views/photo/photo/table'),
        meta: { title: '照片预览', icon: 'gallery-clas' }
      }
    ]
  },
  {
    path: '/finance',
    component: Layout,
    redirect: '/finance/table',
    name: 'Finance',
    meta: { title: '财务管理', icon: 'record' },
    children: [
      {
        path: 'wish-list',
        name: '愿望清单',
        component: () => import('@/views/finance/wishList/table'),
        meta: { title: '愿望清单', icon: 'wishlist' }
      },
      {
        path: 'alipay',
        name: '支付宝账单',
        component: () => import('@/views/finance/alipay/table'),
        meta: { title: '支付宝账单', icon: 'alipay' }
      },
      {
        path: 'shopping',
        name: '购物清单',
        component: () => import('@/views/finance/shopping/table'),
        meta: { title: '购物清单', icon: 'shopping' }
      },
      {
        path: 'bill-type',
        name: '账单分类',
        component: () => import('@/views/finance/billType/table'),
        meta: { title: '账单分类', icon: 'type' }
      },
      {
        path: 'bill',
        name: '账单管理',
        component: () => import('@/views/finance/bill/table'),
        meta: { title: '账单管理', icon: 'bill2' }
      }
    ]
  },
  {
    path: '/tools',
    component: Layout,
    redirect: '/tools/table',
    name: 'Tools',
    meta: { title: 'Tools', icon: 'setting' },
    children: [
      {
        path: 'sleep-record',
        name: 'Bing壁纸',
        component: () => import('@/views/table/bingImageTable'),
        meta: { title: 'Bing壁纸', icon: 'bing' }
      },
      {
        path: 'account-pass',
        name: 'accountPass',
        component: () => import('@/views/table/accountPassTable'),
        meta: { title: '网络账户管理', icon: 'password' }
      },
      {
        path: 'oss',
        name: 'oss',
        component: () => import('@/views/table/ossTable'),
        meta: { title: 'Oss 管理', icon: 'oss' }
      },
      {
        path: 'unicode',
        name: 'unicode',
        component: () => import('@/views/table/unicode'),
        meta: { title: '艺术字', icon: 'font1' }
      },
      {
        path: 'poem',
        name: 'poem',
        component: () => import('@/views/day/poem/table'),
        meta: { title: '古诗词', icon: 'book' }
      },
      {
        path: 'word',
        name: 'word',
        component: () => import('@/views/day/word/table'),
        meta: { title: '单词本', icon: 'dict' }
      }
    ]
  },
  {
    path: '/bing',
    component: Layout,
    redirect: '/bing/table',
    name: 'Bing',
    meta: { title: 'Bing', icon: 'record' },
    children: [
      {
        path: 'sleep-record',
        name: 'Bing壁纸',
        component: () => import('@/views/table/bingImageTable'),
        meta: { title: 'Bing壁纸', icon: 'bing' }
      }
    ]
  },
  {
    path: '/account-pass',
    component: Layout,
    redirect: '/account-pass/table',
    name: 'accountPass',
    meta: { title: 'accountPass', icon: 'record' },
    children: [
      {
        path: 'account-pass',
        name: 'accountPass',
        component: () => import('@/views/table/accountPassTable'),
        meta: { title: '网络账户管理', icon: 'password' }
      }
    ]
  },
  {
    path: '/oss',
    component: Layout,
    redirect: '/oss/table',
    name: 'Oss',
    meta: { title: 'Oss', icon: 'record' },
    children: [
      {
        path: 'oss',
        name: 'oss',
        component: () => import('@/views/table/ossTable'),
        meta: { title: 'Oss 管理', icon: 'oss' }
      }
    ]
  },

  /*  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: 'Form', icon: 'form' }
      }
    ]
  },*/

  /*  {
    path: '/nested',
    component: Layout,
    redirect: '/nested/menu1',
    name: 'Nested',
    meta: {
      title: 'Nested',
      icon: 'nested'
    },
    children: [
      {
        path: 'menu1',
        component: () => import('@/views/nested/menu1/index'), // Parent router-view
        name: 'Menu1',
        meta: { title: 'Menu1' },
        children: [
          {
            path: 'menu1-1',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'Menu1-1',
            meta: { title: 'Menu1-1' }
          },
          {
            path: 'menu1-2',
            component: () => import('@/views/nested/menu1/menu1-2'),
            name: 'Menu1-2',
            meta: { title: 'Menu1-2' },
            children: [
              {
                path: 'menu1-2-1',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
                name: 'Menu1-2-1',
                meta: { title: 'Menu1-2-1' }
              },
              {
                path: 'menu1-2-2',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
                name: 'Menu1-2-2',
                meta: { title: 'Menu1-2-2' }
              }
            ]
          },
          {
            path: 'menu1-3',
            component: () => import('@/views/nested/menu1/menu1-3'),
            name: 'Menu1-3',
            meta: { title: 'Menu1-3' }
          }
        ]
      },
      {
        path: 'menu2',
        component: () => import('@/views/nested/menu2/index'),
        name: 'Menu2',
        meta: { title: 'menu2' }
      }
    ]
  },*/

  /*
  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  },
*/

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
