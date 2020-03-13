<template>
  <div class="app-container">
    <el-form :inline="true" :model="form">
      <el-form-item label="案件号">
        <el-input v-model="form.caseNo"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="query(rows,1)" v-if="hasPerm('findLoanApplyFile')">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="table-container">
      <el-table ref="multipleTable" :data="tableData" border :stripe="stripe" style="width: 100%">
        <el-table-column label="序号" width="50" type="index"></el-table-column>
        <el-table-column prop="caseNo" label="案件号"></el-table-column>
        <el-table-column prop="fileType" label="附件内容"></el-table-column>
        <el-table-column prop="fileName" label="附件名称">
          <template slot-scope="scope">
            {{ scope.row.fileName }}{{ scope.row.fileName ? '.' : ''}}{{ scope.row.fileExtension }}
          </template>
        </el-table-column>
        <!-- <el-table-column prop="fileUuid" label="下载码"></el-table-column> -->
        <el-table-column prop="paymentType" label="操作" fixed="right" width="160">
          <template slot-scope="scope">
            <el-button
              @click="download(scope.row)"
              size="small"
              type="primary"
              v-if="hasPerm('downloadLoanApplyFile')"
            >下载</el-button>
            <el-button
              @click="download(scope.row,1)"
              size="small"
              type="warning"
              v-if="scope.row.fileExtension && imgExt.indexOf(scope.row.fileExtension.toLocaleLowerCase()) > -1 && hasPerm('previewLoanApplyFile')"
            >预览</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="mt10"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[20, 50, 100]"
        :page-size="rows"
        :current-page.sync="page"
        layout="total,sizes, prev, pager, next, jumper"
        :total="total"
        v-if="total > 20"
      >
      </el-pagination>
    </div>
    <el-image-viewer 
      v-if="showViewer"
      :on-close="closeViewer"
      :url-list="urlList"
    ></el-image-viewer>
  </div>
</template>
<script>
import { findLoanApplyFile, downloadLoanApplyFile, previewLoanApplyFile } from "@/api/loanApplyFile";
import { formatTime, timeToUnix } from "@/utils/index";
import axios from 'axios'
import { downloadFile, previewFile } from '@/utils/download'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'

export default {
  name: "annexOuery",
  components: {
    ElImageViewer
  },
  data() {
    return {
      form: {
        caseNo: "",
      },
      stripe: true,
      tableData: [],
      total: 0,
      rows: 20,
      page: 1,
      showViewer:false,
      urlList:[],
      imgExt:['jpg','png','jpeg']
    };
  },
  async created() {
    //let res = await this.$store.dispatch("getFileType").catch(err => {console.log(err)}); //获取所有进件渠道
    //console.log(res)
    this.query(this.rows, this.page);
  },
  methods: {
    formatTime,
    async query(rows, page) {
      this.page = page;
      const params = Object.assign(
        {
          rows,
          page
        },
        this.form
      );     
      let res = await findLoanApplyFile(params)
      if (res.resData) {
        this.total = res.resData.total;
        this.tableData = res.resData.list;
      }
    },
    handleSizeChange(val) {
      this.rows = val;
      this.query(this.rows, this.page);
    },
    handleCurrentChange(val) {
      this.page = val;
      this.query(this.rows, this.page);
    },
    async download(record,type) {
      const params = {
        id: record.id
      }
      axios({
        method: 'post',
        baseURL: process.env.BASE_API,
        url: '/bg/loanApplyFile/downloadLoanApplyFile',
        data: params,
        responseType: 'blob'
      })
      .then(response => {
        let fileName = record.fileName ?  `${record.fileName}.${record.fileExtension}` : 'default.jpg'
        if(type === 1){
          let url = previewFile(response.data, fileName);
          this.urlList = [url];
          this.showViewer = true;
        }else{
          downloadFile(response.data, fileName)
        }  
      }).catch(error => {
        console.log(error)
      })
    },
    closeViewer() {
      this.showViewer = false;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
