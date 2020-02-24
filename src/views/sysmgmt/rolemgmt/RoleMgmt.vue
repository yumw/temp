<template>
  <div class="app-container">
    <el-form :inline="true" :model="form">
      <el-form-item label="角色名称:">
        <el-input v-model="form.roleName"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="query">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="table-container">
      <el-button class="mb10" type="primary" @click="addNew">新增</el-button>
      <el-table
        :data="tableData"
        border
        :stripe="stripe"
        style="width: 100%">
        <el-table-column
          prop="roleName"
          label="角色名称"
          >
        </el-table-column>
        <el-table-column
          prop="rolePermission"
          label="角色权限"
          >
        </el-table-column>
        <el-table-column
          prop="creatTime"
          label="创建时间"
          >
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="修改时间"
      >
        </el-table-column>
        <el-table-column
          label="操作"
          >
          <template slot-scope="scope">
            <el-button @click="edit" type="primary" size="mini">编辑</el-button>
            <el-button @click="remove" type="danger" size="mini">删除</el-button>
          </template>
        </el-table-column>`
      </el-table>
      <el-pagination
        class="mt10"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400">
      </el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  name: 'RoleMgmt',
  data() {
    return {
      form: {},
      stripe: true,
      tableData: [
        {
          roleName: '管理员',
          rolePermission: '进件管理，渠道管理，任务管理，系统管理.......',
          creatTime: '2018-05-16 10:04:39',
          updateTime: '2018-05-16 10:04:38'
        },
        {
          roleName: '管理员',
          rolePermission: '进件管理，渠道管理，任务管理，系统管理.......',
          creatTime: '2018-05-16 10:04:39',
          updateTime: '2018-05-16 10:04:38'
        },
        {
          roleName: '管理员',
          rolePermission: '进件管理，渠道管理，任务管理，系统管理.......',
          creatTime: '2018-05-16 10:04:39',
          updateTime: '2018-05-16 10:04:38'
        }
      ]
    }
  },
  methods: {
    query() {},
    addNew() {},
    edit() {
      this.$router.push('RoleEdit')
    },
    remove() {},
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
