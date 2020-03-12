<template>
  <div class="app-container">
    <el-form :inline="true" :model="form">
      <el-form-item label="资方编号">
        <el-input v-model="form.partnerCode"></el-input>
      </el-form-item>
      <el-form-item label="资方名称">
        <el-input v-model="form.partnerName"></el-input>
      </el-form-item>
      <el-form-item label="合作模式">
        <el-select v-model="form.cooperativeMode" filterable>
          <el-option key label="全部" value></el-option>
          <el-option
            v-for="item in $store.state.globalData.cooperativeMode"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否开启">
        <el-select v-model="form.distFlag" filterable>
          <el-option key label="全部" value></el-option>
          <el-option key="Y" label="开启" value="Y"></el-option>
          <el-option key="N" label="关闭" value="N"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="query(rows,1)" v-if="hasPerm('findRule')">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="table-container">
      <div class="table-toolbar">
        <el-button type="primary" @click="add" v-if="hasPerm('addRule')">新增</el-button>
      </div>
      <el-table ref="multipleTable" :data="tableData" border :stripe="stripe" style="width: 100%">
        <!-- <el-table-column label="编号" width="50" type="index"></el-table-column> -->
        <el-table-column prop="id" label="编号" width="50"></el-table-column>
        <el-table-column prop="partnerCode" label="被分发资方编号"></el-table-column>
        <el-table-column prop="partnerName" label="被分发资方名称"></el-table-column>
        <el-table-column prop="cooperativeMode" label="合作模式">
          <template
            slot-scope="scope"
            v-if="scope.row.cooperativeMode"
          >{{ scope.row.cooperativeMode | cooperativeMode }}</template>
        </el-table-column>
        <el-table-column prop="ruleDate" label="分发日期" width="200">
          <template slot-scope="scope" v-if="!!scope.row.ruleBeginDate || !!scope.row.ruleEndDate">
            {{ formatTime(scope.row.ruleBeginDate,'yyyy-MM-dd') }}
            至
            {{ formatTime(scope.row.ruleEndDate,'yyyy-MM-dd') }}
          </template>
        </el-table-column>
        <el-table-column prop="distTime" label="每日分发时间" width="150">
          <template slot-scope="scope" v-if="!!scope.row.distBeginTime || !!scope.row.distEndTime">
            {{ scope.row.distBeginTime }}
            -
            {{ scope.row.distEndTime }}
          </template>
        </el-table-column>
        <el-table-column prop="dayLimit" label="每日分发上限/笔"></el-table-column>
        <!-- <el-table-column prop="ruleMode" label="分发模式">
        </el-table-column>-->
        <el-table-column prop="distFlag" label="是否开启">
          <template slot-scope="scope">
            <span v-if="scope.row.distFlag === 'Y'">是</span>
            <span v-if="scope.row.distFlag === 'N'">否</span>
          </template>
        </el-table-column>
        <el-table-column prop="paymentType" label="操作" fixed="right" width="80">
          <template slot-scope="scope">
            <el-button
              @click="edit(scope.row)"
              size="small"
              type="warning"
              v-if="hasPerm('updateRule')"
            >编辑</el-button>
            <!-- <el-button @click="del" size="small" type="danger">删除</el-button> -->
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
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import { findRule } from "@/api/rule";
//import { optionsQuery } from '@/api/common'
import _ from "lodash";
import { formatTime, timeToUnix } from "@/utils/index";
export default {
  name: "RepayList",
  data() {
    return {
      form: {
        partnerCode: "", //资方编号	String
        partnerName: "", //资方名称	String
        cooperativeMode: "", //合作模式	Int		0：中邮自营，1：联合贷款，2：资方全资
        distFlag: "" //是否开启	Int		0：关闭，1：开启
      },
      stripe: true,
      tableData: [],
      total: 0,
      rows: 20,
      page: 1
    };
  },
  created() {
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
      findRule(params)
        .then(res => {
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
    add() {
      this.$router.push("ruleConf/add");
    },
    edit(row) {
      this.$router.push({ name: "ruleConfEdit", params: { record: row } });
    },
    del(row) {
      console.log(row);
      this.$confirm("是否确认删除？", "提示", {
        type: "warning"
      }).then(() => {
        this.$message({
          type: "success",
          message: "删除成功！"
        });
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
