<template>
  <div class="app-container">
    <el-form :inline="true" :model="form">
      <el-form-item label="资方编号">
        <el-input v-model="form.partnerCode"></el-input>
      </el-form-item>
      <el-form-item label="资方名称">
        <el-input v-model="form.partnerName"></el-input>
      </el-form-item>
      <el-form-item label="合作模式">
          <el-select v-model="form.cooperativeMode" filterable>
            <el-option key="" label="全部" value=""></el-option>
            <el-option v-for="item in $store.state.globalData.cooperativeMode" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="query(rows,1)" v-if="hasPerm('findPartner')">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="table-container">
      <div class="table-toolbar">
        <el-button type="primary" @click="add" v-if="hasPerm('addPartner')">新增</el-button>
      </div>
      <el-table ref="multipleTable" :data="tableData" border :stripe="stripe" style="width: 100%">
        <el-table-column prop="partnerCode" label="资方编号" width="100">
        </el-table-column>
        <el-table-column prop="partnerName" label="资方名称">
        </el-table-column>
        <el-table-column prop="partnerFullName" label="资方全称">
        </el-table-column>
        <el-table-column prop="cooperativeMode" label="合作模式">
          <template slot-scope="scope" v-if="scope.row.cooperativeMode">
              {{ scope.row.cooperativeMode | cooperativeMode }}
          </template>
        </el-table-column>
        <el-table-column label="中邮出资比例">
          <template slot-scope="scope" v-if="scope.row.investRatio && scope.row.investRatio != ''">
              {{ scope.row.investRatio }}%
          </template>
        </el-table-column>
        <el-table-column prop="packageCode" label="资产偏好">
        </el-table-column>
        <el-table-column prop="approveTime" label="审批时效">
        </el-table-column>
        <el-table-column prop="advanceFlag" label="提现开关" width="330">
          <template slot-scope="scope">
            <div v-if="scope.row.advanceFlag === 'Y'">开</div>
            <div v-if="scope.row.advanceFlag === 'N'">
              关
              <span v-if="scope.row.advanceCloseLongFlag === '1'">长期</span>
              <span v-if="scope.row.advanceCloseLongFlag === '0'">{{formatTime(scope.row.advanceCloseBeginTime)}} - {{formatTime(scope.row.advanceCloseEndTime)}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="paymentType" label="操作" fixed="right" width="160">
          <template slot-scope="scope">
            <el-button @click="edit(scope.row)" size="small" type="warning" v-if="hasPerm('updatePartner')">编辑</el-button>
            <!-- <el-button @click="del" size="small" type="danger">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="mt10" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 30, 40]" :page-size="rows" layout="total,sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { findPartner } from '@/api/partner'
//import { optionsQuery } from '@/api/common'
import _ from 'lodash'
import { formatTime, timeToUnix } from '@/utils/index'
export default {
  name: 'RepayList',
  data() {
    return {
      form: {	
        partnerCode: '', //资方编号	String		
        partnerName: '', //资方名称	String		
        cooperativeMode: '', //合作模式	Int		0：中邮自营，1：联合贷款，2：资方全资
      },
      stripe: true,
      tableData: [],
      total: 0,
      rows: 10,
      page: 1,
    }
  },
  created() {
    this.query(this.rows, this.page)
  },
  methods: {
    formatTime,
    query(rows, page) {
      const params = Object.assign({
        rows, page
      }, this.form)
      console.log(params)
      findPartner(params).then(res => {
        if (res) {
          this.total = res.resData.total
          this.tableData = res.resData.list
          console.log(this.tableData)
        }
      }).catch(error => {
        console.log(error)
      })
    },
    handleSizeChange(val) {
      this.rows = val
      this.query(this.rows, this.page)
    },
    handleCurrentChange(val) {
      this.page = val
      this.query(this.rows, this.page)
    },
    add() {
      this.$router.push('partnerMgmt/add')
    },
    edit(row) {
      this.$router.push({name: 'partnerMgmtEdit',params:{record:row}})
    },
    del(row) {
      console.log(row)
      this.$confirm('是否确认删除？','提示',{
        type:'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功！'
        })
      })
    }
  },
  
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
