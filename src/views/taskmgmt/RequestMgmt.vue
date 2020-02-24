<template>
  <div class="app-container">
    <el-form :inline="true" :model="form">
      <el-form-item label="渠道原始流水号:">
        <el-input v-model="form.channelSerialNumber"></el-input>
      </el-form-item>
      <el-form-item label="流水号: ">
        <el-input v-model="form.serialNumber"></el-input>
      </el-form-item>
      <el-form-item label="业务流水号: ">
        <el-input v-model="form.businessSerialNumber"></el-input>
      </el-form-item>
      <el-form-item label="接口名称:">
        <el-input v-model="form.serviceNameChinese">
        </el-input>
      </el-form-item>
      <el-form-item label="状态:">
        <el-select v-model="form.state">
          <el-option label="全部" value=""></el-option>
          <el-option label="成功" value="1"></el-option>
          <el-option label="失败" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="query(pageSize,1)">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="table-container">
      <el-table ref="multipleTable" :data="tableData" border :stripe="stripe" style="width: 100%">
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="channelSerialNumber" label="渠道原始流水号"></el-table-column>
        <el-table-column prop="serialNumber" label="流水号"></el-table-column>
        <el-table-column prop="businessSerialNumber" label="业务流水号"></el-table-column>
        <el-table-column prop="serviceNameChinese" label="接口名称"></el-table-column>
        <el-table-column prop="scource" label="请求方"></el-table-column>
        <el-table-column prop="target" label="接收方"></el-table-column>
        <el-table-column prop="state" :formatter="translate" label="状态"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template slot-scope="scope">
            <el-button @click="check(scope.row.id, scope.row.requestType)" type="primary" size="mini">查看</el-button>
            <el-button v-if="canRetry(scope.row.serviceName)&&scope.row.scource === '服务开放前置'" @click="retry(scope.row)" type="primary" size="mini">重试</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="mt10" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10,20,30]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog title="温馨提示" :visible.sync="retryDialogVisible" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" width="30%">
      <span>{{message}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="ensure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { requestMgmtQry, requestMgmtQryDetail, requestRetry } from '@/api/taskmgmt'
import { getEnumByType } from '@/api/KeyValueMgmt'
export default {
  name: 'RequestMgmt',
  data() {
    return {
      form: {
        channelSerialNumber: '',
        serialNumber: '',
        businessSerialNumber: '',
        serviceNameChinese: '',
        state: ''
      },
      stripe: true,
      tableData: [],
      total: 0,
      pageSize: 10,
      pageNum: 1,
      retryDialogVisible: false,
      message: '',
      keyValue: []
    }
  },
  created() {
    // this.query(this.pageSize, this.pageNum)
    getEnumByType('RETRIABLE_SERVICE').then((response) => {
      this.keyValue = response.data
    }).catch(error => {
      console.log(error)
    })
  },
  methods: {
    query(pageSize, pageNum) {
      const params = Object.assign({
        pageSize, pageNum
      }, this.form)
      requestMgmtQry(params).then((response) => {
        console.log(response.data)
        if (response.data) {
          this.tableData = response.data.rows
          this.total = response.data.total
        }
      }).catch(error => {
        console.log(error)
      })
    },
    check(id, requestType) {
      requestMgmtQryDetail({ id, requestType }).then((response) => {
        console.log(response.data)
        this.$store.dispatch('SetValues', { requestDetails: response.data })
        this.$router.push('TaskDetails/request')
      }).catch(error => {
        console.log(error)
      })
    },
    retry(row) {
      requestRetry({ serialNumber: row.serialNumber, id: row.id }).then((response) => {
        this.message = response.message
        this.retryDialogVisible = true
      }).catch(error => {
        console.log(error)
      })
    },
    ensure() {
      this.query(this.pageSize, this.pageNum)
      this.retryDialogVisible = false
    },
    canRetry(serviceName) {
      for (let i = 0; i < this.keyValue.length; i++) {
        if (this.keyValue[i].enumKey === serviceName) {
          return true
        }
      }
      return false
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.query(this.pageSize, this.pageNum)
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.query(this.pageSize, this.pageNum)
    },
    translate(row, column, cellValue, index) {
      if (cellValue === 1) {
        return '成功'
      } else if (cellValue === 0) {
        return '失败'
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
