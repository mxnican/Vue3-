<template>
  <el-table :data="PermisstionArr" style="width: 100%; margin-bottom: 20px" row-key="id" border>
    <el-table-column label="名称" prop="name"></el-table-column>
    <el-table-column label="权限值" prop="code"></el-table-column>
    <el-table-column label="修改时间" prop="updateTime"></el-table-column>
    <el-table-column label="操作">
    </el-table-column>
  </el-table>
  <!-- 对话框组件:添加或者更新已有的菜单的数据结构 -->
  <el-dialog title="更新菜单">
    <!-- 表单组件:收集新增与已有的菜单的数据 -->
    <el-form>
      <el-form-item label="名称">
        <el-input placeholder="请你输入菜单名称"></el-input>
      </el-form-item>
      <el-form-item label="权限">
        <el-input placeholder="请你输入权限数值"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button>取消</el-button>
        <el-button type="primary">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>

</script>

<style lang="scss" scoped></style>