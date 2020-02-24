<template>
  <div class="app-container">
    <el-form :inline="true" :model="form">
      <el-form-item label="渠道原始流水号:">
        <el-input v-model="form.channelSerialNumber"></el-input>
      </el-form-item>
      <el-form-item label="流水号: ">
        <el-input v-model="form.serialNumber"></el-input>
      </el-form-item>
      <el-form-item label="渠道名称">
          <el-select v-model="form.channelCode" filterable>
            <el-option v-for="item in $store.state.globalData.channels" :key="item.channelCode" :label="item.channelName" :value="item.channelCode"></el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="文件获取时间">
        <el-col :span="11">
          <el-date-picker type="datetime" placeholder="选择时间" @change="beginTimeChanged" v-model="form.sdate" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;"></el-date-picker>
        </el-col>
        <el-col class="line" :span="2" style="text-align:center;">-</el-col>
        <el-col :span="11">
          <el-date-picker type="datetime" placeholder="选择时间" @change="endTimeChanged" v-model="form.edate" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;"></el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="query(pageSize,1)">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="table-container">
      <el-table ref="multipleTable" :data="tableData" border :stripe="stripe" style="width: 100%">
        <el-table-column prop="id" label="序号">
        </el-table-column>
        <el-table-column prop="channelSerialNumber" label="渠道原始流水号">
        </el-table-column>
        <el-table-column prop="serialNumber" label="流水号">
        </el-table-column>
        <el-table-column prop="fileKey" label="附件类型">
        </el-table-column>
        <el-table-column prop="fileName" label="附件名称">
        </el-table-column>
        <el-table-column prop="channelCode" label="渠道名称" :formatter="channelCodeTranslate">
        </el-table-column>
        <el-table-column prop="fileCreateTime" label="文件获取时间">
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-popover placement="left" width="430" trigger="click">
              <img style="width:400px;" :src="previewImg" alt="">
              <el-button type="success" size="mini" slot="reference" @click="preview(scope.row.id)">预览</el-button>
            </el-popover>
            <el-button @click="download(scope.row)" type="primary" size="mini">下载</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="mt10" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { loanapplyQueryFile, loadImage } from '@/api/casemgmt'
import { getToken } from '@/utils/auth'
import { downloadFile } from '@/utils/download'
import axios from 'axios'
import _ from 'lodash'
export default {
  name: 'LoanAccessoryList',
  data() {
    return {
      form: {
        channelSerialNumber: '',
        serialNumber: '',
        channelCode: '',
        fileCreateTime: ''
      },
      stripe: true,
      tableData: [],
      previewImg: '',
      total: 0,
      pageSize: 10,
      pageNum: 1
    }
  },
  created() {
    // this.query(this.pageSize, this.pageNum)
  },
  methods: {
    query(pageSize, pageNum) {
      const params = Object.assign({
        pageSize, pageNum
      }, this.form)
      loanapplyQueryFile(params).then((response) => {
        this.total = response.data.total
        this.tableData = response.data.rows
      }).catch(error => {
        console.log(error)
      })
    },
    preview(id) {
      // loadImage(fileUrl).then((response) => {
      //   console.log(response.data)
      //   this.previewImg = response.data
      // }).catch(error => {
      //   console.log(error)
      // })
      const that = this
      const token = getToken()
      axios({
        method: 'get',
        headers: { 'token': token },
        baseURL: process.env.BASE_API,
        url: `/loanapply/loadImage/?id=${id}`
      })
        .then(function(response) {
          console.log(response.data)
          that.previewImg = `data:image/png;base64,${response.data}`
        }).catch(error => {
          console.log(error)
        })
      // const token = getToken()
      // axios({
      //   method: 'get',
      //   headers: { 'token': token },
      //   baseURL: process.env.BASE_API,
      //   url: `/loanapply/downFile/?fileUrl=${fileUrl}`,
      //   responseType: 'blob'
      // })
      //   .then(function(response) {
      //     const url = window.URL.createObjectURL(new Blob([response.data]))
      //     console.log(url)
      //     that.previewImg = url
      //     window.URL.revokeObjectURL(url)
      //   }).catch(error => {
      //     console.log(error)
      //   })
    },
    download(row) {
      // GET request for remote image
      const token = getToken()
      axios({
        method: 'get',
        headers: { 'token': token },
        baseURL: process.env.BASE_API,
        url: `/loanapply/downFile/?id=${row.id}`,
        responseType: 'blob'
      })
        .then(function(response) {
          downloadFile(response.data, row.fileName)
        }).catch(error => {
          console.log(error)
        })
    },
    channelCodeTranslate(row, column, cellValue, index) {
      if (cellValue) {
        const item = _.find(this.$store.state.globalData.channels, { channelCode: cellValue })
        if (item) {
          return item.channelName
        }
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
