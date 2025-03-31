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
