<template>
  <div class="app-container">
    <el-form
      :inline="true"
      :model="form"
    >
      <el-form-item label="渠道名称">
        <el-select
          v-model="form.channelCode"
          auto-complete="off"
        >
          <el-option
            v-for="item in $store.state.globalData.channels"
            :key="item.channelCode"
            :label="item.channelName"
            :value="item.channelCode"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="文件流水号:">
        <el-input v-model="form.fileNo"></el-input>
      </el-form-item>
      <el-form-item label="消息ID:">
        <el-input v-model="form.messageId">
        </el-input>
      </el-form-item>
      <el-form-item label="文件名:">
        <el-input v-model="form.fileName">
        </el-input>
      </el-form-item>
      <el-form-item label="文件类型:">
        <el-select v-model="form.fileType">
          <el-option
            label="全部"
            value=""
          ></el-option>
          <el-option
            v-for="item in fileTypeList"
            :label="item.name"
            :value="item.value"
            :key="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="文件日期">
        <el-col>
          <el-date-picker
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            v-model="form.fileDate"
            style="width: 100%;"
          ></el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="状态:">
        <el-select v-model="form.status">
          <el-option
            label="全部"
            value=""
          ></el-option>
          <el-option
            v-for="item in statusList"
            :label="item.name"
            :value="item.value"
            :key="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="query(pageSize,1)"
        >查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="pull()"
        >拉取</el-button>
      </el-form-item>
    </el-form>
    <div class="table-container">
      <el-table
        ref="multipleTable"
        :data="tableData"
        border
        :stripe="stripe"
        style="width: 100%"
      >
        <el-table-column
          type="expand"
          label="详情"
          width="50"
        >
          <template slot-scope="props">
            <el-form
              label-position="left"
              inline
            >
              <el-form-item
                style="display:block;"
                label="文件流水号："
              >
                <span>{{props.row.fileNo}}</span>
              </el-form-item>
              <el-form-item
                style="display:block;"
                label="文件url："
              >
                <span>{{props.row.fileUrl}}</span>
              </el-form-item>
              <el-form-item
                style="display:block;"
                label="文件校验和："
              >
                <span>{{props.row.fileMd5}}</span>
              </el-form-item>
              <el-form-item
                style="display:block;"
                label="处理时间："
              >
                <span>{{props.row.createTime}}</span>
              </el-form-item>
              <el-form-item
                style="display:block;"
                label="发送时间："
              >
                <span>{{props.row.sendTime}}</span>
              </el-form-item>
              <el-form-item
                style="display:block;"
                label="重试时间："
              >
                <span>{{props.row.retryTime}}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          prop="id"
          label="序号"
        ></el-table-column>
        <el-table-column
          prop="channelCode"
          label="渠道名称"
          :formatter="channelCodeTranslate"
        ></el-table-column>
        <el-table-column
          prop="messageId"
          label="消息ID"
        ></el-table-column>
        <el-table-column
          prop="fileName"
          label="文件名"
        ></el-table-column>
        <el-table-column
          prop="fileDate"
          label="文件日期"
          :formatter="fileDateTranslate"
        ></el-table-column>
        <el-table-column
          prop="fileType"
          label="文件类型"
          :formatter="fileTypeTranslate"
        ></el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          :formatter="statusTranslate"
        ></el-table-column>
        <el-table-column
          label="操作"
          width="180"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status == 0 || scope.row.status == 1"
              key="y"
              @click="retry(scope.row.id)"
              type="primary"
              size="mini"
            >重试</el-button>
            <el-button
              v-else
              type="info"
              size="mini"
              key="n"
            >重试</el-button>
            <!-- <el-button type="primary" size="mini">
              <a :href="scope.row.fileUrl" download="">下载</a>
            </el-button> -->
            <el-button
              @click="download(scope.row)"
              type="primary"
              size="mini"
            >下载</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="mt10"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10,20,30]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
    <el-dialog
      title="温馨提示"
      :visible.sync="retryDialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      width="30%"
    >
      <span>{{message}}</span>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="ensure"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  downloadResultQuery,
  sendFileRetry,
  sendFileRetryPull
} from '@/api/downloadmgmt'
import { optionsQuery } from '@/api/common'
import _ from 'lodash'
import { downloadFile } from '@/utils/download'
import { getToken } from '@/utils/auth'
import axios from 'axios'

export default {
  name: 'DownloadFileResult',
  data() {
    return {
      form: {
        channelCode: '',
        fileNo: null,
        messageId: null,
        fileName: null,
        fileType: '',
        fileDate: null,
        status: ''
      },
      stripe: true,
      tableData: [],
      total: 0,
      pageSize: 10,
      pageNum: 1,
      retryDialogVisible: false,
      message: '',
      isRetryList: [],
      fileTypeList: [],
      statusList: []
    }
  },
  created() {
    this.query(this.pageSize, this.pageNum)
    optionsQuery('file_status_type').then(response => {
      this.fileTypeList = response.data
    })
    optionsQuery('file_download_status').then(response => {
      this.statusList = response.data
    })
  },
  methods: {
    query(pageSize, pageNum) {
      const params = Object.assign(
        {
          pageSize,
          pageNum
        },
        this.form
      )
      downloadResultQuery(params)
        .then(response => {
          console.log(response.data)
          if (response.data) {
            this.total = response.data.total
            this.tableData = response.data.rows
            console.log(this.tableData)
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    pull() {
      if (!this.form.fileType) {
        this.$message({
          message: '文件类型不能为空',
          type: 'error'
        })
        return
      }
      if (!this.form.fileDate) {
        this.$message({
          message: '文件日期不能为空',
          type: 'error'
        })
        return
      }
      if (!this.form.channelCode) {
        this.$message({
          message: '渠道号不能为空',
          type: 'error'
        })
        return
      }
      sendFileRetryPull(this.form).then(response => {
        console.log(response)
        this.$message({
          message: response.message,
          type: 'success'
        })
      })
    },
    retry(id, status) {
      const that = this
      const index = _.indexOf(this.isRetryList, id)
      if (index !== -1) {
        this.$message({
          message: '请5秒后再重试',
          type: 'error'
        })
        return
      } else {
        this.isRetryList.push(id)
        setTimeout(
          function(id) {
            const i = _.indexOf(that.isRetryList, id)
            that.isRetryList.splice(i, 1)
          },
          5000,
          id
        )
      }
      sendFileRetry(id)
        .then(response => {
          this.message = response.message
          this.retryDialogVisible = true
        })
        .catch(error => {
          console.log(error)
        })
    },
    download(item) {
      // GET request for remote image
      const params = {
        id: item.id
      }
      const token = getToken()
      axios({
        method: 'post',
        headers: { token: token },
        baseURL: process.env.BASE_API,
        url: '/sendFile/download',
        data: params,
        responseType: 'blob'
      })
        .then(function(response) {
          downloadFile(response.data, item.fileName)
        })
        .catch(error => {
          console.log(error)
        })
    },
    ensure() {
      this.query(this.pageSize, this.pageNum)
      this.retryDialogVisible = false
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.query(this.pageSize, this.pageNum)
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.query(this.pageSize, this.pageNum)
    },
    fileDateTranslate(row, column, cellValue, index) {
      return `${cellValue.substring(0, 4)}-${cellValue.substring(
        4,
        6
      )}-${cellValue.substring(6, 8)}`
    },
    fileTypeTranslate(row, column, cellValue, index) {
      const item = _.find(this.fileTypeList, { value: cellValue })
      if (item) {
        return item.name
      }
      return cellValue
    },
    statusTranslate(row, column, cellValue, index) {
      const item = _.find(this.statusList, { value: cellValue.toString() })
      if (item) {
        return item.name
      }
      return cellValue
    },
    channelCodeTranslate(row, column, cellValue, index) {
      const item = _.find(this.$store.state.globalData.channels, {
        channelCode: cellValue
      })
      if (item) {
        return item.channelName
      }
      return cellValue
    }
  }
}
</script>
