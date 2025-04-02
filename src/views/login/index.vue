<template>
  <div class="login_container">
    <!-- element-plus的栅格系统是24份 -->
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <!-- 登录的表单 -->
        <el-form class="login_form" :model="loginForm" :rules="rules" ref="loginForms">
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
import {useRouter,useRoute} from 'vue-router'
//引入消息提示框，用于登录成功或失败时提示
import { ElNotification } from 'element-plus';
//引入获取当前时间的函数
import { getTime } from '../../utils/time';
//引入用户相关小仓库
import useUserStore from '../../store/modules/user';
let useStore=useUserStore()
//获取el-form组件
let loginForms=ref()
//获取路由器
let $router=useRouter()
//获取路由对象
let $route=useRoute()
//定义变量控制按钮加载效果
let loading=ref(false)
//收集账号与密码的数据
let loginForm = reactive({ username: 'admin', password: '111111' });
//登录按钮回调
const login=async()=>{
  //保证全部表单项校验通过再发请求
  //validate返回一个promise对象，只有符合规范，promise才是成功的
  await loginForms.value.validate()

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
    //编程式路由导航跳转到首页(或query参数中的路径)
    //判断登录时路由路径中是否有query参数，有就往query参数跳，没有就跳到首页
    let redirect:any=$route.query.redirect
    $router.push({path:redirect||'/'})
    //登录成功提示信息
    ElNotification({
      type:'success',
      message:'欢迎回来',
      title:`${getTime()}好`
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

//自定义校验规则函数
const validatorUserName = (rule: any, value: any, callback: any) => {
  //rule:即为校验规则对象
  //value:即为表单元素文本内容
  //callback函数:如果符合条件callBack放行通过即可
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
  username: [
    // { required: true, min: 6, max: 10, message: '账号长度至少六位', trigger: 'change' }
    { trigger: 'change', validator: validatorUserName }
  ],
  password: [
    // { required: true, min: 6, max: 15, message: '密码长度至少6位', trigger: 'change' }
    { trigger: 'change', validator: validatorPassword }
  ]
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