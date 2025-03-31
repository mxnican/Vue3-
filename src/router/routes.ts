//对外暴露配置路由(常量路由)
export const constantRoute = [
  {
    //登录
    path: '/login',
    component: () => import('../views/login/index.vue'),
    name: 'login', //命名路由
  },
  {
    //登录成功后展示数据
    path: '/',
    component: () => import('../layout/index.vue'),
    name: 'layout',
    children: [
      {
        path: '/home',
        component: () => import('../views/home/index.vue'),
      },
    ],
  },
  {
    //404
    path: '/404',
    component: () => import('../views/404/index.vue'),
    name: '404',
  },
  {
    //任意路由。重定向到404
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    name: 'any',
  },
]
