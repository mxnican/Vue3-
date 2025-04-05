Vue3后台管理系统-项目日记

本文详细记录了项目开发过程，以及遇到各种bug的解决，希望可以帮助也在做本项目的同学避错

3.26

用vite构建vue3项目

安装pnpm，然后在创建的文件夹的根目录下pnpm create vite初始化项目，进入项目文件夹安装pnpm依赖，然后运行程序，得到项目端口号 http://localhost:5173/

项目配置

项目初始化

项目初始化，在package中配置"dev": "vite --open", 运行：pnpm run dev自动打开端口

安装配置eslint,用于检测ts代码，保证代码质量

快速生成结构指令

快速生成结构指令：v3ts,使用插件vue vscode snippts

3.27

项目配置

配置格式化工具

1. 继续配置eslint，由于生成文件不同（新版是js文件），跳过了1.2 修改.eslintrc.cjs配置文件
   校验时控制台运行pnpm run lint，查看问题，然后pnpm run fix，自动改代码变成正确格式
2. 配置prettier格式化工具，保证代码美观（也是通过pnpm run lint去检测语法，如果出现不规范格式,通过pnpm run fix 修改）
3. 配置stylelint（格式化css代码，检查css语法错误与不合理的写法，指定css书写顺序等），出现module未定义的问题，于是将.stylelintrc.cjs配置文件module.exports =改成export default
4. 运行pnpm run format的时候，会把代码直接格式化

配置git相关工具

1. 配置husky(018包含上传代码到gitee远程仓库的方法)是用于提交代码至远程仓库之前，触发git hook(git在客户端的钩子)，然后执行pnpm run format来自动的格式化我们的代码。
2. 由于需要用到git，这里下载配置了一下git再继续
3. 使用git bash上传代码至gitee，出现 git commit -m报错：Author identity unknow，发现报错原因是需要先在bash运行姓名和邮箱：git config --global user.name "MXN"和git config --global user.email "wang1307186@163.com"
4. 右键bash，paste可黏贴内容
5. 上传文件至远程时，用户名是mxnican(具体步骤可见018)
6. 之后继续配置husky,vscode目录出现.husky目录，在这个目录下面会有一个pre-commit文件，该文件是git在客户端保留的一个钩子，一旦向远程仓库提交代码，就会调用
7. 配置完husky，执行$ git commit -m '提交代码'时报错：
   'node' is not recognized as an internal or external command,
   operable program or batch file.
    ELIFECYCLE  Command failed with exit code 1.
   husky - pre-commit hook exited with code 1 (error)
   分析原因后首先排除了eslint的问题，由于在bash执行pnpm run format也会报类似错：
   'node' 不是内部或外部命令，也不是可运行的程序
   或批处理文件。
    ELIFECYCLE  Command failed with exit code 1.
   而在终端上可以正常运行，之后可以从此继续分析
   直接运行钩子脚本少打了个空格也有这个报错：./ .husky/pre-commit
   

这让我开始觉得是哪里写错导致的了...

现在已经确定：在bash上能看到node和pnpm版本号，说明安装没问题

明天上午再尝试解决一下，不行就先下一步

3.28

测试报错

1. 今天继续测试这个问题，发现删掉钩子中的pnpm run format，可以正常提交，说明一定是这句话出的问题
2. 依旧找不到原因，暂时放在这里，（反正可以先用终端）等后面如果需要在钩子中配置更多检测规则时再看

提交代码到仓库的操作

提交代码到仓库的操作总结：git add .，git commit -m '修改说明'(使用钩子中内容格式化)，git push

项目配置

1. 配置commitLint

配置commitLint,用于规范团队成员commit信息编写，在husky生成了新的钩子（使提交代码至远程仓库时需要带着subject限制，比如git commit -m 'feat: addH1'这里依旧会报node相关错误，所以了解即可）

2. 强制使用pnpm包管理器工具

强制使用pnpm包管理器工具(统一包管理器工具，防止下的依赖版本不同) 此处报错process未定义，查阅后发现因为process.env被弃用，使用import.meta.env替代。

3. 集成element-plus插件

集成element-plus插件：安装：pnpm i element-plus

引入element-plus插件与样式,出现找不到css的问题，重启解决



使用：



4. src别名的配置

src别名的配置:vite.config.ts和tsconfig.json（使用@无效果）



5. 环境变量的配置

（开发环境、测试环境和生产环境）

可通过import.meta.env获取环境变量（当前是开发环境）





6. SVG图标配置

使用的是阿里图标库，安装配置，设置图标放在src/assets/icons中，在入口文件main中引入

7. 使用svg图标（封装组件）

assets文件夹下新建icons文件夹，其中新建svg文件，在阿里图标库中找到相应图标后复制svg代码，直接放到新建的该文件中。（在svg文件标题右键复制路径，可在浏览器看到此图片）

在App.vue中使用：xlink:href指定路径，fill指定图标颜色，宽高用style设置

    <!-- svg是图标外层容器节点，内部要与use标签结合使用 -->
    <svg style="width:30px;height: 30px;">
      <!-- 利用use的xlink:href属性 -->
      <use xlink:href="#icon-fly" fill="red"></use>
    </svg>

为了方便，将svg封装成组件：(用defineProps从App组件向该组件传值，指定svg图标路径、颜色、大小等)

    //components/SvgIcon/MyIndex.vue
    <template>
      <div>
        <!-- svg是图标外层容器节点，内部要与use标签结合使用 -->
         <!-- kv一致省略v： -->
        <svg :style={width,height}>
          <!-- 利用use的xlink : href 属性设置使用哪个图标# icon-图标名字，full属性设置图标颜色 -->
          <use :xlink:href="prefix+name" :fill=color></use>
        </svg>
      </div>
    </template>
    
    <script setup lang="ts">
    //接收父组件传来的参数
    defineProps({
      //xlink:href属性的前缀
      prefix:{
        type:String,
        //设置默认值
        default:'#icon-'
      },
      //接收使用图标的名字
      name:String,
      //接收颜色
      color:{
        type:String,
        //默认本身颜色
        default:''
      },
      //接收图标大小
      width:{
        type:String,
        default:'16px'
      },
      height:{
        type:String,
        default:'16px'
      }
    })
    </script>
    
    <style scoped></style>

App.vue

    //模板
    <svg-icon name="home" color="blue" width="100px" height="100px"></svg-icon>
    //setup
    import SvgIcon from './components/SvgIcon/MyIndex.vue'

8. 注册svg全局组件（用自定义插件统一注册）

svg用的很多，为了避免重复引入(import)，所以要注册成全局，又考虑到全局组件也有很多，比如还有分页器

所以用自定义插件对象gloalComponent，来一次性注册全部全局组件：在components文件夹中创建暴露index.ts插件对象，main.ts中引入安装，在组件模板中直接用

    //直接注册一个全局组件svg的写法：main.ts
        import SvgIcon from './components/SvgIcon/MyIndex.vue'
        app.component('SvgIcon', SvgIcon)
    
    
    //一次性注册所有全局组件：
        //main.ts
            //引入自定义插件对象：注册整个项目的全局组件
            import gloalComponent from './components/index'
            //安装自定义插件
            app.use(gloalComponent)
    
        //index.ts
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
    	//App.vue
            <template>
              <div>
                <h1>SVG测试</h1>
                <!-- 全局组件，可直接使用 -->
                <Pagination></Pagination>
                <svg-icon name="home" color="blue" width="100px" height="100px"></svg-icon>
              </div>
            </template>

在main.ts中报错找不到模块“virtual:svg-icons-register”或其相应的类型声明,解决：

    //vite-env.d.ts
    declare module 'virtual:svg-icons-register';

9.集成scss

可使用scss样式语法

    <style scoped lang="scss"></style>

添加全局样式：

1. 在src/styles目录下创建一个index.scss文件
2. main.ts中引入
       //引入模板的全局样式
       import './styles/index.scss'

1. 在styles中新创建一个清除默认样式的reset.scss，在index.scss中引入@import './reset.scss'
   可以看到，此时全局样式已应用。
2. 在styles中新建variable.scss，用于为项目提供scss全局变量（index.scss全局样式文件中没有办法使用全局$变量）
3. 在vite.config.ts文件配置variable.scss,出现报错[sass] Can't find stylesheet to import.
   
   这里把路径改成@/styles/variable.scss，居然解决了
4. 配置scss全局变量举例：
       //variable.scss
       $color:yellow;
       
       //App.vue
       <style scoped lang="scss">
       div{
         h1{
           color: $color;
         }
       }
       </style>

注：这里还有一个javascriptEnabled: true,类型不匹配相关的错，后来配置mock把vite.config.ts的暴露改成箭头函数后就恢复了

3.29

mock接口配置

1. 安装依赖pnpm i vite-plugin-mock@2.9.6,npm i mockjs@1.1.0
2. 在 vite.config.js 配置文件启用插件。command用于检测当前开发的环境（mock只能在开发阶段用）
3. 在根目录创建mock文件夹:去创建我们需要mock数据与接口，在里面配置user.ts
   在user.ts中，首先定义了一个函数createUserList()，它能返回一个包含两个用户信息的数组，然后对外暴露一个数组，其中包含两个接口：登录假接口，获取用户信息假接口
4. pnpm安装axios，pnpm install axios,来测试造出的这两个接口是否可用：
       //测试假接口能否使用
       import axios from 'axios'
       //登录接口
       axios({
         url: '/api/user/login',
         method: 'post',
         data: {
           username: 'admin',
           password: '111111',
         },
       }) 
   出现使用mock导致项目无法启动的问题：
   经测试把mock文件夹删掉就正常了，经过检查是vite-plugin-mock@2.9.6 依赖旧版 esbuild@0.11.3的问题，其他组件依赖新版 esbuild@0.25.1，pnpm 的严格依赖隔离导致两个版本共存，执行pnpm add vite-plugin-mock@2.9.8提升mock版本，问题解决。
   
   于是第4步测试成功
   
   

axios二次封装(axios onMounted)

为了使用请求拦截器（处理业务，比如开始进度条、请求头携带公共参数）和响应拦截器（处理业务，比如进度条结束、简化服务器返回的数据、处理http网络错误）

在根目录下创建utils/request.ts：1.创建 axios实例、2.request实例添加请求与响应拦截器、3.对外暴露

注意：

1. 第一步时：开发环境.env.development中，将基础变量进行修改：VITE_APP_BASE_API = '/api'(因为前面设置的mock接口路径都有/api)  ）
2. 其实这里面的axios和request打印出来会发现是一样的，都是axios实例，只是request上有请求响应拦截器，存在基本配置，而前者没有
3. 请求拦截器中的config配置对象，里面包含请求方式、请求地址、基础路径、超时时间等，最重要的是其中的请求头headers,config.headers.token=''可以携带参数，此外return config很重要，不return的话，无法发出请求
4. 响应拦截器中的response是服务器返回的对象，我们需要其中的data对象，所以可以简化

    //进行axios二次封装：使用请求与响应拦截器
    import axios from 'axios'
    import { ElMessage } from 'element-plus'
    //第一步:利用axios对象的create方法,去创建 axios实例(其他的配置:基础路径、超时的时间)
    let request = axios.create({
      //基础路径
      baseURL: import.meta.env.VITE_APP_BASE_API, //基础路径上会携带/api
      //设置超时时间：
      timeout: 5000,
    })
    
    //第二步:request实例添加请求拦截器
    request.interceptors.request.use((config) => {
      //config配置对象,headers属性请求头,经常给服务器端携带公共参数
      //返回配置对象
      return config
    })
    
    //第三步:响应拦截器
    request.interceptors.response.use(
      (response) => {
        //成功回调
        //简化数据
        return response.data
      },
      (error) => {
        //失败回调:处理http网络错误的
        //定义一个变量:存储网络错误信息
        let message = ''
        //http状态码
        const status = error.response.status
        //分情况处理不同状态码
        switch (status) {
          case 401:
            message = 'TOKEN过期'
            break
          case 403:
            message = '无权访问'
            break
          case 404:
            message = '请求地址错误'
            break
          case 500:
            message = '服务器出现问题'
            break
          default:
            message = '网络出现问题'
            break
        }
        //提示错误信息
        ElMessage({
          type: 'error',
          message,
        })
        return Promise.reject(error)
      },
    )
    //对外暴露
    export default request
    

在App.vue中进行测试：

    <script setup lang="ts">
    import request from './utils/request';
    import { onMounted } from 'vue';
    
    //组件挂载完毕测试发一个请求
    onMounted(()=>{
      request({
        //由于配置了基础路径，此处省略/api，如果加了，反而会报错
        url:'/user/login',
        method:'post',
        data:{
          username: 'admin',
          password: '111111',
        }
      }).then(res=>{
        //获取服务器返回数据
        console.log(res);//{code: 200, data: {…}}
        
      })
    })
    </script>



用API统一管理项目接口

此处我们建立src/api/user/index.ts文件，管理前面mock创建的user.ts中的两个接口:

    //统一管理用户相关接口
    //引入请求与响应拦截器
    import request from '../../utils/request'
    //从type.ts中获取参数类型限制
    import type { loginForm, loginResponseData, userReponseData } from './type'
    //统一管理接口
    enum API {
      //user.ts中的接口
      LOGIN_URL = '/user/login', //用户登录接口
      USERINFO_URL = '/user/info', //获取用户信息
    }
    //对外暴露请求函数
    //登录接口方法， <>中是返回数据类型定义
    export const reqLogin = (data: loginForm) =>
      request.post<any, loginResponseData>(API.LOGIN_URL, data)
    //获取用户信息接口方法
    export const reqUserInfo = () =>
      request.get<any, userReponseData>(API.USERINFO_URL)
    

然后在src/api/user/type.ts中配置 接口相关数据的ts类型(用到了大量ts限制数据类型)

    //登录接口需要携带参数ts类型
    export interface loginForm {
      username: string
      password: string
    }
    
    //登录接口返回数据类型
    interface dataType {
      token: string
    }
    export interface loginResponseData {
      code: number
      data: dataType //data类型是包含字符串类型token的对象
    }
    
    //定义服务器返回用户信息相关的数据类型
    interface userInfo {
      userId: number
      avatar: string
      username: string
      password: string
      desc: string
      roles: string[]
      buttons: string[]
      routes: string[]
      token: string
    }
    interface user {
      checkUser: userInfo
    }
    export interface userReponseData {
      code: number
      data: user
    }
    

在App.vue中测试是否起效：

    <template>
      <div>
        <h1>App根组件</h1>
        <button @click="req">点击发送请求</button>
      </div>
    </template>
    
    <script lang="ts" setup>
    // import { onMounted } from 'vue';
    import { reqLogin } from './api/user';
    
    function req(){
      reqLogin({username:'admin',password:'111111'})
    }
    </script>

此处发送请求成功



3.30

路由配置(路由)

本项目需要配置四个一级路由：登录login，登录成功后home，输入的路由不存在404，任意路由（重定向404）

1. 下载pnpm install vue-router
2. src下新建文件夹views，用于存放路由组件,比如login/index.vue，3个文件夹
3. src下新建文件夹router，用于存放路由（把原本配置在index中的routes数组单独拿出来放routes.ts中）
       //router/index.ts
       //用vue-router插件配置模板路由
       import { createRouter, createWebHashHistory } from 'vue-router'
       import { constantRoute } from './routes'
       //创建路由器
       let router = createRouter({
         history: createWebHashHistory(),
         routes: constantRoute,
         //滚动行为
         scrollBehavior() {
           return {
             left: 0,
             top: 0,
           }
         },
       })
       
       export default router
   //router/routes.ts
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
       component: () => import('../views/home/index.vue'),
       name: 'layout',
     },
     {
       //404
       path: '/404',
       component: () => import('../views/404/index.vue'),
       name: '404',
     },
     {
       //任意路由。重定向到404
       path: '/:pathMatch(.)',
       redirect: '/404',
       name: 'any',
     },
   ]

    4. 入口文件main.ts注册路由
    
    ```javascript
    import router from './router'
    //注册模板路由
    app.use(router)

1. App.vue中测试<RouterView></RouterView>,(或<router-view></router-view>)配置成功



登录路由静态搭建

页面分析与搭建(css相对定位，background)

一、页面整体布局

1. 需要一个大盒子，宽高与设备一致，放一张背景图
       //views/login/index.vue
       //style  scss
       .login_container{
         width: 100%;
         height: 100vh;//视口宽度的100%
         background: url('@/assets/images/background.jpg') no-repeat;
         background-size: cover;//背景图像缩放完全覆盖元素
       }
2. 整体布局：在大盒子中右侧放一个form（使用elementplus中的layout布局，两列，右边form）
       <div class="login_container">
           <!-- element-plus的栅格系统是24份 -->
           <el-row>
             <el-col :span="12">占位</el-col>
             <el-col :span="12">右侧表单</el-col>
           </el-row>
       </div>
3. 设置屏幕<768时，只显示右侧内容: 左el-col:xs="0"，右el-col:xs="24"

二、表单布局

布置表单内部结构，需要主副标题、input表单项（用户名，密码）、一个登录按钮

    <el-form class="login_form">
      <h1>hello</h1>
      <h2>欢迎来到硅谷甄选</h2>
      <el-form-item prop="username">
        <el-input></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="default">登录</el-button>
      </el-form-item>
    </el-form>

三、表单整体样式

    .login_form{
      position: relative;
      width: 80%;
      top:30vh;//需要相对定位
      background: url("@/assets/images/login_form.png") no-repeat;
      background-size: cover;
      padding: 40px;
    }

四、表单各部分样式

1.标题字体、距离

    h1{
        color: white;
        font-size: 40px;
      }
      h2{
        color: white;
        font-size: 20px;
        margin: 20px 0px;
      }

2.表单内边距

padding: 40px;

3.表单输入框添加前缀图标

(element-plus的使用)  找到、引入，使用





搜索ctrl+g



引入user图标组件import {User} from '@element-plus/icons-vue'

    <el-input :prefix-icon="User"></el-input>

密码框前置图标同理

4.按钮样式

    .login_btn {
          width: 100%;
      }

五、收集账号密码数据

定义数据let loginForm = reactive({ username: '', password: '' });

绑定模板上的input框

    <el-input ... v-model="loginForm.username"></el-input>
    <el-input ... v-model="loginForm.password"></el-input>

六、实现密码输入框点击眼睛图标切换type

实现密码输入框点击眼睛图标切换type为文本或密码：

使用element-plus的input的API：show-password，直接加给password框即可

    <el-input ... show-password></el-input>

静态页面总代码

    //login/index.vue
    <template>
      <div class="login_container">
        <!-- element-plus的栅格系统是24份 -->
        <el-row>
          <el-col :span="12" :xs="0"></el-col>
          <el-col :span="12" :xs="24">
            <el-form class="login_form">
              <h1>Hello</h1>
              <h2>欢迎来到硅谷甄选</h2>
              <el-form-item prop="username">
                <el-input :prefix-icon="User" v-model="loginForm.username"></el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input type="password" :prefix-icon="Lock" v-model="loginForm.password" show-password></el-input>
              </el-form-item>
              <el-form-item>
                <el-button class="login_btn" type="primary" size="default">登录</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        
      </div>
    </template>
    
    <script setup lang="ts">
    import {User,Lock} from '@element-plus/icons-vue'
    //收集账号密码数据
    import { reactive } from 'vue';
    //收集账号与密码的数据
    let loginForm = reactive({ username: 'admin', password: '111111' });
    </script>
    
    <style scoped lang="scss">
    .login_container{
      width: 100%;
      height: 100vh;
      background: url('@/assets/images/background.jpg') no-repeat;
      background-size: cover;//背景图像缩放完全覆盖元素
    }
    .login_form{
      position: relative;
      width: 80%;
      top:30vh;//需要相对定位
      background: url("@/assets/images/login_form.png") no-repeat;
      background-size: cover;
      padding: 40px;
      h1{
        color: white;
        font-size: 40px;
      }
      h2{
        color: white;
        font-size: 20px;
        margin: 20px 0px;
      }
      .login_btn {
          width: 100%;
      }
    }
    </style>



登录业务实现(pinia)

一、完成功能分析

给登录按钮绑定点击事件

分析要做的事：1.通知仓库发登录请求   2.请求成功->首页展示数据的地方   3.请求失败->弹出登录失败信息

二、配置pinia仓库

1. 下载：pnpm i pinia
2. src/store/index.ts中配置仓库
       //大仓库
       import { createPinia } from 'pinia'
       //创建大仓库
       const pinia = createPinia()
       //对外暴露：入口文件需要安装仓库
       export default pinia
3. 在入口文件中引入安装仓库
       //引入仓库
       import pinia from './store'
       //安装仓库
       app.use(pinia)
4. 创建用户相关小仓库
   src/store/modules/user.ts

       //创建用户相关小仓库
       import { defineStore } from 'pinia'
       //创建用户小仓库
       const useUserStore = defineStore('User', {
         //小仓库存储数据地方
         state: () => {
           return {}
         },
         //异步|逻辑的地方
         actions: {},
         getters: {},
       })
       //对外暴露获取小仓库方法
       export default useUserStore

三、配置点击登录事件

总体步骤：在组件login/index.vue引入modules/user.ts，定义点击按钮回调函数，在回调函数中调用modules/user.ts提供的用户登录方法userLogin，并将账号密码数据loginForm作为参数传过去，在userLogin中，存储token，并获取登录返回结果，交给login/index.vue，在它的点击事件回调中，就成功或失败做出相应处理:成功时跳转首页，并出现成功提示窗，失败时出现失败提示窗。以及loading效果

1.引入小仓库

在login/index.vue中引入并使用用户相关小仓库

    //引入用户相关小仓库
    import useUserStore from '../../store/modules/user';
    let useStore=useUserStore()

2.定义userLogin()

在用户相关小仓库modules/user.ts中定义用户登录的方法userLogin()

    //引入接口(接口需要用户名密码，所以后面login/index.vue调用时需要传参)
    import { reqLogin } from '../../api/user'
    actions: {
        //用户登录的方法
        userLogin(data) {
          //data:拿到用户名和密码
        },
      },

将该方法作为login/index.vue中登录按钮点击事件回调（传参）useStore.userLogin(loginForm)

3.配置形参类型

定义小仓库中userLogin(data)中data数据类型：是此前定义的api/user/type.ts中的登录接口携带参数ts类型 loginForm，引入使用即可。

    //引入数据类型
    import type { loginForm } from '../../api/user/type'
    userLogin(data:loginForm) {
          //data:拿到用户名和密码
        },

4.发送登录请求

modules/user.ts的userLogin`中发送登录请求(api统一管理接口 async await)

    async userLogin(data:loginForm) {
          //登录请求  await得到登录返回结果
          let result = await reqLogin(data)
          //登录请求:成功200->token（token是用户个人信息，拿到后要存储）
          //登录请求:失败201->登录失败错误的信息
        },

5.存储token

请求成功后需要在state存储返回的token，这是用户唯一标识，由于pinia|vuex存储数据其实利用js对象,无法持久化，所以使用本地存储，刷新不消失

    state: () => {
        return {
          token:localStorage.getItem("TOKEN"),//用户唯一标识
        }
      },
    
    //userLogin
    if(result.code===200){
            //pinia仓库存储一下token
            this.token = result.data.token
            localStorage.setItem('TOKEN',result.data.token)
          }

6.给组件返回请求结果

让组件知道本次请求成功还是失败（路由跳转或提示错误信息）

利用async返回的promise对象成功或失败，由 userLogin函数结果决定

userLogin方法中：成功或失败时返回信息：（返回信息将作为PromiseResult，出现在promise上）

    if (result.code === 200) {
            //pinia仓库存储一下token
            this.token = result.data.token
            localStorage.setItem('TOKEN', result.data.token)
            return 'ok'
          } else {
            return Promise.reject(new Error(result.data.message))
          }

7.处理请求结果

login/index.vue组件按钮回调事件中：利用try，catch处理返回的结果

    import {useRouter} from 'vue-router'
    //引入消息提示框，用于登录成功或失败时提示
    import { ElNotification } from 'element-plus';
    //获取路由器
    let $router=useRouter()
    
    //登录按钮回调
    const login=async()=>{
      //点击登录按钮后：
      //通知仓库发登录请求
      //请求成功->首页展示数据的地方
      //请求失败->弹出登录失败信息
      try{
        //也可以用.then
        //保证登录成功
        await useStore.userLogin(loginForm)
        //编程式路由导航跳转到首页
        $router.push('/')
        //登录成功提示信息
        ElNotification({
          type:'success',
          message:'登录成功'
        })
      } catch(error) {
        //登录失败提示信息
        ElNotification({
          type:'error',
          //ts断言error类型
          message:(error as Error).message
        })
      }
    }

8.loading效果

制作登录成功按钮上转圈的加载效果（el-button的loading属性）

:loading="true"的效果：



组件中，控制loading：（点击时开始加载，登录失败时或登录成功后，加载效果消失）

    //模板
    <el-button :loading='loading' ...>
        
    import { ref } from 'vue';
    //定义变量控制按钮加载效果
    let loading=ref(false)
    
    //点击事件中
    const login=async()=>{
      //加载效果：开始加载
      loading.value=true
      try{
        ...
        loading.value=false
        })
      } catch(error) {
        loading.value=false
        })
      }
    }

四、总代码

    //login/index.vue
    
    <template>
      <div class="login_container">
        <!-- element-plus的栅格系统是24份 -->
        <el-row>
          <el-col :span="12" :xs="0"></el-col>
          <el-col :span="12" :xs="24">
            <el-form class="login_form">
              <h1>Hello</h1>
              <h2>欢迎来到硅谷甄选</h2>
              <el-form-item prop="username">
                <el-input :prefix-icon="User" v-model="loginForm.username"></el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input type="password" :prefix-icon="Lock" v-model="loginForm.password" show-password></el-input>
              </el-form-item>
              <el-form-item>
                <el-button :loading='loading' class="login_btn" type="primary" size="default" @click="login">登录</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        
      </div>
    </template>
    
    <script setup lang="ts">
    import {User,Lock} from '@element-plus/icons-vue'
    //收集账号密码数据
    import { reactive,ref } from 'vue';
    import {useRouter} from 'vue-router'
    //引入消息提示框，用于登录成功或失败时提示
    import { ElNotification } from 'element-plus';
    //引入用户相关小仓库
    import useUserStore from '../../store/modules/user';
    let useStore=useUserStore()
    //获取路由器
    let $router=useRouter()
    //定义变量控制按钮加载效果
    let loading=ref(false)
    //收集账号与密码的数据
    let loginForm = reactive({ username: 'admin', password: '111111' });
    //登录按钮回调
    const login=async()=>{
      //加载效果：开始加载
      loading.value=true
      //点击登录按钮后：
      //通知仓库发登录请求
      //请求成功->首页展示数据的地方
      //请求失败->弹出登录失败信息
      try{
        //也可以用.then
        //保证登录成功
        await useStore.userLogin(loginForm)
        //编程式路由导航跳转到首页
        $router.push('/')
        //登录成功提示信息
        ElNotification({
          type:'success',
          message:'登录成功'
        })
        loading.value=false
      } catch(error) {
        loading.value=false
        //登录失败提示信息
        ElNotification({
          type:'error',
          //ts断言error类型
          message:(error as Error).message
        })
      }
    }
    </script>
    
    <style scoped lang="scss">
    .login_container{
      width: 100%;
      height: 100vh;
      background: url('@/assets/images/background.jpg') no-repeat;
      background-size: cover;//背景图像缩放完全覆盖元素
    }
    .login_form{
      position: relative;
      width: 80%;
      top:30vh;//需要相对定位
      background: url("@/assets/images/login_form.png") no-repeat;
      background-size: cover;
      padding: 40px;
      h1{
        color: white;
        font-size: 40px;
      }
      h2{
        color: white;
        font-size: 20px;
        margin: 20px 0px;
      }
      .login_btn {
          width: 100%;
      }
    }
    </style>

    //modules/user.ts
    
    //创建用户相关小仓库
    import { defineStore } from 'pinia'
    //引入接口
    import { reqLogin } from '../../api/user'
    //引入数据类型
    import type { loginForm } from '../../api/user/type'
    //创建用户小仓库
    const useUserStore = defineStore('User', {
      //小仓库存储数据地方
      state: () => {
        return {
          token: localStorage.getItem('TOKEN'), //用户唯一标识
        }
      },
      //异步|逻辑的地方
      actions: {
        //用户登录的方法
        async userLogin(data: loginForm) {
          //登录请求  await得到登录返回结果
          let result: any = await reqLogin(data)
          //登录请求:成功200->token（token是用户个人信息，拿到后要存储）
          //登录请求:失败201->登录失败错误的信息
          if (result.code === 200) {
            //pinia仓库存储一下token
            this.token = result.data.token
            //由于pinia|vuex存储数据其实利用js对象,无法持久化
            //所以需要本地存储持久化存储一份
            localStorage.setItem('TOKEN', result.data.token)
            //能保证当前async函数返回一个成功的promise
            return 'ok'
          } else {
            return Promise.reject(new Error(result.data.message))
          }
        },
      },
      getters: {},
    })
    //对外暴露获取小仓库方法
    export default useUserStore
    

定义用户仓库数据ts类型

一、登录接口返回数据result类型

分为成功或失败，api/type.ts中的loginResponseData是成功时的result类型

result类型是一个对象，包含数字型code和对象型data，都有code。但data中，成功时是token，失败时是message（都是字符串）

    //api/type.ts
    interface dataType {
      token?: string
      message?: string
    }
    export interface loginResponseData {
      code: number
      data: dataType
    }

    //store/modules/user.ts
    //引入数据类型
    import type { loginResponseData } from '../../api/user/type'
    let result: loginResponseData = await reqLogin(data)

二、定义小仓库数据state类型

新建store/modules/types/type.ts

    //定义小仓库数据state类型
    export interface UserState {
      token: string | null
    }

    //store/modules/user.ts
    import type { UserState } from './types/type'
    state: ():UserState => {
        return {
          token: localStorage.getItem('TOKEN'), //用户唯一标识
        }
      },

处理token类型相关报错

    //store/modules/user.ts
    //断言
    this.token = (result.data.token as string)
    localStorage.setItem('TOKEN', (result.data.token as string))

三、封装本地存储token

新建src/utils/token.ts  (utils用来放工具)

    //封装本地存储存储数据与读取数据方法
    //存储数据
    export const SET_TOKEN = (token: string) => {
      localStorage.setItem('TOKEN', token)
    }
    //本地存储获取数据
    export const GET_TOKEN = () => {
      return localStorage.getItem('TOKEN')
    }
    //本地存储删除数据方法
    export const REMOVE_TOKEN = () => {
      localStorage.removeItem('TOKEN')
    }
    

在小仓库中替换：

    //引入操作本地存储的工具方法
    import { SET_TOKEN,GET_TOKEN } from '../../utils/token'
    
    token: GET_TOKEN(),
    //token: localStorage.getItem('TOKEN')
    SET_TOKEN((result.data.token as string))
    //localStorage.setItem('TOKEN', result.data.token as string)

现在的小仓库：

    //创建用户相关小仓库
    import { defineStore } from 'pinia'
    //引入接口
    import { reqLogin } from '../../api/user'
    //引入数据类型
    import type { loginForm, loginResponseData } from '../../api/user/type'
    import type { UserState } from './types/type'
    //引入操作本地存储的工具方法
    import { SET_TOKEN, GET_TOKEN } from '../../utils/token'
    //创建用户小仓库
    const useUserStore = defineStore('User', {
      //小仓库存储数据地方
      state: (): UserState => {
        return {
          token: GET_TOKEN(),
        }
      },
      //异步|逻辑的地方
      actions: {
        //用户登录的方法
        async userLogin(data: loginForm) {
          //登录请求  await得到登录返回结果
          let result: loginResponseData = await reqLogin(data)
          //登录请求:成功200->token（token是用户个人信息，拿到后要存储）
          //登录请求:失败201->登录失败错误的信息
          if (result.code === 200) {
            //pinia仓库存储一下token
            this.token = result.data.token as string //断言
            //由于pinia|vuex存储数据其实利用js对象,无法持久化
            //所以需要本地存储持久化存储一份
            SET_TOKEN(result.data.token as string)
            //能保证当前async函数返回一个成功的promise
            return 'ok'
          } else {
            return Promise.reject(new Error(result.data.message))
          }
        },
      },
      getters: {},
    })
    //对外暴露获取小仓库方法
    export default useUserStore
    



登录时间判断与封装

实现登录提示信息随时间变化

封装一个函数:获取一个结果:当前早上|上午|下午|晚上，放在utils/times.ts

    //封装一个函数:获取一个结果:当前早上|上午|下午|晚上
    export const getTime = () => {
      let message = ''
      //通过内置构造函数Date
      const hours = new Date().getHours()
      //情况的判断
      if (hours <= 9) {
        message = '早上'
      } else if (hours <= 12) {
        message = '上午'
      } else if (hours <= 18) {
        message = '下午'
      } else {
        message = '晚上'
      }
      return message
    }
    

登录组件中：

    //引入获取当前时间的函数
    import { getTime } from '../../utils/time';
    //拼接登录成功提示信息
    ElNotification({
      type:'success',
      message:'欢迎回来',
      title:`${getTime()}好`
    })

登录模块表单 长度检验

要求：用户名大于等于5位，密码大于等于6位（用的是element-plus中的form组件，其中的表单校验）



一、:model属性绑定收集到数据的对象

    <el-form class="login_form" :model="loginForm">

二、定义使用rules规则对象

    <el-form class="login_form" :model="loginForm" :rules="rules">
    //定义表单校验需要的配置对象
    const rules={
      username:[],
      password:[]
    }

三、form-item组件加props属性

是校验字段的名字

    <el-form-item prop="username">
    <el-form-item prop="password">

四、配置rules

    //定义表单校验需要的配置对象
    const rules={
      //规则对象属性:
      //required,代表这个字段务必要校验的
      //min:文本长度至少多少位
      //max:文本长度最多多少位
      //不设置min max时默认空值时触发
      //message:错误的提示信息
      //trigger:触发校验表单的时机 change->文本发生变化触发校验,blur:失去焦点的时候触发校验规则
      //数组中可以配置多个对象
      username:[{required:true,min:6,max:10,message:'账号长度至少六位',trigger:'change'}],
      password:[{required:true,min:6,max:15,message:'密码长度至少六位',trigger:'change'}]
    }

五、在所有表单项校验通过后再发请求

利用Form组件的vaildate方法，校验表单项内容长度，只有全部合规，才能发得出去请求



    <el-form ... ref="loginForms">
        
    //获取el-form组件
    let loginForms=ref()
    
    //在按钮事件回调内的最前面：
    
      //保证全部表单项校验通过再发请求
      //validate返回一个promise对象，只有符合规范，promise才是成功的
      await loginForms.value.validate()

自定义校验表单



一、自定义校验规则函数的配置

    //自定义校验规则函数
    const validatorUserName = (rule: any, value: any, callback: any) => {
      //rule:即为校验规则对象
      //value:即为表单元素文本内容
      //函数:如果符合条件callBack放行通过即可
      //如果不符合条件callBack也放行,但注入错误提示信息
      if (value.length >= 5) {
        callback();
      } else {
        callback(new Error('账号长度至少五位'));
      }
    }
    
    const validatorPassword = (rule: any, value: any, callback: any) => {
      if (value.length >= 6) {
        callback();
      } else {
        callback(new Error('密码长度至少六位'));
      }
    }

二、配置rules

    const rules={
      username: [
        { trigger: 'change', validator: validatorUserName }
      ],
      password: [
        { trigger: 'change', validator: validatorPassword }
      ]
    }

layout组件静态搭建



目前，路由中name: 'layout'对应一级路由组件是src/views/home/index.vue

新建组件src/layout/index.vue

routers中，将路由组件由home换成layout：

    {
        //登录成功后展示数据
        path: '/',
        component: () => import('../layout/index.vue'),
        name: 'layout',
      },

3.31

layout组件静态搭建

页面分析与搭建

一、整体布局(overflow  calc)

左侧菜单+顶部导航+内容展示区

    <div class="layout_container">
        <!-- 左侧菜单 -->
        <div class="layout_slider"></div>
        <!-- 顶部导航 -->
        <div class="layout_tabbar"></div>
        <!-- 内容展示区 -->
         <div class="layout_main"></div>
      </div>

为了之后让样式更容易修改，在src/styles/variable.scss中配置全局样式

    //左侧的菜单的宽度
    $base-menu-width:260px;
    //左侧菜单的背景颜色
    $base-menu-background:#001529;
    $base-menu-min-width:50px;
    // 顶部导航的高度
    $base-tabbar-height:50px;

    //layout
    <style scoped lang="scss">
    //总体
    .layout_container{
      width: 100%;
      height: 100vh;
        //左侧菜单
      .layout_slider{
        width:$base-menu-width;
        height: 100vh;
        background: $base-menu-background;
      }
        //顶部导航
      .layout_tabbar{
        position: fixed;
        width: calc(100% - $base-menu-width);
        height: $base-tabbar-height;
        top: 0px;
        left: $base-menu-width;
      }
        //内容展示区
      .layout_main{
        position: absolute;
        width: calc(100% - $base-menu-width);
        height: calc(100vh - $base-tabbar-height);
        left: $base-menu-width;
        top: $base-tabbar-height;
        padding: 20px;
        overflow: auto;//滚动条自适应，不撑开页面
      }
    }
    </style>



滚动条样式在src/styles/index.scss中配置

    //滚动条外观设置
    ::-webkit-scrollbar{
      width: 10px;
    }
    //滚动条背景
    ::-webkit-scrollbar-track{
      background: $base-menu-background;
    }
    //滚动块
    ::-webkit-scrollbar-thumb{
      width: 10px;
      background-color: #fff;
      border-radius: 10px;
    }

二、封装logo组件(display  align-items)

新建layout/logo/index.vue,引入src/layout/index.vue

    //src/layout/index.vue
    <!-- 左侧菜单 -->
    <div class="layout_slider">
      <Logo></Logo>
    </div>
    
    //引入左侧菜单logo子组件
    import Logo from './logo/index.vue'

设置logo子组件布局和样式

    // layout/logo/index.vue
    <template>
      <div class="logo">
        <img src="../../../public/logo.png" alt="">
        <p>硅谷甄选运营平台</p>
      </div>
    </template>
    
    <script setup lang="ts">
    
    </script>
    
    <style scoped lang="scss">
    .logo{
      width: 100%;
      height: $base-menu-logo-height;
      color: white;
      display: flex;//图片文字水平排列
      align-items: center;//竖直对齐
      padding: 20px;
      img{
        width: 40px;
        height: 40px;
      }
      p{
        font-size: $base-logo-title-fontSize;
        margin-left: 10px;
      }
    }
    </style>

全局样式/variable.scss

    //左侧菜单logo高度设置
    $base-menu-logo-height:50px;
    
    //左侧菜单logo右侧文字大小
    $base-logo-title-fontSize:20px;

为了方便替换logo图片和文字，新建src/setting.ts

    //用于项目logo、标题配置
    export default{
      title:'硅谷甄选运营平台',//项目标题
      logo:'/public/logo.png'//项目logo
      logoHidden:true,//logo组件是否隐藏
    }

引入并使用

    // layout/logo/index.vue
    <div class="logo" v-if="setting.logoHidden">
      <img :src="setting.logo" alt="">
      <p>{{ setting.title }}</p>
    </div>
    
    //引入设置标题与logo这配置文件
    import setting from '../../setting';

三、左侧菜单静态搭建

1.element-plus  scrollbar

利用element-plus提供的scrollbar组件，设置菜单滚动条，防止条目太多撑开菜单栏。



    // src/layout/index.vue
    <Logo></Logo>
    <!-- 展示菜单 -->
    <el-scrollbar class="scrollbar">
        //20是菜单中项目数量
      <p v-for="item in 20" :key="item" class="scrollbar-demo-item">{{ item }}</p>
    </el-scrollbar>
    
    //样式
    .scrollbar{
       width: 100%;
       //高度为视口高度减logo组件高度
       height: calc(100vh - $base-menu-logo-height);
     }

2.element-plus  menu

使用element-plus提供的 menu 组件制作折叠菜单



3.单独菜单项

单独菜单项：el-menu-item， 带折叠的菜单项：el-sub-menu(里面是el-menu-item)

使用举例：src/layout/index.vue（el-menu-item的  index是组件的唯一标识）

    <!-- 滚动组件 -->
    <el-scrollbar class="scrollbar">
      <!-- 菜单组件 -->
      <el-menu>
        <el-menu-item index="1">首页</el-menu-item>
      </el-menu>
    </el-scrollbar>



调试menu样式：



    <el-menu background-color="#001529" text-color="white">...</el-menu>

4.折叠菜单项 (具名插槽)

    <!-- 折叠菜单 -->
    <el-sub-menu index="3">
      <!-- 使用具名插槽设置 折叠菜单项标题 -->
      <template #title><span>权限管理</span></template>
      <el-menu-item index="3-1">用户管理</el-menu-item>
      <el-menu-item index="3-2">角色管理</el-menu-item>
      <el-menu-item index="3-3">菜单管理</el-menu-item>
    </el-sub-menu>

效果：

    <el-scrollbar class="scrollbar">
      <!-- 菜单组件 -->
       <el-menu background-color="#001529" text-color="white">
          <!-- index是组件的唯一标识 -->
          <el-menu-item index="1">首页</el-menu-item>
          <el-menu-item index="2">数据大屏</el-menu-item>
          <!-- 折叠菜单 -->
          <el-sub-menu index="3">
            <!-- 使用具名插槽设置 折叠菜单项标题 -->
            <template #title>
              <span>权限管理</span>
            </template>
            <el-menu-item index="3-1">用户管理</el-menu-item>
            <el-menu-item index="3-2">角色管理</el-menu-item>
            <el-menu-item index="3-3">菜单管理</el-menu-item>
          </el-sub-menu>
       </el-menu>
    </el-scrollbar>





四、根据路由组件生成菜单

1.新建引入menu组件

上面只是写了静态的菜单，数据是写死的，我们需要让菜单项根据路由组件动态生成。

新建src/layout/menu/index.vue，封装 根据路由组件动态生成的 菜单组件

在src/layout/index.vue中引入使用组件:

    <el-scrollbar class="scrollbar">
      <!-- 菜单组件 -->
       <el-menu background-color="#001529" text-color="white">
          <!-- 根据路由动态生成菜单 -->
           <Menu></Menu>
       </el-menu>
    </el-scrollbar>
    
    //引入菜单组件
    import Menu from './menu/index.vue'

2.routes增加二级路由

在router/routes.ts中设置二级路由(将home作为layout的二级路由)

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

3.路由数组存进仓库

menu需要拿到router/routes.ts对外暴露的数组，一个方法是直接引入，但是之后要计算异步时会麻烦，所以用另外的方法：将数组存储到仓库中，让所有组件可以拿到

    // src/store/modules/user.ts
    //引入路由（常量路由）
    import { constantRoute } from '../../router/routes'
    
    //存入state
    state: (): UserState => {
        return {
          token: GET_TOKEN(), //用户唯一标识token
          menuRoutes: constantRoute
        }
      },

定义menuRoutes数据类型

    // src/store/modules/types/type.ts
    
    import type { RouteRecordRaw } from 'vue-router'
    //定义小仓库数据state类型
    export interface UserState {
      token: string | null
      menuRoutes: RouteRecordRaw[]
    }

4.menu得到路由数组

让layout获取仓库中该数据：

    // src/layout/index.vue
    
    //将数组传递给menu组件
    <Menu :menuList="userStore.menuRoutes"></Menu>
    
    //获取用户相关的小仓库
    import useUserStore from '../store/modules/user';
    let userStore=useUserStore()

来到menu组件接收

    //src/layout/menu/index.vue
    
    //获取父组件传递过来的全部路由数组
    defineProps(['menuList'])

5.路由添加meta

在router/routes.ts中，给每一组路由添加meta路由源信息，用于展示菜单标题

    export const constantRoute = [
      {
        //登录
        path: '/login',
       ...
        meta: {
          title: '登录', //菜单标题
        },
      },
      {
        //登录成功后展示数据
        ...
        meta: {
          title: 'layout',
        },
        children: [
          {
           ...
            meta: {
              title: '首页',
            },
          },
        ],
      },
      {
        //404
        ...
        meta: {
          title: '404',
        },
      },
      {
        //任意路由。重定向到404
        ...
        meta: {
          title: '任意路由',
        },
      },
    ]
    

6.menu中递归生成菜单

menu组件中根据路由配置菜单：(使用了递归组件，实现 具有两个及以上子组件的情况)

    <template>
      //遍历传来的路由数组
      <template v-for="(item, index) in menuList" :key="item.path">
          
            <!-- 1. 如果没有子路由，就用这种写法： -->
            <el-menu-item v-if="!item.children" :index="item.path">
                <!-- 具名插槽 -->
                <template #title>
                  <span></span>
                  <span>{{ item.meta.title }}</span>
                </template>
            </el-menu-item>
    
            <!-- 2. 只有一个子路由，也不需要折叠 -->
            <el-menu-item v-if="item.children && item.children.length == 1" :index="item.children[0].path">
                <template #title>
                  <span>{{ item.children[0].meta.title }}</span>
                </template>
            </el-menu-item>
    
            <!-- 3. 有子路由且个数大于1 -->
            <el-sub-menu v-if="item.children && item.children.length > 1" :index="item.path" >
                <template #title>
                    <span>{{ item.meta.title }}</span>
                </template>
                <!-- 递归组件 -->
                <Menu :menuList="item.children"></Menu>
            </el-sub-menu>
      </template>
    </template>
    
    //需要暴露组件名才能使用
    <script lang="ts">
    export default {
      name:'Menu'
    }

过程介绍：

1. 首先，最外层进行四次循环
2. ‘登录’没有子组件，用第一种情况展示出来，
3. layout有两个子组件，用第三种情况，用插槽展示自己的meta，
4. 然后用递归将children作为menuList数组传递给自己，再次进行三种情况的判断，
5. 子组件符合第一种情况，于是单独展示在layout中





7.隐藏el-menu右侧白色边框

    //layout/index.vue
    .el-menu{
      border-right: none;
     }

8.判断标题是否需要展示

并不是所有路由组件都需要展示，比如登录、404，需要告诉menu：

在routes.ts中的meta中添加hidden属性，控制显隐标题（登录、404，任意路由配置为true，其他false）

    meta: {
          title: '登录', //菜单标题
          hidden:true,//路由标题在菜单中是否隐藏
        },

layout/menu/index.vue中改变一下结构：三条判断外面再加一层template，在外层先判断子路由个数，然后里面再判断hiddenv-if="!item.meta.hidden"

    <template>
      //遍历传来的路由数组
      <template v-for="(item, index) in menuList" :key="item.path">
        <!-- 如果没有子路由，就用这种写法： -->
        <template v-if="!item.children">
            <el-menu-item :index="item.path" v-if="!item.meta.hidden">
                <!-- 具名插槽 -->
                <template #title>
                  <span></span>
                  <span>{{ item.meta.title }}</span>
                </template>
            </el-menu-item>
        </template>
    
        <!-- 只有一个子路由，也不需要折叠 -->
        <template v-if="item.children && item.children.length == 1" >
            <el-menu-item :index="item.children[0].path" v-if="!item.children[0].meta.hidden">
                <template #title>
                  <span>{{ item.children[0].meta.title }}</span>
                </template>
            </el-menu-item>
        </template>
    
        <!-- 有子路由且个数大于1 -->
        <template v-if="item.children && item.children.length > 1">
            <el-sub-menu :index="item.path" v-if="!item.meta.hidden">
                <template #title>
                    <span>{{ item.meta.title }}</span>
                </template>
                <!-- 递归组件 -->
                <Menu :menuList="item.children"></Menu>
            </el-sub-menu>
        </template>
      </template>
    </template>

五、菜单图标

1.注册全局组件

使用element-plus的Icon图标：

将Icon图标注册成全局组件，只需要引入一次

    //components/index.ts
    
    //引入element-plus提供的全部图标组件（一个对象，里面是200多个 组件名:组件对象）
    import * as ElementPlusIconsVue from '@element-plus/icons-vue'
    
    export default {
      install(app: any) {
        ...
        //将element-plus提供的Icon图标注册成全局组件
        //解构出组件名和组件对象，将它们注册成全局组件
        for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
          app.component(key, component)
        }
      },
    }

使用举例：

    <el-icon>
      <Plus/>
    </el-icon>
    
    //直接用名字
    <el-button ... icon="Refresh"></el-button>

2.在meta中增加icon属性

图标也是不能写死的，由用户在配置路由时决定

在routes的路由源信息meta中增加icon属性,值为图标名

    meta: {
          title: 'layout',
          hidden: false,
          icon: 'Avatar',
        },

3.使用图标

在layout/menu/index.vue中添加图标

    <!-- 如果没有子路由，就用这种写法： -->
    <template #title>
      <el-icon>
        <component :is="item.meta.icon"></component>
      </el-icon>
      <span>{{ item.meta.title }}</span>
    </template>
    
    <!-- 只有一个子路由，也不需要折叠 -->
    <template #title>
      <el-icon>
        <component :is="item.children[0].meta.icon"></component>
      </el-icon>
      <span>{{ item.children[0].meta.title }}</span>
    </template>
    
    <!-- 有子路由且个数大于1 -->
    <template #title>
      <el-icon>
        <component :is="item.meta.icon"></component>
      </el-icon>
        <span>{{ item.meta.title }}</span>
    </template>

六、菜单路由配置

1.创建全部组件及路由

给routes中的layout路由添加重定向redirect:'/home',，直接跳转到它的二级路由home

views文件夹中新增 数据大屏 一级路由组件screen/index.vue,在路由中配置它

    {
        path: '/screen',
        component: () => import('../views/screen/index.vue'),
        name: 'Screen',
        meta: {
          title: '数据大屏',
          hidden: false,
          icon: 'Platform',
        },
      },

views文件夹中新增 权限管理一级路由组件acl，其中三个子组件user，role，permission，在路由中配置：

    {
        path: '/acl',
        component: () => import('../layout/index.vue'),
        name: 'Acl',
        meta: {
          title: '权限管理',
          hidden: false,
          icon: 'Lock',
        },
        children: [
          {
            path: '/acl/user',
            component: () => import('../views/acl/user/index.vue'),
            name: 'User',
            meta: {
              title: '用户管理',
              hidden: false,
              icon: 'User',
            },
          },
          {
            path: '/acl/role',
            component: () => import('../views/acl/role/index.vue'),
            name: 'Role',
            meta: {
              title: '角色管理',
              hidden: false,
              icon: 'UserFilled',
            },
          },
          {
            path: '/acl/permission',
            component: () => import('../views/acl/permission/index.vue'),
            name: 'Permission',
            meta: {
              title: '菜单管理',
              hidden: false,
              icon: 'Monitor',
            },
          },
        ],
      },

views文件夹中新增一级路由商品管理，子组件4个，配置路由：

    {
        path: '/product',
        component: () => import('../layout/index.vue'),
        name: 'Product',
        meta: {
          title: '商品管理',
          icon: 'Goods',
        },
        redirect: '/product/trademark',
        children: [
          {
            path: '/product/trademark',
            component: () => import('../views/product/trademark/index.vue'),
            name: 'Trademark',
            meta: {
              title: '品牌管理',
              icon: 'ShoppingCartFull',
            },
          },
          {
            path: '/product/attr',
            component: () => import('../views/product/attr/index.vue'),
            name: 'Attr',
            meta: {
              title: '属性管理',
              icon: 'ChromeFilled',
            },
          },
          {
            path: '/product/spu',
            component: () => import('../views/product/spu/index.vue'),
            name: 'Spu',
            meta: {
              title: 'SPU管理',
              icon: 'Calendar',
            },
          },
          {
            path: '/product/sku',
            component: () => import('../views/product/sku/index.vue'),
            name: 'Sku',
            meta: {
              title: 'SKU管理',
              icon: 'Orange',
            },
          },
        ],
      },

2.路由展示区

layout/index中模板内容展示区加上<router-view></router-view>

3.点击路由跳转

用e-p提供的 Menu-Item的点击事件实现点击后路由跳转



在menu组件中添加点击事件，引入并获取路由对象

    <el-menu-item ... @click="goRoute">
    
    import { useRouter } from 'vue-router'; 
    //获取路由器对象
    let $router=useRouter()
    //点击菜单的回调
    const goRoute=(vc:any)=>{
      //路由跳转
      $router.push(vc.index)
    }

此时即可实现点击菜单实现路由切换

4.路由切换过渡效果(vue3过渡动画)

将<router-view></router-view>封装成组件layout/main/index.vue，在layout/index中使用

(为了加过渡动画)

    <Main></Main>
    
    //右侧内容的展示区域
    import Main from './main/index.vue'

在main组件加过渡效果

    //layout/main/index.vue
    <template>
        <!-- 路由组件出口的位置 -->
        <router-view v-slot="{ Component }">
            <transition name="fade">
                <!-- 渲染layout一级路由组件的子路由 -->
                <component :is="Component"/>
            </transition>
        </router-view>
    </template>
    
    <script setup lang="ts">
    </script>
    
    <style scoped>
    .fade-enter-from {
        opacity: 0;
        transform: scale(0);//scale：缩放
    }
    
    .fade-enter-active {
        transition: all .3s;
    }
    
    .fade-enter-to {
        opacity: 1;
        transform: scale(1);
    }
    </style>

七、实现菜单展开刷新不折叠

实现菜单展开后刷新不自动折叠（利用e-p提供的Menu的api）

1.折叠API collapse介绍

Menu的api中的折叠标题效果 collapse，由于我们之前把图标和标题都放进了插槽中，导致图标会被一起折叠

为了避免，现在把图标移到插槽外面，实现只折叠文字

    //layout
    <!-- 菜单组件 -->
    <el-menu background-color="#001529" text-color="white" collapse>
     

效果：



2.替换激活文字active-text-color

    <!-- 菜单组件 -->
    <el-menu background-color="#001529" text-color="white" active-text-color="red">

3.default-active默认激活index

页面加载时默认激活菜单的index



可以看到，菜单项唯一标识符index是路由的地址，默认激活它，就是默认选择这个菜单项，即实现菜单展开后刷新不自动折叠

在layout组件中引入路由，给菜单组件加上default-active，默认激活当前路由地址

    <el-menu :default-active="$route.path"...>
    
    //获取路由对象
    import { useRoute } from 'vue-router';
    let $route=useRoute()

八、顶部组件tabbar搭建

1.建立与引入

新建layout/tabbar/index.vue，在layout组件中引入(此处改了一点样式，只让左边栏中文字颜色为白色)

    <!-- 顶部导航 -->
    <div class="layout_tabbar">
      <!-- layout组件的顶部导航tabbar -->
      <Tabbar></Tabbar>
    </div>
    
    //引入顶部tabbar组件
    import Tabbar from './tabbar/index.vue'

2.分析配置tabbar (display: flex)

总体分析：分为左右两边，开启弹性布局，左右分布。左侧有一个图标，一个面包屑效果(e-p中有相应组件)



分隔符可以是图标separator-icon='图标名'或字符串separator="/"

右侧是三个按钮(el-button)：小号圆形 刷新、全屏、设置 图标，以及用户头像，带退出下拉效果的用户名

4.1

下拉效果用户名用e-p提供的Dropdown下拉菜单实现，右侧样式：弹性布局，纵轴对齐，按钮去掉type

    <template>
        <div class="tabbar">
            <div class="tabbar_left">
              <!-- 顶部左侧静态 -->
               <el-icon style="margin-right: 10px;">
                  <Expand/>
               </el-icon>
               <!-- 左侧面包屑 -->
                <el-breadcrumb separator-icon='ArrowRight'>
                    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
                    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div class="tabbar_right">
              <!-- 右侧静态 -->
              <el-button size="small" icon="Refresh" circle></el-button>
              <el-button size="small" icon="FullScreen" circle></el-button>
              <el-button size="small" icon="Setting" circle></el-button>
              <img src="../../../public/logo.png" alt="" style="width: 24px;height: 24px; margin: 0 10px;">
              <!-- 下拉菜单退出登录 -->
               <el-dropdown>
                    <span class="el-dropdown-link">
                        admin
                        <el-icon class="el-icon--right">
                            <arrow-down />
                        </el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item>退出登录</el-dropdown-item> 
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div> 
        </div>
    </template>
    
    <style scoped lang="scss">
    .tabbar {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        // background-image: linear-gradient(to right, rgb(232, 223, 223), rgb(201, 178, 178), rgb(197, 165, 165));
    
        .tabbar_left {
            display: flex;//图标与文字水平布局
            align-items: center;
            margin-left: 20px;
        }
    
        .tabbar_right {
            display: flex;
            align-items: center;
        }
    }
    </style>

将左右静态分别封装成组件：tabbar/breadcrumb和tabbar/setting,在父组件中引入使用

    <div class="tabbar">
        <div class="tabbar_left">
            <Breadcrumb />
        </div>
        <div class="tabbar_right">
            <Setting />
        </div>
    </div>
    
    import Breadcrumb from './breadcrumb/index.vue'
    import Setting from './setting/index.vue';

九、菜单折叠效果

1.fold折叠时图标切换(component组件)

展开图标Expand，折叠图标Fold

步骤：在需要放图标的地方放置component组件，动态判断此处放的图标组件；定义fold变量，初始值false，对应图标Expand，给el-icon添加点击事件，切换fold的布尔值。

    //Breadcrumb
    <template>
        <!-- 顶部左侧静态 -->
         <el-icon style="margin-right: 10px;" @click="changeIcon">
            <component :is="fold?'Fold':'Expand'"></component>
         </el-icon>
         ...
    </template>
    
    <script setup>
    import { ref } from 'vue';
    //定义一个响应式数据控制图标切换
    let fold=ref(false)//用于控制菜单折叠还是打开图标切换变量
    
    //点击图标的方法
    const changeIcon=()=>{
      //图标切换
      fold.value=!fold.value
    }
    </script>

2.组件命名，使结构清晰

为了在控制台看清楚各组件间的关系，用下面的方法对layout中各组件进行重命名（现在都叫index.vue）

    <script lang="ts">
    export default {
      name:'Layout'
    }
    </script>

3.fold放进仓库作用全局

需要通过Breadcrumb组件中的fold的值来决定Layout组件中的折叠（涉及到孙组件给爷传参），将fold相关数据挂载到仓库中：新建小仓库store/modules/setting.ts，将fold放进state

    //小仓库:layout组件相关配置仓库
    import { defineStore } from 'pinia'
    
    const useLayOutSettingStore = defineStore('SettingStore', {
      state: () => {
        return {
          fold: false, //用于控制菜单折叠还是收起控制
        }
      },
    })
    
    export default useLayOutSettingStore

让Breadcrumb使用仓库中的fold

    <template>
        <!-- 顶部左侧静态 -->
         <el-icon style="margin-right: 10px;" @click="changeIcon">
            <component :is="LayOutSettingStore.fold?'Fold':'Expand'"></component>
         </el-icon>
         ...
    </template>
    
    <script setup lang="ts">
    import useLayOutSettingStore from '../../../store/modules/setting';
    //获取layout配置相关仓库
    let LayOutSettingStore=useLayOutSettingStore()
    //点击图标的方法
    const changeIcon=()=>{
      //图标切换
      LayOutSettingStore.fold=!LayOutSettingStore.fold
    }
    </script>

4.layout引入使用fold(:class)

在layout中获取这个仓库

    import useLayOutSettingStore from '../store/modules/setting';
    //获取layout配置相关仓库
    let LayOutSettingStore=useLayOutSettingStore()

给layout模板中的左侧菜单组件动态添加类fold折叠，（当fold数据为true时添加）

    <div class="layout_slider" :class="{fold:LayOutSettingStore.fold?true:false}">

5.定义fold样式与过渡动画(&.fold)

定义左侧菜单栏折叠起来的宽度作为全局变量，放在style/variable.scss中

    //左侧菜单栏折叠起来的宽度
    $base-menu-min-width:50px;

在layout组件中设置class=fold的样式，以及折叠过渡动画

    .layout_slider{
        ...
        transition: all 0.3s;
        ...
        &.fold{
          width: $base-menu-min-width;
        }
      }

接下来分别给顶部导航和内容展示区加上fold类，样式和过渡动画

    <!-- 顶部导航 -->
        <div class="layout_tabbar" :class="{fold:LayOutSettingStore.fold?true:false}">
    <!-- 内容展示区 -->
         <div class="layout_main" :class="{fold:LayOutSettingStore.fold?true:false}">
             
    .layout_tabbar{
        ...
        transition: all 0.3s;
        &.fold{
          width: calc(100vw - 50px);
          left:$base-menu-min-width;
        }
      }
      .layout_main{
        ...
        transition: all 0.3s;
        &.fold{
          width: calc(100vw - 50px);
          left:$base-menu-min-width;
        }
      }

此时效果：（可以看到，菜单项的下箭头还在，接下来要用collapse折叠起来）



给layout的菜单组件添加collapse即可

    <!-- 菜单组件 -->
    <el-menu :collapse="LayOutSettingStore.fold"...>

4.2补：layout去除layout_slider左盒子过渡动画class和fold，防止标题压缩，不好看



十、顶部面包屑动态(matched)

1. 利用路由的matched获取当前位置各级路由

    import { useRoute } from 'vue-router';
    let $route=useRoute()
    
    //点击事件
     console.log($route.matched);



1. 在面包屑组件中，使用for遍历matched，生成数据项的图标和标题

    <!-- 左侧面包屑 -->
    <el-breadcrumb separator-icon='ArrowRight'>
      <!-- 面包屑动态展示路由名字标题 -->
        <el-breadcrumb-item v-for="(item,index) in $route.matched" :key="index">
          <!-- 图标 -->
          <el-icon>
            <component :is="item.meta.icon"></component>
          </el-icon>
          <!-- 面包屑展示路由标题 -->
          <span  style="margin: 0 5px;">{{ item.meta.title }}</span>
        </el-breadcrumb-item>
    </el-breadcrumb>

1. 为了不展示layout，只展示其二级的home，直接在路由中把layout的title，icon变成空，然后在面包屑组件for循环后加个v-show判断，没有设置标题的就不展示

    <el-breadcrumb-item v-for=...  v-show="item.meta.title">

1. 用e-p提供的面包屑的to属性，实现点击面包屑跳转路由（同tue-router的to属性）

    <el-breadcrumb-item v-for=...  :to="item.path">

问题：面包屑 权限管理>菜单管理 中，点击权限管理，会跳转到layout，页面会空，所以我们需要重定向到权限管理的第一个子路由用户管理redirect: '/acl/user',商品管理也是，redirect: '/product/trademark',

十一、刷新按钮业务实现(pinia,watch,nextTick)

1. 分析：将当前路由组件销毁(v-if)重新创建再向服务器拿一次数据
2. 点击按钮在layout/tabbar/setting，而展示区在layout/main，需要把数据放进仓库 实现通信。在仓库store/modules/setting.ts中新增属性refsh: false,用于控制刷新效果
3. 在顶部右侧组件setting中，引入refsh，给刷新按钮定义点击事件，一点击就切换refsh的布尔值

    // layout/tabbar/setting
    
    //获取骨架小仓库
    import useLayOutSettingStore from '../../../store/modules/setting';
    let layOutSettingStore =useLayOutSettingStore()
    //刷新按钮点击回调
    const updateRefsh=()=>{
        layOutSettingStore.refsh=!layOutSettingStore.refsh
    }

1. 在展示区main组件中，引入并监听refsh，一旦refsh变化，就让当前展示页面销毁v-if=false,然后使用nextTick让下一步时v-if=true，其中v-if的值用flag控制

    <router-view v-slot="{ Component }">
        <transition name="fade">
            <component :is="Component" v-if="flag"/>
        </transition>
    </router-view>
    
    
    import { watch,ref,nextTick } from 'vue';
    import useLayOutSettingStore from '../../store/modules/setting';
    let layOutSettingStore =useLayOutSettingStore()
    //控制当前组件是否销毁重建
    let flag=ref(true)
    
    //监听仓库内部refsh数据是否发生变化，说明用户点击过刷新按钮
    watch(()=>layOutSettingStore.refsh,()=>{
        //点击刷新按钮，路由组件销毁
        flag.value=false
        nextTick(()=>{
            flag.value=true
        })
    })

十二、全屏功能按钮实现(dom自带属性)

给刷新按钮定义点击回调

    //全屏按钮点击回调
    const fullScreen=()=>{
        //dom对象的一个属性，可以用来判断当前是否是全屏
        let full=document.fullscreenElement
        if(!full){
            //利用文档根节点的requestFullscreen,实现全屏模式
            document.documentElement.requestFullscreen()
        }else{
            //退出全屏模式
            document.exitFullscreen()
        }
    }

十三、！获取用户信息，理解token(异步async  await)

1.获取用户信息-获取时机

为了在右上角展示用户头像和用户名，需要获取用户信息

在home组件中，引入user小仓库，挂载完毕后，就调用仓库中的userInfo方法，来获取用户信息

    //src/views/home
    
    <script setup lang="ts">
    //引入生命周期函数
    import { onMounted } from 'vue';
    //获取仓库
    import useUserStore from '../../store/modules/user';
    let userStore=useUserStore()
    //首页挂载完毕，发请求获取用户信息
    onMounted(()=>{
      userStore.userInfo()
    })
    </script>

2.获取用户信息方法定义

在user小仓库里定义userInfo方法

    actions: {
       ...
        //获取用户信息方法
        async userInfo() {
          //获取用户信息存在仓库中(用户头像、名字)
          let result = await reqUserInfo()
        },
      },

reqUserInfo是api/user/index.ts中定义的 获取用户信息接口方法。



3.token放进请求拦截器，发起请求获得用户信息

点击登录按钮，向服务器发请求，请求成功返回token，存储到仓库中。

此时挂载完毕再次发请求，result并不能获取用户信息，因为服务器已经返回标识token了，再次请求需要带上token，所以需要将token设置成公共参数：将token放在请求拦截器中，这样，只要发请求，就可以通过请求头，把token带上

token的位置：src/store/modules/user.ts,该仓库作为方法暴露了，所以我们可以在请求拦截器中引入它：

    //src/utils/request.ts
    
    //引入用户相关仓库
    import useUserStore from '../store/modules/user'
    
    //request实例添加请求拦截器
    request.interceptors.request.use((config) => {
      //获取用户相关小仓库：获取仓库内部token，登录成功后携带给服务器
      let userStore = useUserStore()
      if (userStore) {
        //如果能获取token，就将其添加进请求头
        config.headers.token = userStore.token
      }
      //config配置对象,headers属性请求头,经常给服务器端携带公共参数
      //返回配置对象
      return config
    })

 

此时请求就能获得用户信息了，我们需要其中的用户名username，用户头像avatar

4.存储获取的用户信息

存储用户信息到user小仓库（在modules/types中定义一下两个数据的类型）

    //store/modules/user.ts
    state: (): UserState => {
        return {
          ...
          username: '',
          avatar:'',
        }
      },
          
          
    //modules/types/type.ts
          
    export interface UserState {
      ...
      username: string
      avatar: string
    }

user小仓库中，继续配置userInfo方法

    async userInfo() {
          //获取用户信息存在仓库中(用户头像、名字)
          let result = await reqUserInfo()
          //如果获取用户信息成功，存储用户信息
          if(result.code==200){
            this.username=result.data.checkUser.username
            this.avatar=result.data.checkUser.avatar
          }
        },
      },

此时，如果获取头像和用户名成功，就会存储进state

5.替换静态用户信息

此时，来到顶部右边setting组件，我们来替换之前写死的头像和用户名

    //layout/tabbar/setting
    
    <img :src="userStore.avatar" alt="" style="width: 24px;height: 24px; margin: 0 10px;border-radius: 50%;">
        
    <span class="el-dropdown-link">
        {{ userStore.username }}
        <el-icon class="el-icon--right">
            <arrow-down />
        </el-icon>
    </span>
    //获取用户相关小仓库
    import useUserStore from '../../../store/modules/user';
    let userStore=useUserStore()

成功渲染（之后在首页也可以直接拿来用）



十四、！退出登录

要做的事： (1.发退出登录请求，现在没接口)2.跳转到登录页面，3.清除仓库中的用户信息和token

1.清除用户信息方法

在setting组件中定义退出登录下拉框的点击事件，调用user仓库中的方法userLogout

在userLogout方法中：清除用户头像、名称数据，清除token（封装进utils/token.ts）

    // utils/token.ts
    //本地存储删除数据方法
    export const REMOVE_TOKEN = () => {
      localStorage.removeItem('TOKEN')
    }
    
    // store/modules/user.ts
    //引入操作本地存储的工具方法
    import { ...,REMOVE_TOKEN } from '../../utils/token'
    
    //退出登录
        async userLogout() {
            //目前没有mock接口:退出登录接口(通知服务器本地用户唯一标识失效)
            this.token = ''
            this.username = ''
            this.avatar = ''
            REMOVE_TOKEN()
        },

2.跳转至登录页面

继续配置点击事件回调：跳转login

    // layout/tabbar/setting
    
    import {useRouter} from 'vue-router'
    //获取路由器对象
    let $router=useRouter()
    
    
    //退出登录点击的回调
    const logout=()=>{
        //第一件事情:需要向服务器发请求[无退出登录接口，不做]
        //第二件事情:仓库当中关于用于相关的数据清空[token|username|avatar]
        userStore.userLogout();
        //第三件事情:跳转到登录页面
        $router.push({path:'/login'})
    }

此时已实现退出登录效果

3.！后续问题-下次登录保证页面复原(query)

想要实现下次登录时，回到上次退出时的界面，而不是首页：

将当前路径作为query参数带给login，login组件能拿到当前query参数

    import {...useRoute} from 'vue-router'
    //获取路由对象
    let $route=useRoute()
    
    //将当前路径作为query参数带给login
    //第三件事情:跳转到登录页面
    $router.push({path:'/login',query:{redirect:$route.path}})

在登录组件中进行判断路由中是否有query参数,有就往query参数跳，没有就跳到首页 (后台管理系统常用)

    //login/index.vue
    
    import {...useRoute} from 'vue-router'
    //获取路由对象
    let $route=useRoute()
    try{
        ...
        //判断登录时路由路径中是否有query参数，有就往query参数跳，没有就跳到首页
        let redirect:any=$route.query.redirect
        $router.push({path:redirect||'/'})
        ...
      } 

4.其他后续问题

1.登录后，不允许再直接更改网址跳转至login，以及没登录时，不允许直接修改网址跳转首页:(全局守卫)

2.在子组件中，刷新时右上角的用户头像、名称不见了：(因为当时是用对象存的，并非持久化，一刷新就没了，也用守卫解决)

3.以及路由跳转进度条业务，用户信息过期重新登录，也用守卫来做

4.2

十五、路由鉴权-进度条(路由守卫)

新建src/permission.ts，用于路由鉴权(某一个路由什么条件下可以访问、什么条件下不可以访问)

在入口文件main.ts中引入它

    //引入路由鉴权文件
    import './permisstion'

安装进度条插件nprogress：pnpm i nprogress，引入permission.ts使用

    //src/permission.ts
    
    import router from './router'
    import nprogress from 'nprogress'
    //引入进度条样式
    import 'nprogress/nprogress.css'
    //去掉进度条加载的小圆圈
    nprogress.configure({ showSpinner: false })
    
    //全局守卫:项目当中任意路由切换都会触发的钩子
    //全局前置守卫
    router.beforeEach(async (to: any, from: any, next: any) => {
      nprogress.start()//进度条开始
      next()
    })
    //全局后置守卫
    router.afterEach((to: any, from: any) => {
      nprogress.done()//进度条消失
    })
    

可以调整进度条样式node_modules/nprogress/nprogress.css

十六、路由鉴权

全部路由组件:登录|404|任意路由|首页|数据大屏|权限管理(三个子路由)|商品管理(四个子路由)



1.(未)登录时(不)可访问的路由(其他后续问题1)

用户未登录:可以访问login,其余六个路由不能访问(指向login)

用户登录成功:不可以访问login[指向首页],其余的路由可以访问

是否登录可以用是否有token来判断(解决昨天其他后续问题1)

于是在permission.ts中引入用户信息仓库

    //获取用户相关的小仓库内部token数据,去判断用户是否登录成功
    import useUserStore from './store/modules/user'
    //此时在组件外部，需要引入大仓库，才能使用小仓库数据
    import pinia from './store'
    const userStore = useUserStore(pinia)
    
    //全局前置守卫中
    //获取token,去判断用户登录、还是未登录
      const token = userStore.token

用户未登录的情况：（没有token）全局前置守卫中，如果是登录页面，可以访问，输入网址访问其他时，禁止访问，并指向登录页面

将试图访问的路径以query参数带给path，将来登录成功，可以直接跳转该页面

    if(token){
    
      }else{
        //用户未登录判断
        if(to.path=='/login'){
          next()
        }else{
          next({path:'/login',query: { redirect: to.path }})
        }
      }

用户已经登录的情况：不允许访问登录，跳到首页，其他可以放行

    //用户登录判断
      if (token) {
        //登录成功,访问login,不能访问,指向首页
        if (to.path == '/login'){
          next({ path: '/' })
        }else{
          next()
        }
      } 



2.用守卫发请求拿到用户信息（其他后续问题2）(async  await try catch)

访问组件 没有用户信息时，用守卫发请求拿到用户信息再放行（解决昨天其他后续问题2）(async  await try catch)

这样就不需要在每个组件onMounted获取用户信息了

登录成功访问其余六个路由时，添加判断：如果有用户信息，就放行，没有就在守卫这里 发请求获取用户信息（使用之前十三中定义的userInfo）

    //permission.ts
    
    //全局前置守卫中
    //获取用户名字
      const username = userStore.username
      
    //登录成功访问其余六个路由(登录排除)
    //有用户信息
    if(username){
      next()
    }else{
      //如果没有用户信息,在守卫这里发请求获取到了用户信息再放行
      try{
        //获取到用户信息后再放行
        await userStore.userInfo()
        next()
      }catch (error) {}
    }

在用户信息仓库中，添加userInfo方法返回的成功或失败信息

    async userInfo() {
          //获取用户信息存在仓库中(用户头像、名字)
          let result = await reqUserInfo()
          //如果获取用户信息成功，存储用户信息
          if (result.code == 200) {
            this.username = result.data.checkUser.username
            this.avatar = result.data.checkUser.avatar
              
            return 'ok'
              
          } else {
            return Promise.reject('获取用户信息失败')
          }
        },

此时，之前在home组件中onMounted获取用户信息就可以删掉了，交给全局前置守卫来做。

catch分支：未获得用户信息，说明1.token过期:获取不到用户信息了，2.用户手动修改了本地存储token

此时需要 退出登录->用户相关的数据清空，同时也加上query参数，这样重新登录就回到当前页面

    catch (error) {
      //token过期:获取不到用户信息了
      //用户手动修改本地存储token
      //退出登录->用户相关的数据清空
      await userStore.userLogout()
      next({ path: '/login', query: { redirect: to.path } })
    }

更改页签标题

    import setting from './setting'
    //全局前置路由守卫
    document.title = `${setting.title} - ${to.meta.title}`



真实接口替换

替换后发现接口可用，但不稳定

1.env新增服务器字段

在三个env环境文件中新增服务器字段VITE_SERVE='http://sph-api.atguigu.cn'

2.获取各种环境中对应的变量

在vite.config.ts中，引入loadEnv，来获取各种环境中对应的变量

    import { defineConfig, loadEnv } from 'vite'
    
    export default defineConfig(({ command,mode }) => {
        //获取各种环境中对应的变量(mode是模式变量，默认开发环境，process.cwd()是文件位置)
        let env=loadEnv(mode,process.cwd())
    })

3.配置代理跨域

获取环境变量env后，读取其中的服务器地址，server:{proxy:{}}是vite提供的代理，[env.VITE_APP_BASE_API]是不同环境下的关键字。

    //vite.config.ts
        server: {
          proxy: {
              //获取不同环境下的关键字
            [env.VITE_APP_BASE_API]: {
              //获取数据的服务器地址设置
              target: env.VITE_SERVE,
              //需要代理跨域
              changeOrigin: true,
              //路径重写（将/api换成空字符串，因为真实服务器路径上没有）
              rewrite: (path) => path.replace(/^\/api/, ''),
            },
          },
        },

4.替换api

来到api/user/index.ts

    //项目用户相关的请求接口
    enum API {
      LOGIN_URL = '/admin/acl/index/login',
      USERINFO_URL = '/admin/acl/index/info',
      LOGOUT_URL = '/admin/acl/index/logout',
    }
    
    //登录接口
    export const reqLogin = (data: loginFormData) =>
      request.post<any, loginResponseData>(API.LOGIN_URL, data)
    //获取用户信息
    export const reqUserInfo = () =>
      request.get<any, userInfoReponseData>(API.USERINFO_URL)
    //退出登录
    export const reqLogout = () => request.post<any, any>(API.LOGOUT_URL)
    

5.替换仓库中的方法

替换store/modules/user.ts

    //去掉了引入假接口的数据类型：
    //引入数据类型
    import type { loginForm, loginResponseData } from '../../api/user/type'
    
    
    //引入登录，获取用户信息，退出登录 接口
    import { reqLogin, reqUserInfo,reqLogout } from '../../api/user'
    
    
    //更改actions中的方法
    
    actions: {
        //用户登录的方法
        async userLogin(data: loginFormData) {
          //登录请求
          const result: loginResponseData = await reqLogin(data)
          //登录请求:成功200->token
          //登录请求:失败201->登录失败错误的信息
          if (result.code == 200) {
            //pinia仓库存储一下token
            //由于pinia|vuex存储数据其实利用js对象
            this.token = result.data as string
            //本地存储持久化存储一份
            SET_TOKEN(result.data as string)
            //能保证当前async函数返回一个成功的promise
            return 'ok'
          } else {
            return Promise.reject(new Error(result.data))
          }
        },
        //获取用户信息方法
        async userInfo() {
          //获取用户信息进行存储仓库当中[用户头像、名字]
          const result: userInfoReponseData = await reqUserInfo()
          //如果获取用户信息成功，存储一下用户信息
          if (result.code == 200) {
            this.username = result.data.name
            this.avatar = result.data.avatar
            this.buttons = result.data.buttons
            //计算当前用户需要展示的异步路由
            const userAsyncRoute = filterAsyncRoute(
              cloneDeep(asnycRoute),
              result.data.routes,
            )
            //菜单需要的数据整理完毕
            this.menuRoutes = [...constantRoute, ...userAsyncRoute, anyRoute]
            //目前路由器管理的只有常量路由:用户计算完毕异步路由、任意路由动态追加
            ;[...userAsyncRoute, anyRoute].forEach((route: any) => {
              router.addRoute(route)
            })
            return 'ok'
          } else {
            return Promise.reject(new Error(result.message))
          }
        },
        //退出登录
        async userLogout() {
          //退出登录请求
          const result: any = await reqLogout()
          if (result.code == 200) {
            //目前没有mock接口:退出登录接口(通知服务器本地用户唯一标识失效)
            this.token = ''
            this.username = ''
            this.avatar = ''
            REMOVE_TOKEN()
            return 'ok'
          } else {
            return Promise.reject(new Error(result.message))
          }
        },
      },

6.给setting组件加异步语句

    //退出登录点击的回调
    const logout=async()=>{
        //第一件事情:需要向服务器发请求[无退出登录接口，不做]
        //第二件事情:仓库当中关于用于相关的数据清空[token|username|avatar]
        //第三件事情:跳转到登录页面
        await userStore.userLogout();
        $router.push({path:'/login',query:{redirect:$route.path}})
    }

7.定义ts类型

更改api/user/types.ts

8.引入ts

api/user/index.ts中和modules/user.ts引入ts类型

此时项目可以正常访问

重要且重复使用的：api接口配置与使用

品牌管理模块静态搭建

一、分析布局

使用e-p提供的卡片容器作为整体布局，其中上面一个按钮，下边是表格，最下面是分页器

el-table-column：列，label：列标题，border：竖方向边框

pagination：分页器

二、完成搭建

    //src/views/product/trademark
    
    <template>
      <el-card class="box-card">
        <!-- 卡片顶部添加品牌按钮 -->
        <el-button type="primary" size="default" icon="Plus">添加品牌</el-button>
        <!-- 表格组件：用于展示已有得平台数据 -->
         <!-- table:---border:可以设置表格纵向是否有边框
              table-column:---label:某一个列表 ---width:设置这列宽度 ---align:设置这一列对齐方式    
         -->
         <el-table style="margin:10px 0px" border>
            <el-table-column label="序号"  width="80px" align="center"></el-table-column>
            <el-table-column label="品牌名称"></el-table-column>
            <el-table-column label="品牌LOGO"></el-table-column>
            <el-table-column label="品牌操作"></el-table-column>
         </el-table>
         <!-- 分页器组件
             pagination
                v-model:current-page:设置分页器当前页码
                v-model:page-size:设置每一个展示数据条数
                page-sizes:用于设置下拉菜单数据
                background:设置分页器按钮的背景颜色
                layout:可以设置分页器六个子组件布局调整
         -->
        <el-pagination v-model:current-page="pageNo" v-model:page-size="limit" :page-sizes="[3, 5, 7, 9]" :background="true"
            layout="prev, pager, next, jumper,->,sizes,total" :total="400" />
      </el-card>
    </template>
    
    <script setup lang="ts">
    import { ref } from 'vue';
    //当前页码
    let pageNo = ref<number>(1);
    //每一页展示多少条数据
    let limit = ref<number>(3);
    
    </script>

三、当前效果



品牌管理模块数据展示

一、获取数据

我们需要从服务端请求数据，放进trademark组件中。

在api/product下新建四个文件夹，用来管理商品管理模块下四个子组件的接口

在api/product/trademark/index.ts中写品牌管理模块接口：

    //书写品牌管理模块接口
    import request from '../../../utils/request'
    //品牌管理模块接口地址
    enum API {
      //获取已有品牌接口
      TRADEMARK_URL = '/admin/product/baseTrademark/',
      //添加品牌
      ADDTRADEMARK_URL = '/admin/product/baseTrademark/save',
      //修改已有品牌
      UPDATETRADEMARK_URL = '/admin/product/baseTrademark/update',
      //删除已有品牌
      DELETE_URL = '/admin/product/baseTrademark/remove/',
    }
    //获取已有品牌的接口方法
    //page:获取第几页 ---默认第一页
    //limit:获取几个已有品牌的数据
    export const reqHasTrademark = (page: number, limit: number) =>
      request.get<any, any>(
        API.TRADEMARK_URL + `${page}/${limit}`,
      )

在trademark组件中引入这个接口，封装成函数，用于获取数据

    <script setup lang="ts">
    import { ref,onMounted } from 'vue';
    import { reqHasTrademark } from '../../../api/product/trademark';
    //当前页码
    let pageNo = ref<number>(1);
    //每一页展示多少条数据
    let limit = ref<number>(3);
    //获取已有品牌的接口封装为一个函数:在任何情况下向获取数据,调用此函数即可
    const getHasTrademark=async ()=>{
      let result= await reqHasTrademark(pageNo.value, limit.value)
      console.log(result);
      
    }
    //组件挂载完毕钩子---发一次请求,获取第一页、一页三个已有品牌数据
    onMounted(()=>{
      getHasTrademark()
    })
    </script>

此时打印result，可以获取数据（不稳定）



二、展示在模板

我们需要其中的records数组，以及总数据量total

于是，在trademark组件中新定义total数据，存储已有品牌数据总数，新定义trademarkArr存储已有品牌的数据，放进模板

    //存储已有品牌数据总数
    let total = ref<number>(0);
    //存储已有品牌的数据(数组中有三个对象)
    let trademarkArr = ref<any>([]);
    
    if(result.code==200){
        total.value = result.data.total;
        trademarkArr.value = result.data.records;
      }
    
    //模板中
    <el-table ... :data="trademarkArr">
    <el-pagination ... :total="total" />

使用e-q提供的table-column属性向表格中添加数据。索引值<el-table-column ... type='index'>，品牌名<el-table-column label="品牌名称" prop="tmName">,品牌logo（插槽）<img :src="row.logoUrl" ...;">

模板：

    <el-table style="margin:10px 0px" border :data="trademarkArr">
            <el-table-column label="序号"  width="80px" align="center" type='index'></el-table-column>
            <!-- table-column:默认展示数据用div，也可以用插槽templete,自己决定该列每一项的结构样式 -->
            <el-table-column label="品牌名称" prop="tmName"></el-table-column>
            <el-table-column label="品牌LOGO">
              <!-- 插槽，row是数组中的对象，$index是索引值 -->
              <template #="{row, $index}">
                <img :src="row.logoUrl" style="width: 100px;height: 100px;">
              </template>
            </el-table-column>
            <el-table-column label="品牌操作">
              <template #="{ row, $index }">
                <el-button type="primary" size="small" icon="Edit"></el-button>
                <el-button type="primary" size="small" icon="Delete"></el-button>
              </template>
            </el-table-column>
         </el-table>

此时效果：



ts类型定义

api/product/trademark/type.ts

    export interface ResponseData {
      code: number
      message: string
      ok: boolean
    }
    
    //已有的品牌的ts数据类型
    export interface TradeMark {
      id?: number
      tmName: string
      logoUrl: string
    }
    
    //包含全部品牌数据的ts类型
    export type Records = TradeMark[]
    
    //获取的已有全部品牌的数据ts类型
    export interface TradeMarkResponseData extends ResponseData {
      data: {
        records: Records
        total: number
        size: number
        current: number
        searchCount: boolean
        pages: number
      }
    }
    

回到api/product/trademark/index.ts引入使用

    import type { TradeMarkResponseData } from './type'
    
    export const reqHasTrademark = (page: number, limit: number) =>
      request.get<any, TradeMarkResponseData>(
        API.TRADEMARK_URL + `${page}/${limit}`,
      )

在trademark组件中引入使用

    import type { Records,TradeMarkResponseData } from '../../../api/product/trademark/type';
    
    //存储已有品牌的数据(数组中有三个对象)
    let trademarkArr = ref<Records>([]);
    //获取已有品牌的接口封装为一个函数:在任何情况下向获取数据,调用此函数即可
    const getHasTrademark=async ()=>{
      let result:TradeMarkResponseData...
    }

分页器功能实现

pagination的属性使用，比如pager-count属性：设置连续页码数量

一、页码变化

使用pagination的属性@current-change，定义事件：当页码发生变化时调用getHasTrademark再次发送请求

也可以封装成回调函数，这时对于当前页码变化的自定义事件，组件pagination给父组件回传了数据（当前页码），由于v-model绑定，不需要收集该数据

    <el-pagination @current-change="getHasTrademark"... />

二、下拉菜单

@size-change="sizeChange"，当下拉菜单发生变化时会触发，也是重新发请求，

同时让 当前每页数据条数变化时，页码变回1:

可以写在@size-change回调函数sizeChange中：

    const sizeChange=()=>{
      //当前每页数据条数变化时，页码变回1
      pageNo.value=1
      getHasTrademark()
    } 

也可以作为默认参数给getHasTrademark()，如果没有传入页码，则页码默认值为1

    const getHasTrademark=async (pager=1)=>{
     ...
    }

添加修改品牌对话框静态搭建

一、新建对话框，点击事件打开

使用e-p组件Dialog对话框(title先写死，后面再改)

    <!-- 对话框组件：在添加品牌与修改已有品牌业务时使用的结构 -->
       <!-- 
          v-model:属性用户控制对话框的显示与隐藏的 true显示 false隐藏
          title:设置对话框左上角标题
        -->
    
    <el-dialog v-model="dialogFormVisible" title="添加品牌"></el-dialog>
    
    //控制对话框显示与隐藏  默认隐藏
    let dialogFormVisible=ref<boolean>(false)

给添加品牌按钮加上点击事件@click="addTrademark"，编辑图标按钮添加点击事件@click="updateTrademark",

定义回调：

    //添加品牌按钮的回调
    const addTrademark=()=>{
      dialogFormVisible.value=true
    }
    //修改已有品牌按钮的回调
    const updateTrademark=()=>{
      dialogFormVisible.value=true
    }

二、对话框的静态搭建

最上面是title，里面是表单中两个表单项：品牌名称+文本框，品牌logo+上传图片(upload组件“用户头像”)；

右下角是取消和确定按钮(dialog的具名插槽footer)，此外，设置label-width标签，使表单项文字对齐

    <!-- 对话框组件：在添加品牌与修改已有品牌业务时使用的结构 -->
      <!-- 
          v-model:属性用户控制对话框的显示与隐藏的 true显示 false隐藏
          title:设置对话框左上角标题
        -->
    
    <el-dialog v-model="dialogFormVisible" title="添加品牌">
        <el-form style="width: 80%;">
            
          <!-- 表单中的两个表单项 -->
          <el-form-item label="品牌名称" label-width="80px">
            <el-input placeholder="请您输入品牌名称"></el-input>
          </el-form-item>
          <el-form-item label="品牌LOGO" label-width="80px">
            <el-upload class="avatar-uploader" action="/api/admin/product/fileUpload" :show-file-list="false"
              :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
              <img v-if="trademarkParams.logoUrl" :src="trademarkParams.logoUrl" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon">
                <Plus />
              </el-icon>
            </el-upload>
          </el-form-item>
        </el-form>
    
        <!-- 具名插槽 footer -->
        <template #footer>
          <el-button type="primary" size="default" @click="cancel">取消</el-button>
          <el-button type="primary" size="default" @click="confirm">确定</el-button>
        </template>
      </el-dialog>
    
    
    //事件
    //对话框底部取消按钮
    const cancel = () => {
      //对话框隐藏
      dialogFormVisible.value = false;
    }
    const confirm = () => {
      //对话框隐藏
      dialogFormVisible.value = false;
    }
    
    
    //添加图片样式
    .avatar-uploader .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    
    .avatar-uploader .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }



4.3

品牌管理模块(增删改查)

添加新增品牌数据

一、添加接口

新增与修改id时携带的参数类似。区别是新增时不需要提供id，修改时需要告知id

在api中写添加修改品牌的接口

    //api/product/trademark/index.ts
    
    //品牌管理模块接口地址
    enum API {
      ...
      //添加品牌
      ADDTRADEMARK_URL = '/admin/product/baseTrademark/save',
      //修改已有品牌
      UPDATETRADEMARK_URL = '/admin/product/baseTrademark/update',
    }
      
      
    //添加与修改已有品牌接口方法
    export const reqAddOrUpdateTrademark = (data: TradeMark) => {
      //修改已有品牌的数据
      if (data.id) {
        return request.put<any, any>(API.UPDATETRADEMARK_URL, data)
      } else {
        //新增品牌
        return request.post<any, any>(API.ADDTRADEMARK_URL, data)
      }
    }

二、收集新增品牌数据

回到trademark组件

定义收集新增品牌数据

    import { reactive } from 'vue';
    import type { ...TradeMark } from '../../../api/product/trademark/type';
    //定义收集新增品牌数据
    let trademarkParams=reactive<TradeMark>({
      tmName:'',
      logoUrl:''
    })

v-model收集新增品牌名称数据

    <el-input placeholder="请您输入品牌名称" v-model="trademarkParams.tmName"></el-input>

上传图片的el-upload组件：

action属性是上传到服务器的接口，发的是post请求，要带关键词api；

show-file-list是上传时展示上传文件列表，这里不需要

before-upload：上传文件之前触发的钩子，可以用来约束上传文件的类型、格式、大小等

on-success：文件上传成功的钩子（收集上传图片的地址，给logoUrl）

    <el-upload class="avatar-uploader" action="/api/admin/product/fileUpload" :show-file-list="false"
      :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
      <img v-if="trademarkParams.logoUrl" :src="trademarkParams.logoUrl" class="avatar" />
      <el-icon v-else class="avatar-uploader-icon">
        <Plus />
      </el-icon>
    </el-upload>
    
    import type { UploadProps } from 'element-plus'
    import { ElMessage } from 'element-plus'
    
    //配置before-upload的回调函数beforeAvatarUpload：
    //上传图片组件->上传图片之前触发的钩子函数
    const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
      //钩子是在图片上传成功之前触发,上传文件之前可以约束文件类型与大小
      //要求:上传文件格式png|jpg|gif 4M  (rawFile是当前上传的文件对象)
      if (rawFile.type == 'image/png' || rawFile.type == 'image/jpeg' || rawFile.type == 'image/gif') {
        //文件大小是字节，除以1024是kb，再除以1024是M
        if (rawFile.size / 1024 / 1024 < 4) {
          return true;
        } else {
          ElMessage({
            type: 'error',
            message: '上传文件大小小于4M'
          })
          return false;
        }
      } else {
        ElMessage({
          type: 'error',
          message: "上传文件格式务必PNG|JPG|GIF"
        })
        return false;
      }
    }
    
    
    //图片上传成功钩子on-success
    const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
      //response:即为当前这次上传图片post请求服务器返回的数据
      //收集上传图片的地址,添加一个新的品牌的时候带给服务器
      trademarkParams.logoUrl = response.data;
    }

当前效果：



三、完成添加的品牌上传服务器

trademark组件引入之前api中定义的请求方法reqAddOrUpdateTrademark

    import { ... reqAddOrUpdateTrademark } from '../../../api/product/trademark';
    //确定按钮的回调事件

在‘确定’按钮的回调中，需要完成：

1. 发送请求，获取返回结果
2. 判断返回的code，200成功时：
   关闭对话框，dialogFormVisible.value = false;
   弹出成功提示信息，右下角‘共..条’更新
       //添加品牌成功
         if (result.code == 200) {
           //对话框隐藏
           dialogFormVisible.value = false;
           //弹出提示信息
           ElMessage({
             type: 'success',
             message: '添加品牌成功'
           })
           //再次发请求获取全部品牌数据
           getHasTrademark()
         }
3. 请求失败时：
       else { 
           //添加品牌失败
           ElMessage({
             type: 'error',
             message: '添加品牌失败'
           })
           //对话框隐藏
           dialogFormVisible.value = false;
         }
   
4. 点击‘添加品牌’时，清空数据
       //清空收集数据
       trademarkParams.tmName=''
       trademarkParams.logoUrl=''
       trademarkParams.id = 0
       
5. 确定按钮回调：(由于用了发送请求的方法，所以这里使用了异步来获取请求结果)
       const confirm = async () => {
         let result: any = await reqAddOrUpdateTrademark(trademarkParams)
         //添加品牌成功
         if (result.code == 200) {
           //对话框隐藏
           dialogFormVisible.value = false;
           //弹出提示信息
           ElMessage({
             type: 'success',
             message: '添加品牌成功'
           })
           //再次发请求获取全部品牌数据
           getHasTrademark()
       
         } else {
           //添加品牌失败
           ElMessage({
             type: 'error',
             message: '添加品牌失败'
           })
           //对话框隐藏
           dialogFormVisible.value = false;
       
         }
       }
   
   

完成修改业务

给修改已有品牌按钮的回调注入row（当前已有的品牌），点击修改按钮，将row赋值给trademarkParams

    <el-button ... icon="Edit" @click="$event=>updateTrademark(row)"></el-button>
    
    //updateTrademark
    trademarkParams.tmName=row.tmName
    trademarkParams.logoUrl=row.logoUrl

此外，还需要收集当前已有品牌的id (trademarkParams定义的ts类型是TradeMark，可以有id属性)

    trademarkParams.id=row.id

确定按钮的回调已经做好了，此时由于有id，用的都是reqAddOrUpdateTrademark方法，所以发送的是修改请求

    const updateTrademark = (row:TradeMark) => {
      dialogFormVisible.value = true
      //trademarkParams.id=row.id
      //展示已有品牌的数据
      //trademarkParams.tmName=row.tmName
      //trademarkParams.logoUrl=row.logoUrl
        
      //ES6语法合并对象
      Object.assign(trademarkParams, row);
    }

此时需要修改当时被写死的 ‘添加品牌’ 对话框左上角标题：用三元表达式判断

    <el-dialog v-model="dialogFormVisible" :title="trademarkParams.id ? '修改品牌' : '添加品牌'">

修改 点击确定时的提示信息

    ElMessage({
          type: 'success',
          message: trademarkParams.id ? '修改品牌成功' : '添加品牌成功'
        })
    //添加品牌失败
        ElMessage({
          type: 'error',
          message: trademarkParams.id ? '修改品牌失败' : '添加品牌失败'
        })

修改完成时留在当前页面：给点击确定按钮时再次发的getHasTrademark()传参(由于默认参数是1，所以会跳转1)

    getHasTrademark(trademarkParams.id ? pageNo.value : 1)

表单校验(nextTick)

e-p的form组件提供了表单校验功能

将el-dialog中的 el-form 作为表单组件，里面有两个表单项el-form-item

给el-form绑定校验对象trademarkParams，校验规则rules； 给el-form-item配置校验项prop

    <el-form style="width: 80%;" :model="trademarkParams" :rules="rules">
    <el-form-item label="品牌名称" label-width="80px" prop="tmName">
    <el-form-item label="品牌LOGO" label-width="80px" prop="logoUrl">

写校验规则

    //品牌自定义校验规则方法
    const validatorTmName = (rule: any, value: any, callBack: any) => {
      //rule:规则对象，value：文本框内容，callBack：相应放行函数
      //是当表单元素触发blur时候,会触发此方法
      //自定义校验规则：品牌名称位数大于等于两位
      if (value.trim().length >= 2) {
        callBack();
      } else {
        //校验未通过返回的错误的提示信息
        callBack(new Error('品牌名称位数大于等于两位'))
      }
    }
    //品牌LOGO图片的自定义校验规则方法
    const validatorLogoUrl = (rule: any, value: any, callBack: any) => {
      //如果图片上传
      if (value) {
        callBack();
      } else {
        callBack(new Error('LOGO图片务必上传'))
      }
    }
    //表单校验规则对象
    const rules = {
      tmName: [
        //required:这个字段务必校验,表单项前面出来五角星
        //trigger:代表触发校验规则时机[blur、change]
        { required: true, trigger: 'blur', validator: validatorTmName }
      ],
      logoUrl: [
        { required: true, validator: validatorLogoUrl }
      ]
    }

由于图片上传无法指定触发校验时机trigger，于是利用表单的validate()，点击确定按钮时，进行触发

formRef.value.validate()返回一个promise，await 成功后再发请求

    <el-form ... ref="formRef">
    //获取el-form组件实例
    let formRef=ref()
    
    /点击对话框中的确定按钮
    const confirm = async () => {
      //发送请求前，校验整个表单
      await formRef.value.validate();
        ...}

校验效果：



后续问题：

1.上传图片后，logo图片务必上传的错误提示不会消失，所以我们需要使用Form的方法clearValidate(清理某字段表单验证信息)(el-upload的:on-success回调)

    //图片上传成功钩子(el-upload的:on-success)
    const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
      ...
      //图片上传成功,清除掉对应图片校验结果
       formRef.value.clearValidate('logoUrl');
    }

2.点击添加品牌直接确定，关闭后再次点击打开时，两条错误信息不会消失，处理：点击按钮前先清理

问题：第一次点添加品牌时，还未获取el-form，此时调用它身上的clearValidate方法会报错，第二次就没事(点击修改edit时也要加一下，因为用的是同一个对话框)

    //添加品牌按钮的回调
    const addTrademark = () => {
     ...
      //第一种写法:ts的问号语法
      // formRef.value?.clearValidate('tmName');
      // formRef.value?.clearValidate('logoUrl');
     //第二种写法（引入vue的nextTick）
      nextTick(() => {
        formRef.value.clearValidate('tmName');
        formRef.value.clearValidate('logoUrl');
      })
    }
    
    
    const updateTrademark = (row: TradeMark) => {
      //清空校验错误的提示信息
      nextTick(() => {
        formRef.value.clearValidate('tmName');
        formRef.value.clearValidate('logoUrl');
      })
      。。。
    }

删除业务

在api中配置 删除接口和业务

    //api/product/trademark/index.ts
    
    enum API {
        ...
      //删除已有品牌
      DELETE_URL = '/admin/product/baseTrademark/remove/',
    }
        
    //删除某一个已有品牌的数据
    export const reqDeleteTrademark = (id: number) =>
      request.delete<any, any>(API.DELETE_URL + id)
      

使用e-p提供的组件 气泡确认框Popconfirm，用于确认是否删除

回到trademark组件，用气泡确认框Popconfirm替换删除按钮

el-popconfirm的属性：title提示信息，width气泡宽度， icon提示信息前图标，@confirm点击确认事件

定义点击确认的回调：传入当前品牌信息的id，发送删除请求，如果删除成功，提示成功信息，并重新获取数据(当前页面还有数据，删完就留在当前页面，否则回到上一页)，删除失败，则提示失败信息。

    <el-popconfirm :title="`您确定要删除${row.tmName}?`" width="250px" icon="Delete" @confirm='removeTradeMark(row.id)'>
         <template #reference>
           <el-button type="primary" size="small" icon="Delete"></el-button>
         </template>
    </el-popconfirm>
    
    
    import { reqDeleteTrademark } from '../../../api/product/trademark';
    
    //气泡确认框确定按钮的回调
    const removeTradeMark = async (id: number) => {
        //点击确定按钮删除已有品牌请求
        let result = await reqDeleteTrademark(id);
        if (result.code == 200) {
            //删除成功提示信息
            ElMessage({
                type: 'success',
                message: '删除品牌成功'
            });
            //再次获取已有的品牌数据(当前页面还有数据，删完就留在当前页面，否则回到上一页)
            getHasTrademark(trademarkArr.value.length > 1 ? pageNo.value : pageNo.value - 1);
        } else {
            ElMessage({
                type: 'error',
                message: '删除品牌失败'
            })
        }
    }

属性管理模块

静态搭建

功能分析：共有三级的分类，先确定一级分类，根据一级的id来获取二级分类目录，再根据二级所选内容id来获取三级分类目录，最后根据选择的三级目录中内容获取已有属性和属性值，展示在下方卡片中，并且可以增删改查



结构分析：两个卡片组件（el-card），上面的卡片中是行内form表单（设置inline属性为true）












