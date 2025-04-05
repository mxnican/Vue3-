// https://vite.dev/config/
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
//引入svg需要用到的插件
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
//node提供的模块，可获取文件相对或绝对路径（此处用于相对路径别名配置）
import path from 'path'
//mock插件提供方法
import { viteMockServe } from 'vite-plugin-mock'
export default defineConfig(({ command, mode }) => {
  //获取各种环境中对应的变量
  let env = loadEnv(mode, process.cwd())
  return {
    plugins: [
      vue(),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        symbolId: 'icon-[dir]-[name]',
      }),
      viteMockServe({
        localEnabled: command === 'serve', //保证开发阶段可以使用mock接口
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve('./src'), // 相对路径别名配置，使用 @ 代替 src
      },
    },
    //scss全局变量配置
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: '@import "@/styles/variable.scss";',
        },
      },
    },
    //代理跨域
    server: {
      proxy: {
        [env.VITE_APP_BASE_API]: {
          //获取数据的服务器地址设置
          target: env.VITE_SERVE,
          //需要代理跨域
          changeOrigin: true,
          //路径重写
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  }
})
