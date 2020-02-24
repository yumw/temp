<template>
  <el-tree
    :data="$store.getters.permission_routers"
    show-checkbox
    default-expand-all
    node-key="id"
    ref="tree"
    highlight-current
    :props="defaultProps">
  </el-tree>
</template>
<script>
export default {
  name: 'RoleEdit',
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  }
}
</script>

