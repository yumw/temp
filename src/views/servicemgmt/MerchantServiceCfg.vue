<template>
  <div class="app-container">
    <el-form :inline="true" :model="form">
      <el-form-item label="商户号:">
        <el-input v-model="form.jnlNo"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="query">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="table-container">
      <div class="table-toolbar">
        <el-button type="primary" @click="add">新增</el-button>
      </div>
      <el-table ref="multipleTable" :data="tableData" border :stripe="stripe" style="width: 100%">
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="channelCode" label="商户号"></el-table-column>
        <el-table-column prop="channelName" label="服务名称"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column prop="updateTime" label="更新时间"></el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template slot-scope="scope">
            <el-button @click="handleEdit" type="primary" size="mini">编辑</el-button>
            <el-button @click="handleDelete" type="warning" size="mini">删除</el-button>
          </template>
        </el-table-column>`
      </el-table>
      <el-pagination class="mt10" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10,20,30]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="tableData.length">
      </el-pagination>
    </div>
    <div class="mask"></div>
    <div class="waitForward">建设中，敬请期待.....</div>
  </div>
</template>
<script>
export default {
  name: 'MerchantServiceCfg',
  data() {
    return {
      form: {
        jnlNo: ''
      },
      stripe: true,
      tableData: [
        {
          channelCode: '1011',
          channelName: '支付宝',
          channelType:'支付宝',
          channelStatus:'正常',
          callbackAddress:'http://app.youcash.com',
          encryptWay:'base64',
          encryptParam:'param',
          createTime: '2018-05-16 10:04:39',
          updateTime: '2018-05-16 10:04:38'
        },
        {
          channelCode: '1011',
          channelName: '支付宝',
          channelType:'支付宝',
          channelStatus:'正常',
          callbackAddress:'http://app.youcash.com',
          encryptWay:'base64',
          encryptParam:'param',
          createTime: '2018-05-16 10:04:39',
          updateTime: '2018-05-16 10:04:38'
        },{
          channelCode: '1011',
          channelName: '支付宝',
          channelType:'支付宝',
          channelStatus:'正常',
          callbackAddress:'http://app.youcash.com',
          encryptWay:'base64',
          encryptParam:'param',
          createTime: '2018-05-16 10:04:39',
          updateTime: '2018-05-16 10:04:38'
        },{
          channelCode: '1011',
          channelName: '支付宝',
          channelType:'支付宝',
          channelStatus:'正常',
          callbackAddress:'http://app.youcash.com',
          encryptWay:'base64',
          encryptParam:'param',
          createTime: '2018-05-16 10:04:39',
          updateTime: '2018-05-16 10:04:38'
        },{
          channelCode: '1011',
          channelName: '支付宝',
          channelType:'支付宝',
          channelStatus:'正常',
          callbackAddress:'http://app.youcash.com',
          encryptWay:'base64',
          encryptParam:'param',
          createTime: '2018-05-16 10:04:39',
          updateTime: '2018-05-16 10:04:38'
        },
      ]
    }
  },
  methods: {
    add(){},
    query() {},
    handleEdit() {},
    handleDelete(){},
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
