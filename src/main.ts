import { createApp } from 'vue'
//引入element-plus插件与样式
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
//配置element-plus国际化
import zhCn from 'element-plus/es/locale/lang/zh-cn'
//svg插件需要配置代码
import 'virtual:svg-icons-register'
//引入自定义插件对象：注册整个项目的全局组件
import gloalComponent from './components/index'
//引入模板的全局样式
import './styles/index.scss'
//引入路由
import router from './router'
//引入仓库
import pinia from './store'

//获取应用实例对象
const app = createApp(App)
//安装ElementPlus插件，并配置国际化
app.use(ElementPlus, {
  locale: zhCn,
})

//安装自定义插件
app.use(gloalComponent)
//安装仓库
app.use(pinia)
//注册模板路由
app.use(router)
//引入路由鉴权文件
import './permisstion'
//挂载应用到挂载点上
app.mount('#app')
