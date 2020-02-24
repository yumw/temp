<template>
  <div class="app-container">
    <el-form :inline="true" :model="form">
      <el-form-item label="异常任务ID:">
        <el-input v-model="form.exceptionId"></el-input>
      </el-form-item>
      <el-form-item label="流水号: ">
        <el-input v-model="form.serialNumber"></el-input>
      </el-form-item>
      <el-form-item label="处理状态:">
        <el-select v-model="form.processState">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in processStates" :key="item.value" :label="item.name" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="query(pageSize,1)">查询</el-button>
        <el-button type="primary" @click="batchRetry">批量重试</el-button>
      </el-form-item>
    </el-form>
    <div class="table-container">
      <el-table ref="multipleTable" :data="tableData" @select-all="selectAll" @select="select" border :stripe="stripe" style="width: 100%">
        <el-table-column type="selection" :selectable="canRetry"></el-table-column>
        <el-table-column prop="id" label="异常任务ID"></el-table-column>
        <el-table-column prop="serialNumber" label="流水号"></el-table-column>
        <el-table-column prop="serviceName" label="接口名称"></el-table-column>
        <el-table-column prop="exceptionContent" label="失败原因"></el-table-column>
        <el-table-column prop="processState" label="处理状态"></el-table-column>
        <el-table-column prop="retryCount" label="重试次数"></el-table-column>
        <el-table-column prop="retryTimeLatest" label="更新时间"></el-table-column>
        <el-table-column label="操作" width="220" fixed="right">
          <template slot-scope="scope">
            <el-button v-for="item in scope.row.operations" :key="item.id" @click="operate(item)" :type="item.id | operateType" size="mini">{{item.name}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="mt10" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10,20,30]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog title="温馨提示" :visible.sync="dialogVisible" width="30%">
      <span>确认要忽略吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirm">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="温馨提示" :visible.sync="retryDialogVisible" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" width="30%">
      <span>{{message}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="ensure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { exceptionMgmtQry, retryExceptions } from '@/api/taskmgmt'
import { getToken } from '@/utils/auth'
import axios from 'axios'
import { optionsQuery } from '@/api/common'
export default {
  name: 'AbnormalMgmt',
  data() {
    return {
      form: {
        exceptionId: '',
        serialNumber: '',
        caseNo: '',
        processState: ''
      },
      stripe: true,
      tableData: [],
      total: 0,
      pageSize: 10,
      pageNum: 1,
      operations: [],
      processStates: [],
      dialogVisible: false,
      retryDialogVisible: false,
      item: {},
      message: '',
      selection: [],
      exceptionIds: ''
    }
  },
  created() {
    // this.query(this.pageSize, this.pageNum)
    optionsQuery('exception_process_state').then(response => {
      this.processStates = response.data
    })
  },
  filters: {
    operateType(value) {
      if (value === 'SEARCH') {
        return 'primary'
      } else if (value === 'RETRY') {
        return 'danger'
      } else if (value === 'IGNORE') {
        return 'info'
      }
    }
  },
  methods: {
    query(pageSize, pageNum) {
      const params = Object.assign({
        pageSize, pageNum
      }, this.form)
      exceptionMgmtQry(params).then((response) => {
        if (response.data) {
          this.tableData = response.data.rows
          this.total = response.data.total
        }
      }).catch(error => {
        console.log(error)
      })
    },
    batchRetry() {
      if (this.selection.length > 0) {
        this.selection.forEach((e) => {
          this.exceptionIds += e.id + ','
        })
        console.log(this.exceptionIds.substring(0, this.exceptionIds.length - 1))
        retryExceptions({ exceptionIds: this.exceptionIds.substring(0, this.exceptionIds.length - 1) }).then((response) => {
          this.message = response.message
          this.retryDialogVisible = true
        }).catch(error => {
          console.log(error)
        })
      } else {
        alert('请勾选')
      }
    },
    operate(item) {
      if (item.id === 'IGNORE') {
        this.dialogVisible = true
        this.item = item
      } else {
        this.operateForBack(item)
      }
    },
    operateForBack(item) {
      const token = getToken()
      const that = this
      axios({
        method: item.method,
        headers: { 'token': token },
        baseURL: process.env.BASE_API,
        url: item.uri,
        data: JSON.parse(item.params)
      })
        .then(function(response) {
          console.log(response)
          if (item.id === 'SEARCH') {
            that.$store.dispatch('SetValues', { requestDetails: response.data.data })
            that.$router.push('TaskDetails/abnormal')
          } else if (item.id === 'IGNORE') {
            that.dialogVisible = false
            that.query(this.pageSize, this.pageNum)
          } else if (item.id === 'RETRY') {
            that.message = response.data.message
            that.retryDialogVisible = true
          }
        }).catch(error => {
          console.log(error)
          alert(error)
        })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.query(this.pageSize, this.pageNum)
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.query(this.pageSize, this.pageNum)
    },
    canRetry(row, index) {
      return row.canRetry
    },
    confirm() {
      this.operateForBack(this.item)
    },
    ensure() {
      this.query(this.pageSize, this.pageNum)
      this.retryDialogVisible = false
    },
    select(selection, row) {
      this.selection = selection
    },
    selectAll(selection) {
      this.selection = selection
      console.log(this.selection)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
