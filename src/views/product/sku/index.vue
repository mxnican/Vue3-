<template>
  <el-card>
    <el-table border style="margin: 10px 0px;">
      <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
      <el-table-column label="名称" show-overflow-tooltip width="150px"></el-table-column>
      <el-table-column label="描述" show-overflow-tooltip width="150px"></el-table-column>
      <el-table-column label="图片" width="150px"></el-table-column>
      <el-table-column label="重量" width="150px"></el-table-column>
      <el-table-column label="价格" width="150px"></el-table-column>
      <el-table-column label="操作" width="250px" fixed="right"></el-table-column>
    </el-table>
    <el-pagination :current-page="pageNo" :page-size="pageSize" :page-sizes="[10, 20, 30, 40]" :background="true"
      layout="prev, pager, next, jumper,->,sizes,total" :total="total" />
    <!-- 抽屉组件:展示商品详情 -->
    <el-drawer></el-drawer>
  </el-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
//分页器当前页码
let pageNo = ref<number>(1);
//每一页展示几条数据
let pageSize = ref<number>(10);
let total = ref<number>(0);
</script>

<style lang="scss" scoped>
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>