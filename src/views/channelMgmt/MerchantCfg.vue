<template>
  <div class="app-container">
    <el-form :inline="true" :model="formQry">
      <el-form-item label="渠道编号:">
        <el-select v-model="formQry.channelCode" filterable>
            <el-option v-for="item in $store.state.globalData.channels" :key="item.channelCode" :label="item.channelName" :value="item.channelCode"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商户号: ">
        <el-input v-model="formQry.merchantCode"></el-input>
      </el-form-item>
      <el-form-item label="商户名称: ">
        <el-input v-model="formQry.merchantName"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="query(pageSize,1)">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="table-container">
      <div class="table-toolbar">
        <el-button type="primary" @click="add">新增</el-button>
      </div>
      <el-table ref="multipleTable" :data="tableData" border :stripe="stripe" style="width: 100%">
        <el-table-column prop="id" label="编号"></el-table-column>
        <el-table-column prop="channelCode" label="渠道编码"></el-table-column>
        <el-table-column prop="channelName" label="渠道名称"></el-table-column>
        <el-table-column prop="merchantCode" label="商户号"></el-table-column>
        <el-table-column prop="merchantName" label="商户名称"></el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.row)" type="primary" size="mini">编辑</el-button>
            <el-button @click="handleDelete(scope.row.id)" type="warning" size="mini">删除</el-button>
          </template>
        </el-table-column>`
      </el-table>
      <el-pagination class="mt10" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10,20,30]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog title="温馨提示" :visible.sync="dialogVisible" width="30%">
      <span>确认删除吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="comfirm">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="编辑" :visible.sync="dialogFormVisible">
      <el-form :inline="true" :model="formAddEdit" :rules="formAddEditRules" ref="formAddEdit">
        <el-form-item label="渠道名称" :label-width="formLabelWidth" prop="channelCode">
          <el-select v-model="formAddEdit.channelCode" auto-complete="off">
            <el-option v-for="item in $store.state.globalData.channels" :key="item.channelCode" :label="item.channelName" :value="item.channelCode"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商户号" :label-width="formLabelWidth" prop="merchantCode">
          <el-input v-model="formAddEdit.merchantCode" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="商户名称" :label-width="formLabelWidth">
          <el-input v-model="formAddEdit.merchantName" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="save">保存</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { merchantQuery, merchantInsert, merchantUpdate, merchantDelete, getChannelInfo } from '@/api/channelmgmt'
export default {
  name: 'MerchantCfg',
  data() {
    return {
      formQry: {
        channelCode: '',
        merchantCode: '',
        merchantName: ''
      },
      formAddEdit: {
        channelCode: '',
        merchantCode: '',
        merchantName: ''
      },
      formAddEditRules: {
        channelCode: [{ required: true, message: '请输入渠道编码', trigger: 'blur' }],
        merchantCode: [{ required: true, message: '请输入商户号', trigger: 'blur' }]
      },
      stripe: true,
      dialogVisible: false,
      dialogFormVisible: false,
      formLabelWidth: '120',
      tableData: [],
      id: '',
      total: 0,
      pageSize: 10,
      pageNum: 1
    }
  },
  created() {
    this.query(this.pageSize, this.pageNum)
  },
  methods: {
    add() {
      this.dialogFormVisible = true
      this.addEditFlag = 'add'
    },
    save() {
      this.$refs.formAddEdit.validate(valid => {
        console.log(valid)
        if (valid) {
          if (this.addEditFlag === 'add') {
            const params = Object.assign({ id: this.id }, this.formAddEdit)
            merchantInsert(params).then((response) => {
              console.log(response.data)
              this.dialogFormVisible = false
              this.query(this.pageSize, this.pageNum)
            }).catch(error => {
              console.log(error)
            })
          } else if (this.addEditFlag === 'edit') {
            const params = Object.assign({ id: this.id }, this.formAddEdit)
            merchantUpdate(params).then((response) => {
              console.log(response.data)
              this.dialogFormVisible = false
              this.query(this.pageSize, this.pageNum)
            }).catch(error => {
              console.log(error)
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    query(pageSize, pageNum) {
      const params = Object.assign({
        pageSize, pageNum
      }, this.formQry)
      merchantQuery(params).then((response) => {
        console.log(response.data)
        if (response.data) {
          this.tableData = response.data.rows
          this.total = response.data.total
        }
      }).catch(error => {
        console.log(error)
      })
    },
    handleEdit(row) {
      this.dialogFormVisible = true
      this.addEditFlag = 'edit'
      this.id = row.id
      this.formAddEdit.channelCode = row.channelCode
      this.formAddEdit.merchantCode = row.merchantCode
      this.formAddEdit.merchantName = row.merchantName
    },
    handleDelete(id) {
      this.dialogVisible = true
      this.id = id
    },
    comfirm() {
      merchantDelete(this.id).then((response) => {
        console.log(response.data)
        this.dialogVisible = false
        this.query(this.pageSize, this.pageNum)
      }).catch(error => {
        console.log(error)
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.query(this.pageSize, this.pageNum)
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.query(this.pageSize, this.pageNum)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
