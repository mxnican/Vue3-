<template>
  <el-card>
    <el-form :inline="true" class="form">
      <el-form-item label="职位搜索">
        <el-input placeholder="请输入搜索职位的关键字"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="default">搜索</el-button>
        <el-button type="primary" size="default">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 10px 0px;">
    <el-button type="primary" size="default" icon="Plus">添加职位</el-button>
    <!-- table展示用户信息 -->
    <el-table style="margin: 10px 0px;">
      <el-table-column label="#" align="center" type="index"></el-table-column>
      <el-table-column label="ID" align="center" prop="id"></el-table-column>
      <el-table-column label="职位名称" align="center" prop="username" show-overflow-tooltip></el-table-column>
      <el-table-column label="创建时间" align="center" prop="name" show-overflow-tooltip></el-table-column>
      <el-table-column label="更新时间" align="center" prop="roleName" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" width="300px" align="center"></el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[5, 7, 9, 11]"
      :background="true" layout="prev, pager, next, jumper,->,sizes,total" :total="total" />
  </el-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
//默认页码
let pageNo = ref<number>(1);
//一页展示几条数据
let pageSize = ref<number>(5);
//用户总个数
let total = ref<number>(0);
</script>

<style lang="scss" scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>