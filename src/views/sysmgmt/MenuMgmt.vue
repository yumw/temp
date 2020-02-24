<template>
  <div class="app-container">
    <el-form :inline="true" :model="form">
      <el-form-item label="菜单名称:">
        <el-input v-model="form.roleName"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="query">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="table-container">
      <el-button class="mb10" type="primary" @click="addNew">新增</el-button>
      <tree-table :data="data" :columns="columns" border></tree-table>
      <el-pagination class="mt10" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[100, 200, 300, 400]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="400">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import treeTable from '@/components/TreeTable'
export default {
  name: 'MenuMgmt',
  components: { treeTable },
  data() {
    return {
      form: {},
      stripe: true,
      columns: [
        {
          text: '菜单名称',
          value: 'menuName'
        },
        {
          text: '菜单顺序',
          value: 'menuOrder'
        },
        {
          text: '菜单地址',
          value: 'menuAddress'
        },
        {
          text: '创建时间',
          value: 'createTime'
        },
        {
          text: '修改时间',
          value: 'updateTime'
        },
        {
          text: '备注',
          value: 'remark'
        },
        {
          text: '状态',
          value: 'state'
        }
      ],
      data: [
        {
          menuName: '系统管理',
          menuOrder: '4',
          menuAddress: '',
          createTime: '2018-05-16 10:04:39',
          updateTime: '2018-05-16 10:04:39',
          remark: '系统管理',
          state: '启用',
          children: [
            {
              menuName: '菜单管理',
              menuOrder: '4',
              menuAddress: '',
              createTime: '2018-05-16 10:04:39',
              updateTime: '2018-05-16 10:04:39',
              remark: '系统管理',
              state: '启用'
            },
            {
              menuName: '角色管理',
              menuOrder: '4',
              menuAddress: '',
              createTime: '2018-05-16 10:04:39',
              updateTime: '2018-05-16 10:04:39',
              remark: '系统管理',
              state: '启用'
            },
            {
              menuName: '用户管理',
              menuOrder: '4',
              menuAddress: '',
              createTime: '2018-05-16 10:04:39',
              updateTime: '2018-05-16 10:04:39',
              remark: '系统管理',
              state: '启用'
            }
          ]
        },
        {
          menuName: '进件管理',
          menuOrder: '4',
          menuAddress: '',
          createTime: '2018-05-16 10:04:39',
          updateTime: '2018-05-16 10:04:39',
          remark: '系统管理',
          state: '启用',
          children: [
            {
              menuName: '贷款申请列表',
              menuOrder: '4',
              menuAddress: '',
              createTime: '2018-05-16 10:04:39',
              updateTime: '2018-05-16 10:04:39',
              remark: '系统管理',
              state: '启用'
            },
            {
              menuName: '贷款附件列表',
              menuOrder: '4',
              menuAddress: '',
              createTime: '2018-05-16 10:04:39',
              updateTime: '2018-05-16 10:04:39',
              remark: '系统管理',
              state: '启用'
            }
          ]
        }
      ]
    }
  },
  methods: {
    query() {},
    addNew() {},
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
