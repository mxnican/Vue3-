<template>
  <!-- 右侧静态 -->
   <el-button size="small" icon="Refresh" circle @click="updateRefsh"></el-button>
   <el-button size="small" icon="FullScreen" circle @click="fullScreen"></el-button>
   <el-button size="small" icon="Setting" circle></el-button>
   <img :src="userStore.avatar" alt="" style="width: 24px;height: 24px; margin: 0 10px;border-radius: 50%;">
   <!-- 下拉菜单退出登录 -->
    <el-dropdown>
         <span class="el-dropdown-link">
             {{ userStore.username }}
             <el-icon class="el-icon--right">
                 <arrow-down />
             </el-icon>
         </span>
         <template #dropdown>
             <el-dropdown-menu>
                 <el-dropdown-item @click="logout">退出登录</el-dropdown-item> 
             </el-dropdown-menu>
         </template>
    </el-dropdown>
</template>

<script setup lang="ts">
import {useRouter,useRoute} from 'vue-router'
//获取骨架小仓库
import useLayOutSettingStore from '../../../store/modules/setting';
//获取用户相关小仓库
import useUserStore from '../../../store/modules/user';
let layOutSettingStore =useLayOutSettingStore()
let userStore=useUserStore()
//获取路由器对象
let $router=useRouter()
//获取路由对象
let $route=useRoute()
//刷新按钮点击回调
const updateRefsh=()=>{
    layOutSettingStore.refsh=!layOutSettingStore.refsh
}
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
//退出登录点击的回调
const logout=()=>{
    //第一件事情:需要向服务器发请求[无退出登录接口，不做]
    //第二件事情:仓库当中关于用于相关的数据清空[token|username|avatar]
    //第三件事情:跳转到登录页面
    userStore.userLogout();
    $router.push({path:'/login',query:{redirect:$route.path}})
}
</script>

<script lang="ts">
export default {
  name:'Setting'
}
</script>
<style scoped>

</style>