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
