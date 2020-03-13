<template>
  <div class="app-container">
    <el-form :inline="true" :model="form">
      <el-form-item label="业务流水号">
        <el-input v-model="form.businessCode"></el-input>
      </el-form-item>
      <el-form-item label="服务名">
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
      <!-- <el-form-item label="处理状态">
        <el-select v-model="form.exceptionState" filterable>
          <el-option key label="全部" value></el-option>
          <el-option
            v-for="item in exceptionState"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="创建时间">
        <el-date-picker
          type="datetimerange"
          v-model="form.time"
          :editable="false"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          range-separator="至"
          value-format="yyyy-MM-dd HH:mm:ss"
        ></el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="query(rows,1)" v-if="hasPerm('findException')">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="table-container">
      <el-table ref="multipleTable" :data="tableData" border :stripe="stripe" style="width: 100%">
        <el-table-column label="序号" width="50" type="index"></el-table-column>
        <el-table-column prop="businessCode" label="业务流水号" min-width="150"></el-table-column>
        <el-table-column prop="serviceName" label="服务名" min-width="150"></el-table-column>
        <el-table-column prop="requestSource" label="请求方" min-width="120"></el-table-column>
        <el-table-column prop="requestTarget" label="接收方" min-width="120"></el-table-column>
        <el-table-column prop="exceptionState" label="处理状态" min-width="120">
          <template slot-scope="scope">{{ scope.row.exceptionState | exceptionState }}</template>
        </el-table-column>
        <el-table-column prop="exceptionTime" label="创建时间" min-width="160">
          <template slot-scope="scope">{{ formatTime(scope.row.exceptionTime) }}</template>
        </el-table-column>
        <el-table-column prop="paymentType" label="操作" fixed="right" width="160">
          <template slot-scope="scope">
            <el-button
              @click="detail(scope.row)"
              size="small"
              type="primary"
              v-if="hasPerm('findExceptionById')"
            >详情</el-button>
            <el-button
              @click="retry(scope.row)"
              size="small"
              type="warning"
              v-if="scope.row.exceptionState !== '1' && hasPerm('retryException')"
            >重试</el-button>
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
    <!-- <detail-modal ref="detailModal"></detail-modal> -->
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { findException, retryException } from "@/api/exception";
import { formatTime, timeToUnix } from "@/utils/index";
//import detailModal from "./components/detailModal";

export default {
  name: "requestProcess",
  // components: {
  //   detailModal
  // },
  data() {
    return {
      form: {
        businessCode: "",
        serviceCode: "",
        exceptionState: "",
        // startTime: "",
        // endTime: ""
        time: []
      },
      stripe: true,
      tableData: [],
      total: 0,
      rows: 20,
      page: 1,
    };
  },
  created() {
    this.query(this.rows, this.page);
    this.$store.dispatch("getServiceName"); //获取所有服务
  },
  computed: {
    ...mapState({
      serviceName: state => state.globalData.serviceName,
      exceptionState: state => state.globalData.exceptionState
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
        {
          businessCode: this.form.businessCode,
          serviceCode: this.form.serviceCode,
          exceptionState: this.form.exceptionState,
          startTime: this.form.time[0],
          endTime: this.form.time[1],
        }
      );
      // if (timeToUnix(params.startTime) > timeToUnix(params.endTime)) {
      //   this.$message({
      //     message: "开始时间不能晚于截止时间",
      //     type: "error"
      //   });
      //   return false;
      // }      
      let res = await findException(params)
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
      //this.$refs.detailModal.edit(record);
      this.$router.push({ name: "exceptionMgmtDetail", params: { record } });
    },
    async retry(record) {
      let params = {
        id: record.id
      }
      let res = await retryException(params);
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
