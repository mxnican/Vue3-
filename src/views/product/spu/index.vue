<template>
  <div>
    <!-- 三级分类 -->
    <Category :scene="scene"></Category>
    <el-card style="margin:10px 0px">
      <el-button type="primary" size="default" icon="Plus">添加SPU</el-button>
      <el-table style="margin:10px 0px">
        <el-table-column label='序号' type="index" align="center" width="80px"></el-table-column>
        <el-table-column label='SPU名称'></el-table-column>
        <el-table-column label='SPU描述'></el-table-column>
        <el-table-column label='操作'></el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[3, 5, 7, 9]"
        :background="true" layout="prev, pager, next, jumper,->,sizes,total" :total="total" @current-change="getHasSpu"
        @size-change="changeSize" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
//获取分类的仓库
import useCategoryStore from '../../modules/category';
//场景的数据
let scene = ref<number>(0);
//分页器默认页码
let pageNo = ref<number>(1);
//每一页展示几条数据
let pageSize = ref<number>(3);
//存储已有的SPU的数据
let records = ref<Records>([]);
//存储已有SPU总个数
let total = ref<number>(0);

let show = ref<boolean>(false);
</script>

<style lang="scss" scoped></style>