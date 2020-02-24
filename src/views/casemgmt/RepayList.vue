<template>
  <div class="app-container">
    <el-form :inline="true" :model="form">
      <el-form-item label="渠道进件流水号: ">
        <el-input v-model="form.channelSerialNum"></el-input>
      </el-form-item>
      <el-form-item label="贷款账号:">
        <el-input v-model="form.loanAccount"></el-input>
      </el-form-item>
      <el-form-item label="交易状态">
        <el-select v-model="form.tradeStatus" filterable>
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in tradeStatusList" :key="item.value" :label="item.name" :value="item.value"></el-option>
        </el-select>
      </el-form-item> 
      <el-form-item label="渠道还款流水号:">
        <el-input v-model="form.paymentOrder"></el-input>
      </el-form-item>
      <el-form-item label="渠道名称">
          <el-select v-model="form.channelCode" filterable>
            <el-option v-for="item in $store.state.globalData.channels" :key="item.channelCode" :label="item.channelName" :value="item.channelCode"></el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="借据号:">
        <el-input v-model="form.loanNo"></el-input>
      </el-form-item>
      <el-form-item label="还款类型:">
        <el-select v-model="form.paymentType">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in repayTypeList" :label="item.name" :value="item.value" :key="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="还款流水号:">
        <el-input v-model="form.repaySerialNumber"></el-input>
      </el-form-item>
      <el-form-item label="还款时间">
        <el-col :span="11">
          <el-date-picker type="datetime" placeholder="选择日期" v-model="form.sdate" @change="beginTimeChanged" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;"></el-date-picker>
        </el-col>
        <el-col class="line" :span="2" style="text-align:center;">-</el-col>
        <el-col :span="11">
          <el-date-picker type="datetime" placeholder="选择日期" v-model="form.edate" @change="endTimeChanged" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;"></el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="query(pageSize,1)">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="table-container">
      <el-table ref="multipleTable" :data="tableData" border :stripe="stripe" style="width: 100%">
        <el-table-column prop="paymentOrder" label="渠道还款流水号	">
        </el-table-column>
        <el-table-column prop="repaySerialNumber" label="还款流水号">
        </el-table-column>
        <el-table-column prop="channelName" label="渠道名称">
        </el-table-column>
        <el-table-column prop="payOrderNo" label="支付外部订单号">
        </el-table-column>
        <el-table-column prop="channelSerialNum" label="渠道进件流水号">
        </el-table-column>
        <el-table-column prop="serialNumber" label="进件流水号">
        </el-table-column>
        <el-table-column prop="loanNo" label="渠道借据号">
        </el-table-column>
        <el-table-column prop="paymentType" label="还款类型" :formatter="loanStatusTranslate">
        </el-table-column>
        <el-table-column prop="loanAccount" label="贷款账号">
        </el-table-column>
        <el-table-column prop="amount" label="金额">
        </el-table-column>
        <el-table-column prop="tradeStatusName" label="交易状态">
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间">
        </el-table-column>
      </el-table>
      <el-pagination class="mt10" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total,sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { loanrepayQuery } from '@/api/casemgmt'
import { optionsQuery } from '@/api/common'
import _ from 'lodash'
export default {
  name: 'RepayList',
  data() {
    return {
      form: {
        sdate: '',
        edate: '',
        channelSerialNum: '',
        loanAccount: '',
        tradeStatus: '',
        paymentType: '',
        channelCode: '',
        paymentOrder: '',
        repaySerialNumber: ''
      },
      stripe: true,
      tableData: [],
      total: 0,
      pageSize: 10,
      pageNum: 1,
      selection: [],
      message: '',
      repayTypeList: [],
      tradeStatusList: []
    }
  },
  created() {
    this.query(this.pageSize, this.pageNum)
    optionsQuery('loan_repay_type').then(response => {
      this.repayTypeList = response.data
    })
    optionsQuery('loan_repay_status').then(response => {
      this.tradeStatusList = response.data
    })
  },
  methods: {
    query(pageSize, pageNum) {
      const params = Object.assign({
        pageSize, pageNum
      }, this.form)
      loanrepayQuery(params).then((response) => {
        console.log(response.data)
        if (response.data) {
          this.total = response.data.total
          this.tableData = response.data.rows
          console.log(this.tableData)
        }
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
    },
    loanStatusTranslate(row, column, cellValue, index) {
      const item = _.find(this.repayTypeList, { value: cellValue })
      if (item) {
        return item.name
      }
    },
    tradeStatusTranslate(row, column, cellValue, index) {
      const item = _.find(this.tradeStatusList, { value: cellValue })
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
