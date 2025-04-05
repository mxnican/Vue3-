//引入项目中全部全局组件
import SvgIcon from './SvgIcon/MyIndex.vue'
import Pagination from './Pagination/MyIndex.vue'
import Category from './Category/index.vue'
//引入element-plus提供的全部图标组件（一个对象，里面是200多个 组件名:组件对象）
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

//全局对象
const allGloablComponent: any = { SvgIcon, Pagination, Category }
//对外暴露插件对象
export default {
  //务必叫做install方法
  install(app: any) {
    //app上有component,可用来  注册所有全局组件
    //Object.keys:获取对象全部属性名，封装成数组
    Object.keys(allGloablComponent).forEach((key) => {
      //key是两个属性名字符串
      //在此注册全局组件
      app.component(key, allGloablComponent[key])
    })
    //将element-plus提供的Icon图标注册成全局组件
    //解构出组件名和组件对象，将它们注册成全局组件
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
  },
}
