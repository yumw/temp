<template>
  <div class="app-container">
    <el-form :inline="true" :model="form">
      <el-form-item label="渠道原始流水号:">
        <el-input v-model="form.channelSerialNumber"></el-input>
      </el-form-item>
      <el-form-item label="姓名: ">
        <el-input v-model="form.loanPersonName"></el-input>
      </el-form-item>
      <el-form-item label="身份证号:">
        <el-input v-model="form.loanPersonId"></el-input>
      </el-form-item>
      <el-form-item label="手机号:">
        <el-input v-model="form.loanPersonTelephoneNum"></el-input>
      </el-form-item>
      <el-form-item label="贷款审批状态:">
        <el-select v-model="form.approvalStatus">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in loanStatusList" :label="item.name" :value="item.value" :key="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="进件时间">
        <el-col :span="11">
          <el-date-picker type="datetime" placeholder="选择时间" @change="beginTimeChanged" v-model="form.sdate" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;"></el-date-picker>
        </el-col>
        <el-col class="line" :span="2" style="text-align:center;">-</el-col>
        <el-col :span="11">
          <el-date-picker type="datetime" placeholder="选择时间" @change="endTimeChanged" v-model="form.edate" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;"></el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="渠道名称">
          <el-select v-model="form.channelCode" filterable>
            <el-option v-for="item in $store.state.globalData.channels" :key="item.channelCode" :label="item.channelName" :value="item.channelCode"></el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="进件状态">
        <el-select v-model="form.loanStatus">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in applyStatusList" :key="item.value" :label="item.name" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="流水号:">
        <el-input v-model="form.serialNumber"></el-input>
      </el-form-item>
      <el-form-item label="案件号:">
        <el-input v-model="form.caseNo"></el-input>
      </el-form-item>
      <el-form-item label="贷款主账号:">
        <el-input v-model="form.loanAccount"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="query(pageSize,1)">查询</el-button>
        <el-button type="primary" @click="batchRetry">批量重试</el-button>
      </el-form-item>
    </el-form>
    <div class="table-container">
      <el-table ref="multipleTable" :data="tableData" @select-all="selectAll" @select="select" border :stripe="stripe" style="width: 100%">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="channelSerialNumber" label="渠道原始流水号">
        </el-table-column>
        <el-table-column prop="serialNumber" label="流水号">
        </el-table-column>
        <el-table-column prop="prodCode" label="产品">
        </el-table-column>
        <el-table-column prop="loanApplyMoney" label="贷款金额">
        </el-table-column>
        <el-table-column prop="loanPeriod" label="申请期数">
        </el-table-column>
        <el-table-column prop="loanPersonName" label="客户姓名">
        </el-table-column>
        <el-table-column prop="loanPersonId" label="身份证号">
        </el-table-column>
        <el-table-column prop="loanPersonTelephoneNum" label="手机号">
        </el-table-column>
        <el-table-column prop="sendApprovalTime" label="发送审批时间">
        </el-table-column>
        <el-table-column prop="createTime" label="进件时间">
        </el-table-column>
        <el-table-column prop="approvalStatus" label="审批状态" :formatter="approvalStatusTranslate">
        </el-table-column>
        <el-table-column prop="caseNo" label="案件号">
        </el-table-column>
        <el-table-column prop="channelCode" label="渠道名称">
        </el-table-column>
        <el-table-column prop="loanStatus" label="进件状态" :formatter="loanStatusTranslate">
        </el-table-column>
        <el-table-column prop="loanAccount" label="贷款主账号">
        </el-table-column>
        <!-- <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button @click="check(scope.row.serialNumber)" type="primary" size="mini">查看</el-button>
            <el-button @click="retry(scope.row.serialNumber)" type="danger" size="mini">重试</el-button>
          </template>
        </el-table-column> -->
      </el-table>
      <el-pagination class="mt10" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total,sizes, prev, pager, next, jumper" :total="total">
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
import { loanapplyQuery, retryLoanApplys } from '@/api/casemgmt'
import { optionsQuery } from '@/api/common'
import _ from 'lodash'
export default {
  name: 'LoanApplyList',
  data() {
    return {
      form: {
        sdate: '',
        edate: '',
        channelSerialNumber: '',
        loanPersonName: '',
        loanPersonId: '',
        loanPersonTelephoneNum: '',
        approvalStatus: '',
        channelCode: '',
        loanStatus: '',
        serialNumber: '',
        caseNo: '',
        loanAccount: ''
      },
      stripe: true,
      tableData: [],
      total: 0,
      pageSize: 10,
      pageNum: 1,
      selection: [],
      serialNumbers: '',
      retryDialogVisible: false,
      message: '',
      loanStatusList: [],
      applyStatusList: []
    }
  },
  created() {
    this.query(this.pageSize, this.pageNum)
    optionsQuery('loan_status').then(response => {
      this.loanStatusList = response.data
    })
    optionsQuery('apply_status').then(response => {
      this.applyStatusList = response.data
    })
  },
  methods: {
    query(pageSize, pageNum) {
      const params = Object.assign({
        pageSize, pageNum
      }, this.form)
      loanapplyQuery(params).then((response) => {
        if (response.data) {
          this.total = response.data.total
          this.tableData = response.data.rows
        }
      }).catch(error => {
        console.log(error)
      })
    },
    batchRetry() {
      if (this.selection.length > 0) {
        this.selection.forEach((e) => {
          this.serialNumbers += e.serialNumber + ','
        })
        this.retry(this.serialNumbers.substring(0, this.serialNumbers.length - 1))
      } else {
        alert('请勾选')
      }
    },
    retry(serialNumbers) {
      retryLoanApplys({ serialNumbers: serialNumbers }).then((response) => {
        this.message = response.message
        this.retryDialogVisible = true
      }).catch(error => {
        console.log(error)
      })
    },
    check(serialNumber) {
      this.$router.push(`LoanApplyListDetail/${serialNumber}`)
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.query(this.pageSize, this.pageNum)
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.query(this.pageSize, this.pageNum)
    },
    ensure() {
      this.query(this.pageSize, this.pageNum)
      this.retryDialogVisible = false
    },
    select(selection) {
      this.selection = selection
    },
    selectAll(selection) {
      this.selection = selection
      console.log(this.selection)
    },
    approvalStatusTranslate(row, column, cellValue, index) {
      const item = _.find(this.loanStatusList, { value: cellValue })
      if (item) {
        return item.name
      } else {
        return cellValue
      }
    },
    loanStatusTranslate(row, column, cellValue, index) {
      let value
      if (cellValue !== undefined || cellValue !== null) {
        value = cellValue.toString()
      }
      const item = _.find(this.applyStatusList, { value: value })
      if (item) {
        return item.name
      }
      return cellValue
    },
    beginTimeChanged(value) {
      const beginTime = new Date(value)
      const endTime = new Date(this.form.edate)
      if (this.form.edate && beginTime.getTime() > endTime.getTime()) {
        this.form.sdate = null
        this.$message({
          message: '开始日期应小于截止日期',
          type: 'error'
        })
        return
      }
    },
    endTimeChanged(value) {
      const beginTime = new Date(this.form.sdate)
      const endTime = new Date(value)
      if (endTime.getTime() && this.form.sdate && beginTime.getTime() > endTime.getTime()) {
        this.form.edate = null
        this.$message({
          message: '截止日期应大于开始日期',
          type: 'error'
        })
        return
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
