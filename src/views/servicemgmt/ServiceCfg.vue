<template>
  <div class="app-container">
    <el-form :inline="true" :model="form">
      <el-form-item label="服务编码:">
        <el-input v-model="form.jnlNo"></el-input>
      </el-form-item>
      <el-form-item label="服务名称: ">
        <el-input v-model="form.jnlNo"></el-input>
      </el-form-item>
      <el-form-item label="处理方式:">
        <el-select v-model="form.jnlNo">
        </el-select>
      </el-form-item>
      <el-form-item label="服务状态:">
        <el-select v-model="form.jnlNo"></el-select>
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
        <el-table-column type="index" label="编号"></el-table-column>
        <el-table-column prop="channelCode" label="服务编码"></el-table-column>
        <el-table-column prop="channelName" label="服务名称"></el-table-column>
        <el-table-column prop="channelType" label="服务描述"></el-table-column>
        <el-table-column prop="channelStatus" label="处理方式"></el-table-column>
        <el-table-column prop="callbackAddress" label="服务状态"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column prop="updateTime" label="更新时间"></el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template slot-scope="scope">
            <el-button @click="dialogFormVisible=true" type="primary" size="mini">编辑</el-button>
            <el-button @click="dialogVisible=true" type="warning" size="mini">删除</el-button>
          </template>
        </el-table-column>`
      </el-table>
      <el-pagination class="mt10" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10,20,30]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="tableData.length">
      </el-pagination>
    </div>
    <el-dialog title="温馨提示" :visible.sync="dialogVisible" width="30%">
      <span>确认删除吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="编辑" :visible.sync="dialogFormVisible">
      <el-form :inline="true" :model="form">
        <el-form-item label="渠道编码" :label-width="formLabelWidth">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="渠道名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="渠道回调地址" :label-width="formLabelWidth">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="渠道类型" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="渠道状态">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="加密方式" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="渠道状态">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">保存</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>
    <div class="mask"></div>
    <div class="waitForward">建设中，敬请期待.....</div>
  </div>
</template>
<script>
export default {
  name: 'ServiceCfg',
  data() {
    return {
      form: {
        jnlNo: ''
      },
      stripe: true,
      dialogVisible: false,
      dialogFormVisible: false,
      formLabelWidth: '120',
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
