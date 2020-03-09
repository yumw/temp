<template>
  <div class="app-container">
    <el-form :inline="true" :model="form">
      <el-form-item label="案件号">
        <el-input v-model="form.caseNo"></el-input>
      </el-form-item>
      <el-form-item label="提现流水号">
        <el-input v-model="form.loanNo"></el-input>
      </el-form-item>
      <el-form-item label="用信状态">
        <el-select v-model="form.approvalStatus" filterable>
          <el-option key label="全部" value></el-option>
          <el-option
            v-for="item in approvalStatus"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="放款状态">
        <el-select v-model="form.loanStatus" filterable>
          <el-option key label="全部" value></el-option>
          <el-option
            v-for="item in loanStatus"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用信分发开始时间">
        <el-date-picker
          type="datetime"
          placeholder="开始时间"
          v-model="form.startTime"
          value-format="yyyy-MM-dd HH:mm:ss"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="用信分发结束时间">
        <el-date-picker
          type="datetime"
          placeholder="结束时间"
          v-model="form.endTime"
          value-format="yyyy-MM-dd HH:mm:ss"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="放款分发开始时间">
        <el-date-picker
          type="datetime"
          placeholder="开始时间"
          v-model="form.startTime2"
          value-format="yyyy-MM-dd HH:mm:ss"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="放款分发结束时间">
        <el-date-picker
          type="datetime"
          placeholder="结束时间"
          v-model="form.endTime2"
          value-format="yyyy-MM-dd HH:mm:ss"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="query(rows,1)" v-if="hasPerm('findAdvanceByPagination')">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="table-container">
      <el-table ref="multipleTable" :data="tableData" border :stripe="stripe" style="width: 100%">
        <el-table-column prop="id" label="id" min-width="55"></el-table-column>
        <el-table-column prop="loanNo" label="提现流水号" min-width="100"></el-table-column>
        <el-table-column prop="advanceApplyNo" label="用信请求流水号" min-width="150"></el-table-column>
        <el-table-column prop="advanceConfirmNo" label="支付放款请求流水号" min-width="150"></el-table-column>
        <el-table-column prop="caseNo" label="案件号" min-width="120"></el-table-column>
        <el-table-column prop="partnerCode" label="资方编号" min-width="120"></el-table-column>
        <el-table-column prop="approvalStatus" label="用信状态">
          <template
            slot-scope="scope"
          >{{ scope.row.approvalStatus | approvalStatus }}</template>
        </el-table-column>
        <el-table-column prop="loanStatus" label="放款状态">
          <template
            slot-scope="scope"
          >{{ scope.row.loanStatus | loanStatus }}</template>
        </el-table-column>
        <el-table-column prop="loanAmount" label="用信金额"></el-table-column>
        <el-table-column prop="loanPeriod" label="期数"></el-table-column>
        <el-table-column prop="yearRate" label="年利率"></el-table-column>
        <el-table-column prop="customerName" label="客户姓名"></el-table-column>
        <el-table-column prop="cooperativeMode" label="合作模式">
          <template
            slot-scope="scope"
          >{{ scope.row.cooperativeMode | cooperativeMode }}</template>
        </el-table-column>
        <el-table-column prop="investRatio" label="中邮出资比例">
          <template
            slot-scope="scope"
            v-if="scope.row.investRatio !== undefined"
          >{{ scope.row.investRatio }}%</template>
        </el-table-column>
        <el-table-column prop="isReportCredit" label="是否资方报送征信"></el-table-column>
        <el-table-column prop="isUrgeRepay" label="是否中邮催收"></el-table-column>
        <el-table-column prop="loanAccount" label="贷款账号"></el-table-column>
        <el-table-column prop="advanceApplyTime" label="放款申请时间" min-width="100"></el-table-column>
        <el-table-column prop="distApplyTime" label="用信分发时间" min-width="100"></el-table-column>
        <el-table-column prop="distApplyResultTime" label="分发用信结果时间" min-width="100"></el-table-column>
        <el-table-column prop="distAdvaneTime" label="放款分发时间" min-width="100"></el-table-column>
        <el-table-column prop="distAdvanceResultTime" label="分发放款结果时间" min-width="100"></el-table-column>
        <el-table-column prop="distLoanStatus" label="分发提现状态">
          <template
            slot-scope="scope"
          >{{ scope.row.distLoanStatus | distLoanStatus }}</template>
        </el-table-column>
        <el-table-column prop="distApprovalStatus" label="分发用信状态">
          <template
            slot-scope="scope"
          >{{ scope.row.distApprovalStatus | distApprovalStatus }}</template>
        </el-table-column>
        <el-table-column prop="distFlag" label="分发标识"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="100">
          <template slot-scope="scope">
            {{ formatTime(scope.row.createTime,'yyyy-MM-dd HH:mm:ss') }}
          </template>
        </el-table-column>
	
        <!-- <el-table-column prop="paymentType" label="操作" fixed="right" width="80">
          <template slot-scope="scope">
            <el-button
              @click="retry(scope.row)"
              size="small"
              type="warning"
            >重试</el-button>
          </template>
        </el-table-column> -->
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
import { findAdvance } from "@/api/advance";
import { formatTime, timeToUnix } from "@/utils/index";
// import detailModal from "./components/detailModal";
import _ from "lodash";

export default {
  name: "requestProcess",
  // components: {
  //   detailModal
  // },
  data() {
    return {
      form: {

      },
      stripe: true,
      tableData: [],
      total: 0,
      rows: 10,
      page: 1,
    };
  },
  created() {
    this.query(this.rows, this.page);
  },
  computed: {
    ...mapState({
      approvalStatus: state => state.globalData.approvalStatus,
      loanStatus: state => state.globalData.loanStatus
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
      let res = await findAdvance(params)
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
      let res = await retryRequestProcess(params);
      if(res){
        this.$message({
          type: 'success',
          message: '重试成功！'
        })
      }
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
