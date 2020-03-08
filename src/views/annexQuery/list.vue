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
        <el-table-column prop="id" label="id"></el-table-column>
        <el-table-column prop="caseNo" label="案件号"></el-table-column>
        <el-table-column prop="fileType" label="附件类型"></el-table-column>
        <el-table-column prop="fileName" label="附件文件名"></el-table-column>
        <el-table-column prop="fileUrl" label="文件地址">
          <template slot-scope="scope">
            <el-image :src="scope.row.fileUrl" fit="cover" :preview-src-list="[scope.row.fileUrl]" alt="" style="height:60px;width:60px;"></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="paymentType" label="操作" fixed="right" width="160">
          <template slot-scope="scope">
            <el-button
              @click="download(scope.row,1)"
              size="small"
              type="warning"
              v-if="hasPerm('previewLoanApplyFile')"
            >预览</el-button>
            <el-button
              @click="download(scope.row)"
              size="small"
              type="primary"
              v-if="hasPerm('downloadLoanApplyFile')"
            >下载</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="mt10"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="rows"
        :current-page.sync="page"
        layout="total,sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { findLoanApplyFile, downloadLoanApplyFile, previewLoanApplyFile } from "@/api/loanApplyFile";
import { formatTime, timeToUnix } from "@/utils/index";

export default {
  name: "requestProcess",
  data() {
    return {
      form: {
        caseNo: "",
      },
      stripe: true,
      tableData: [],
      total: 0,
      rows: 10,
      page: 1
    };
  },
  async created() {
    let res = await this.$store.dispatch("getFileType").catch(err => {console.log(err)}); //获取所有进件渠道
    console.log(res)
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
      //window.location.href = record.fileUrl;
      let params = {
        id: record.id
      }
      if( type === 1){
        let res = await previewLoanApplyFile(params)
      }else {
        let res = await downloadLoanApplyFile(params)
      }
      
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
