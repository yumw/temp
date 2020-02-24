<template>
  <div class="app-container">
    <el-form :inline="true" :model="form">
      <el-form-item label="合作方提现流水号:">
        <el-input v-model="form.channelSerialNumber"></el-input>
      </el-form-item>
      <el-form-item label="用户名: ">
        <el-input v-model="form.userName"></el-input>
      </el-form-item>
      <el-form-item label="身份证号:">
        <el-input v-model="form.idno"></el-input>
      </el-form-item>
      <el-form-item label="手机号:">
        <el-input v-model="form.mobileNo"></el-input>
      </el-form-item>
      <el-form-item label="审批案件号:">
        <el-input v-model="form.caseNo"></el-input>
      </el-form-item>
      <el-form-item label="提现状态:">
        <el-select v-model="form.advanceStatus">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in advanceStatusList" :label="item.name" :value="item.value" :key="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="提现时间">
        <el-col :span="11">
          <el-date-picker type="datetime" placeholder="选择日期" v-model="form.sdate" @change="beginTimeChanged" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;"></el-date-picker>
        </el-col>
        <el-col class="line" :span="2" style="text-align:center;">-</el-col>
        <el-col :span="11">
          <el-date-picker type="datetime" placeholder="选择日期" v-model="form.edate" @change="endTimeChanged" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;"></el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="渠道名称">
        <el-select v-model="form.channelCode" filterable>
          <el-option v-for="item in $store.state.globalData.channels" :key="item.channelCode" :label="item.channelName" :value="item.channelCode"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="贷款子账号:">
        <el-input v-model="form.subAccount"></el-input>
      </el-form-item>  
      <el-form-item>
        <el-button type="primary" @click="query(pageSize,1)">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="table-container">
      <el-table ref="multipleTable" :data="tableData" border :stripe="stripe" style="width: 100%">
        <el-table-column prop="channelSerialNumber" label="合作方提现流水号">
        </el-table-column>
        <el-table-column prop="caseNo" label="审批案件号">
        </el-table-column>
        <el-table-column prop="userName" label="用户姓名">
        </el-table-column>
        <el-table-column prop="mobileNo" label="手机号">
        </el-table-column>
        <el-table-column prop="idno" label="身份证号">
        </el-table-column>
        <el-table-column prop="serialNumber" label="用信流水号">
        </el-table-column>
        <el-table-column prop="channelCode" label="渠道号">
        </el-table-column>
        <el-table-column prop="channelName" label="渠道名称">
        </el-table-column>
        <el-table-column prop="loanAmount" label="合作方提现金额">
        </el-table-column> 
        <el-table-column prop="advanceStatus" label="提现状态" :formatter="loanStatusTranslate">
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间">
        </el-table-column>
        <el-table-column prop="channelUserId" label="Ping码">
        </el-table-column>
        <el-table-column prop="subAccount" label="贷款子账号">
        </el-table-column>
      </el-table>
      <el-pagination class="mt10" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total,sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { advanceQuery } from '@/api/casemgmt'
import { optionsQuery } from '@/api/common'
import _ from 'lodash'
export default {
  name: 'WithDrawList',
  data() {
    return {
      form: {
        sdate: '',
        edate: '',
        channelSerialNumber: '',
        userName: '',
        idno: '',
        mobileNo: '',
        advanceStatus: '',
        channelCode: '',
        subAccount: ''
      },
      stripe: true,
      tableData: [],
      total: 0,
      pageSize: 10,
      pageNum: 1,
      selection: [],
      serialNumbers: '',
      message: '',
      advanceStatusList: []
    }
  },
  created() {
    this.query(this.pageSize, this.pageNum)
    optionsQuery('advance_status').then(response => {
      this.advanceStatusList = response.data
    })
  },
  methods: {
    query(pageSize, pageNum) {
      const params = Object.assign({
        pageSize, pageNum
      }, this.form)
      advanceQuery(params).then((response) => {
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
      const item = _.find(this.advanceStatusList, { value: cellValue })
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
