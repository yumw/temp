<template>
  <div class="app-container">
    <el-form :inline="true" :model="form">
      <el-form-item label="请求流水号">
        <el-input v-model="form.businessCode"></el-input>
      </el-form-item>
      <el-form-item label="服务名">
        <!-- <el-input v-model="form.serviceCode"></el-input> -->
        <el-select v-model="form.serviceCode" filterable>
          <el-option key label="全部" value></el-option>
          <el-option
            v-for="item in serviceName"
            :key="item.name"
            :label="item.value"
            :value="item.name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开始时间">
        <el-date-picker
          type="datetime"
          placeholder="开始时间"
          v-model="form.startTime"
          value-format="yyyy-MM-dd HH:mm:ss"
        ></el-date-picker>`
      </el-form-item>
      <el-form-item label="结束时间">
        <el-date-picker
          type="datetime"
          placeholder="结束时间"
          v-model="form.endTime"
          value-format="yyyy-MM-dd HH:mm:ss"
        ></el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="query(rows,1)" v-if="hasPerm('findRequestReceiveByPagination')">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="table-container">
      <el-table ref="multipleTable" :data="tableData" border :stripe="stripe" style="width: 100%">
        <el-table-column prop="id" label="id"></el-table-column>
        <el-table-column prop="businessCode" label="请求流水号"></el-table-column>
        <el-table-column prop="partnerCode" label="资方编号"></el-table-column>
        <el-table-column prop="serviceCode" label="服务编码"></el-table-column>
        <el-table-column prop="serviceName" label="服务名称"></el-table-column>
        <el-table-column prop="requestTime" label="请求时间">
          <template slot-scope="scope">
            {{ formatTime(scope.row.requestTime,'yyyy-MM-dd HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column prop="requestType" label="请求类型"></el-table-column>
        <el-table-column prop="createTime" label="创建时间">
          <template slot-scope="scope">
            {{ formatTime(scope.row.createTime,'yyyy-MM-dd HH:mm:ss') }}
          </template>
        </el-table-column>	
        <el-table-column prop="paymentType" label="操作" fixed="right" width="80">
          <template slot-scope="scope">
            <el-button
              @click="detail(scope.row)"
              size="small"
              type="primary"
              v-if="hasPerm('getRequestReceiveDetail')"
            >详情</el-button>
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
    <detail-modal ref="detailModal"></detail-modal>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { findRequestReceive } from "@/api/requestReceive";
import { formatTime, timeToUnix } from "@/utils/index";
import detailModal from "./components/detailModal";

export default {
  name: "requestReceiveMgmt",
  components: {
    detailModal
  },
  data() {
    return {
      form: {
        businessCode: "",
        serviceCode: "",
        startTime: "",
        endTime: ""
      },
      stripe: true,
      tableData: [],
      total: 0,
      rows: 10,
      page: 1,
    };
  },
  async created() {
    //this.$store.dispatch("getChannel"); //获取所有进件渠道
    this.$store.dispatch("getServiceName"); //获取所有服务
    this.query(this.rows, this.page);
  },
  computed: {
    ...mapState({
      serviceName: state => state.globalData.serviceName
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
      if (timeToUnix(params.startTime) > timeToUnix(params.endTime)) {
        this.$message({
          message: "开始时间不能晚于截止时间",
          type: "error"
        });
        return false;
      }      
      let res = await findRequestReceive(params)
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
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
