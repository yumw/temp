<template>
  <div class="app-container">
    <el-form :inline="true" :model="form">
      <el-form-item label="身份证号">
        <el-input v-model="form.idNo"></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="form.mobilePhone"></el-input>
      </el-form-item>
      <el-form-item label="审批案件号">
        <el-input v-model="form.caseNo"></el-input>
      </el-form-item>
      <el-form-item label="进件渠道">
        <el-select v-model="form.channelCode" filterable>
          <el-option key label="全部" value></el-option>
          <el-option
            v-for="item in $store.state.globalData.channel"
            :key="item.channelCode"
            :label="item.channelName"
            :value="item.channelCode"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间">
        <el-radio-group v-model="form.timeType" @change="changeTimeType">
          <el-radio :label="0">今天</el-radio>
          <el-radio :label="1">昨天</el-radio>
          <el-radio :label="2">自定义</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label v-if="form.timeType == 2">
        <el-col :span="11">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="form.startDate"
            value-format="yyyy-MM-dd"
            style="width: 100%;"
          ></el-date-picker>
        </el-col>
        <el-col class="line" :span="2" style="text-align:center;">-</el-col>
        <el-col :span="11">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="form.endDate"
            value-format="yyyy-MM-dd"
            style="width: 100%;"
          ></el-date-picker>
        </el-col>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="query(rows,1)" v-if="hasPerm('findCustomer')">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="table-container">
      <el-table ref="multipleTable" :data="tableData" border :stripe="stripe" style="width: 100%">
        <el-table-column prop="distTime" label="分发日期" min-width="100">
          <template
            slot-scope="scope"
            v-if="scope.row.distTime"
          >{{ formatTime(new Date(scope.row.distTime).getTime(),'yyyy-MM-dd HH:mm:ss') }}</template>
        </el-table-column>
        <el-table-column prop="caseNo" label="审批案件号" min-width="160"></el-table-column>
        <el-table-column prop="idNo" label="身份证号" min-width="170"></el-table-column>
        <el-table-column prop="mobilePhone" label="手机号" min-width="110"></el-table-column>
        <el-table-column prop="customerName" label="姓名"></el-table-column>
        <el-table-column prop="approvalStatus" label="授信状态"></el-table-column>
        <el-table-column prop="distApprovalAmount" label="授信金额"></el-table-column>
        <el-table-column prop="channelName" label="进件渠道">
        </el-table-column>
        <el-table-column prop="prodCode" label="产品号"></el-table-column>
        <el-table-column prop="partnerCode" label="资方编号"></el-table-column>
        <el-table-column prop="partnerName" label="资方名称"></el-table-column>
        <el-table-column prop="cooperativeMode" label="合作模式">
          <template
            slot-scope="scope"
            v-if="scope.row.cooperativeMode"
          >{{ scope.row.cooperativeMode | cooperativeMode }}</template>
        </el-table-column>
        <el-table-column prop="investRatio" label="中邮出资比例">
          <template
            slot-scope="scope"
            v-if="scope.row.investRatio !== undefined"
          >{{ scope.row.investRatio }}%</template>
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
  </div>
</template>
<script>
import { findCustomer } from "@/api/customer";
import { formatTime, timeToUnix } from "@/utils/index";
import _ from "lodash";
export default {
  name: "customerList",
  data() {
    return {
      form: {
        idNo: "", //身份证号	String
        mobilePhone: "", //手机号	String
        caseNo: "", //审批案件号	String
        channelCode: "", //进件渠道号	Int
        timeType: 0, //时间刷选类型	Int		0：今天，1：昨天，2：自定义
        startDate: "", //开始时间	Int		时间戳（timeType为2自定义时，才传）
        endDate: "" //结束时间	Int		时间戳（timeType为2自定义时，才传）
        //page: '',	//想查询第几页	Int	是	用于分页
        //rows: '',	//每页显示多少条纪录	Int	是	用于分页
      },
      stripe: true,
      tableData: [],
      total: 0,
      rows: 20,
      page: 1,
      selection: [],
      message: "",
      repayTypeList: [],
      tradeStatusList: []
    };
  },
  created() {
    this.$store.dispatch("getChannel"); //获取所有进件渠道
    this.query(this.rows, this.page);
  },
  methods: {
    formatTime,
    query(rows, page) {
      this.page = page;
      const params = Object.assign(
        {
          rows,
          page
        },
        this.form
      );
      console.log(params);
      if (params.timeType == 0 || params.timeType == 1) {
        delete params.startDate;
        delete params.endDate;
      } else {
        if (!params.startDate) {
          this.$message({
            message: "开始时间不能为空",
            type: "error"
          });
          return false;
        }
        if (!params.endDate) {
          this.$message({
            message: "结束时间不能为空",
            type: "error"
          });
          return false;
        }
        if (timeToUnix(params.startDate) > timeToUnix(params.endDate)) {
          this.$message({
            message: "开始日期不能晚于截止日期",
            type: "error"
          });
          return false;
        }
      }
      findCustomer(params)
        .then(res => {
          console.log(res);
          if (res) {
            this.total = res.resData.total;
            this.tableData = res.resData.list;
            console.log(this.tableData);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    handleSizeChange(val) {
      this.rows = val;
      this.query(this.rows, this.page);
    },
    handleCurrentChange(val) {
      this.page = val;
      this.query(this.rows, this.page);
    },
    loanStatusTranslate(row, column, cellValue, index) {
      const item = _.find(this.repayTypeList, { value: cellValue });
      if (item) {
        return item.name;
      }
    },
    tradeStatusTranslate(row, column, cellValue, index) {
      const item = _.find(this.tradeStatusList, { value: cellValue });
      if (item) {
        return item.name;
      }
      return cellValue;
    },
    changeTimeType(e) {
      //console.log(e)
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
