<template>
  <div class="app-container">
    <el-form :inline="true" :model="form">
      <el-form-item label="文件类型">
        <el-select v-model="form.fileType" filterable>
          <el-option key label="全部" value></el-option>
          <el-option
            v-for="item in fileType"
            :key="item.name"
            :label="item.value"
            :value="item.name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="资方编号">
        <el-input v-model="form.partnerCode"></el-input>
      </el-form-item>
      <el-form-item label="对账日期开始日期">
        <el-date-picker
          type="date"
          placeholder="开始时间"
          v-model="form.startAccountingDate"
          value-format="yyyyMMdd"
        ></el-date-picker>`
      </el-form-item>
      <el-form-item label="对账日期结束日期	">
        <el-date-picker
          type="date"
          placeholder="结束时间"
          v-model="form.endAccountingDate"
          value-format="yyyyMMdd"
        ></el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="query(rows,1)" v-if="hasPerm('fileQuery')">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="table-container">
      <el-table ref="multipleTable" :data="tableData" border :stripe="stripe" style="width: 100%">
        <el-table-column prop="id" label="id" min-width="60"></el-table-column>
        <el-table-column prop="partnerCode" label="资方编号"></el-table-column>
        <el-table-column prop="accountingDate" label="对账日期" min-width="100"></el-table-column>
        <el-table-column prop="fileNameInput" label="文件名（处理前）" min-width="200"></el-table-column>
        <el-table-column prop="fileNameOutput" label="文件名（处理后）" min-width="200"></el-table-column>
        <el-table-column prop="fileOperateStartTime" label="处理开始时间" min-width="100">
          <template slot-scope="scope">
            {{ formatTime(scope.row.fileOperateStartTime,'yyyy-MM-dd HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column prop="fileOperateEndTime" label="处理结束时间" min-width="100">
          <template slot-scope="scope">
            {{ formatTime(scope.row.fileOperateEndTime,'yyyy-MM-dd HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column prop="fileOperateState" label="文件状态">
          <template slot-scope="scope">
            {{ scope.row.fileOperateState | fileOperateState }}
          </template>
        </el-table-column>
        <el-table-column prop="fileVersion" label="文件版本"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="100">
          <template slot-scope="scope">
            {{ formatTime(scope.row.createTime,'yyyy-MM-dd HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column prop="fileType" label="文件类型">
          <template slot-scope="scope">
            {{ scope.row.fileType | fileType }}
          </template>
        </el-table-column>
        <el-table-column prop="fileNameInputUrl" label="文件地址（处理前）" min-width="200"></el-table-column>
        <el-table-column prop="fileNameOutputUrl" label="文件地址（处理后）" min-width="200"></el-table-column>
        <el-table-column prop="paymentType" label="操作" fixed="right" width="160">
          <template slot-scope="scope">
            <el-button
              @click="download(scope.row)"
              size="small"
              type="primary"
              v-if="hasPerm('fileDownload')"
            >下载</el-button>
            <el-button
              @click="retry(scope.row)"
              size="small"
              type="warning"
              v-if="scope.row.fileOperateState != '2' && hasPerm('fileRetry')"
            >重试</el-button>
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
    <!-- <detail-modal ref="detailModal"></detail-modal> -->
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { lists, download, retry } from "@/api/file";
import { formatTime, timeToUnix } from "@/utils/index";
// import detailModal from "./components/detailModal";

export default {
  name: "reconciliation",
  // components: {
  //   detailModal
  // },
  data() {
    return {
      form: {
        // businessCode: "",
        // serviceCode: "",
        // startTime: "",
        // endTime: ""
      },
      stripe: true,
      tableData: [],
      total: 0,
      rows: 10,
      page: 1,
    };
  },
  async created() {
    await this.$store.dispatch("getFileType");
    await this.query(this.rows, this.page);
  },
  computed: {
    ...mapState({
      fileType: state => state.globalData.fileType
    })
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
      console.log(params);
      if (params.startAccountingDate > params.endAccountingDate) {
        this.$message({
          message: "开始时间不能晚于截止时间",
          type: "error"
        });
        return false;
      }      
      let res = await lists(params)
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
    detail(record) {
      this.$refs.detailModal.edit(record);
    },
    async retry(record) {
      let params = {
        id: record.id
      }
      let res = await retry(params);
      if(res){
        this.$message({
          type: 'success',
          message: '重试成功！'
        })
        this.query(this.rows, this.page);
      }
    },
    async download(record,type) {
      let params = {
        id: record.id
      }
      let res = await download(params)
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
