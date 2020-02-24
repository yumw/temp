<template>
  <div class="app-container">
    <el-form :inline="true" :model="form">
      <el-form-item label="渠道名称">
        <el-select v-model="form.channelCode" auto-complete="off">
          <el-option v-for="item in $store.state.globalData.channels" :key="item.channelCode" :label="item.channelName" :value="item.channelCode"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="文件类型">
        <el-select v-model="form.fileType" auto-complete="off">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in fileTypeList" :key="item.value" :label="item.name" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="处理时间">
        <el-col :span="11">
          <el-date-picker type="datetime" placeholder="选择时间" v-model="form.startTime" @change="beginTimeChanged" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;"></el-date-picker>
        </el-col>
        <el-col class="line" :span="2" style="text-align:center;">-</el-col>
        <el-col :span="11">
          <el-date-picker type="datetime" placeholder="选择时间" v-model="form.endTime" @change="endTimeChanged" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;"></el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="会计日期">
        <el-col :span="11">
          <el-date-picker type="date" placeholder="选择日期" v-model="form.accountingDateStartTime" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
        </el-col>
        <el-col class="line" :span="2" style="text-align:center;">-</el-col>
        <el-col :span="11">
          <el-date-picker type="date" placeholder="选择日期" v-model="form.accountingDateEndTime" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
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
        <!-- <el-table-column prop="channelCode" label="渠道名称">
        </el-table-column> -->
        <!-- <el-table-column prop="fileNameInput" label="fileNameInput">
        </el-table-column> -->
        <el-table-column prop="fileNameOuput" label="文件名">
        </el-table-column>
        <el-table-column prop="accountingDate" label="会计日期">
        </el-table-column>
        <el-table-column prop="createTime" label="处理时间">
        </el-table-column>
        <el-table-column prop="fileType" label="文件类型" :formatter="fileTypeTranslate">
        </el-table-column>
        <el-table-column prop="channelCode" label="渠道名称" :formatter="channelCodeTranslate">
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <!-- <el-popover placement="left" width="430" trigger="click">
              <img style="width:400px;" :src="previewImg" alt="">
              <el-button type="success" size="mini" slot="reference" @click="preview(scope.row.fileName)">预览</el-button>
            </el-popover> -->
            <el-button @click="download(scope.row)" type="primary" size="mini">下载</el-button>
            <el-button v-if="scope.row.fileOperateType === 1" @click="retry(scope.row.id)" type="primary" size="mini">重试</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="mt10" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { downloadQuery, fileRetry } from '@/api/downloadmgmt'
import { optionsQuery } from '@/api/common'
import downloadMixin from './downloadMixin'
import _ from 'lodash'
export default {
  name: 'Download',
  mixins: [downloadMixin],
  data() {
    return {
      form: {
        channelCode: '',
        fileType: '',
        startTime: '',
        endTime: '',
        accountingDateStartTime: '',
        accountingDateEndTime: ''
      },
      stripe: true,
      tableData: [],
      previewImg: '',
      total: 0,
      pageSize: 10,
      pageNum: 1,
      fileTypeList: []
    }
  },
  created() {
    optionsQuery('file_type').then(response => {
      this.fileTypeList = response.data
    })
    this.query(this.pageSize, this.pageNum)
  },
  methods: {
    query(pageSize, pageNum) {
      const params = Object.assign({
        pageSize, pageNum
      }, this.form)
      downloadQuery(params).then((response) => {
        this.total = response.data.total
        this.tableData = response.data.rows
      }).catch(error => {
        console.log(error)
      })
    },
    async retry(id) {
      await fileRetry({ id }).then(response => {
        this.$message({
          message: response.message,
          type: 'success'
        })
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
    beginTimeChanged(value) {
      const beginTime = new Date(value)
      const endTime = new Date(this.form.endTime)
      if (this.form.endTime && beginTime.getTime() > endTime.getTime()) {
        this.form.startTime = null
        this.$message({
          message: '开始日期应小于截止日期',
          type: 'error'
        })
        return
      }
    },
    endTimeChanged(value) {
      const beginTime = new Date(this.form.startTime)
      const endTime = new Date(value)
      if (endTime.getTime() && this.form.startTime && beginTime.getTime() > endTime.getTime()) {
        this.form.endTime = null
        this.$message({
          message: '截止日期应大于开始日期',
          type: 'error'
        })
        return
      }
    },
    fileTypeTranslate(row, column, cellValue, index) {
      const item = _.find(this.fileTypeList, { value: cellValue })
      if (item) {
        return item.name
      }
      return cellValue
    },
    channelCodeTranslate(row, column, cellValue, index) {
      const item = _.find(this.$store.state.globalData.channels, { channelCode: cellValue })
      if (item) {
        return item.channelName
      }
      return cellValue
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
