<template>
  <div>
    <!-- 三级分类全局组件 -->
    <Category />
    <el-card style="margin: 10px 0;">
      <el-button type="primary" size="default" icon="Plus">添加属性</el-button>
      <el-table border style="margin: 10px 0;">
        <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
        <el-table-column label="属性名称" width="120px"></el-table-column>
        <el-table-column label="属性值名称"></el-table-column>
        <el-table-column label="操作" width="120px"></el-table-column>
      </el-table>
    </el-card>
  </div>

</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped></style>