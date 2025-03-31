//引入项目中全部全局组件
import SvgIcon from './SvgIcon/MyIndex.vue'
import Pagination from './Pagination/MyIndex.vue'

//全局对象
const allGloablComponent: any = { SvgIcon, Pagination }
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
  },
}
