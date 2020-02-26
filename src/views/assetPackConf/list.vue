<template>
  <div class="app-container">
    <el-form :inline="true" :model="form">
      <el-form-item label="资产包编号">
        <el-input v-model="form.packageCode"></el-input>
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
      <el-form-item label="产品号">
        <el-select v-model="form.prodCode" filterable>
          <el-option key label="全部" value></el-option>
          <el-option
            v-for="item in $store.state.globalData.product"
            :key="item.prodCode"
            :label="item.prodName"
            :value="item.prodCode"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="资产标签">
        <el-select v-model="form.caseLabel" filterable>
          <el-option key label="全部" value></el-option>
          <el-option
            v-for="(item,index) in $store.state.globalData.assetTag"
            :key="index"
            :label="item.caseLabel"
            :value="item.caseLabel"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="query(rows,1)" v-if="hasPerm('findPackage')">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="table-container">
      <div class="table-toolbar">
        <el-button type="primary" @click="add" v-if="hasPerm('addPackage')">新增</el-button>
      </div>
      <el-table ref="multipleTable" :data="tableData" border :stripe="stripe" style="width: 100%">
        <el-table-column prop="packageCode" label="资产包编号" width="100"></el-table-column>
        <el-table-column prop="caseLabel" label="资产标签"></el-table-column>
        <el-table-column prop="channelName" label="来源渠道"></el-table-column>
        <el-table-column prop="prodCode" label="产品号"></el-table-column>
        <el-table-column label="输出比例">
          <template
            slot-scope="scope"
            v-if="scope.row.ouputRate && scope.row.ouputRate != ''"
          >{{ scope.row.ouputRate }}%</template>
        </el-table-column>
        <el-table-column prop="paymentType" label="操作" fixed="right" width="160">
          <template slot-scope="scope">
            <el-button
              @click="edit(scope.row)"
              size="small"
              type="warning"
              v-if="hasPerm('updatePackage')"
            >编辑</el-button>
            <!-- <el-button @click="del" size="small" type="danger">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="mt10"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="rows"
        layout="total,sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import { findPackage } from "@/api/assetPack";
//import { optionsQuery } from '@/api/common'
import _ from "lodash";
export default {
  name: "RepayList",
  data() {
    return {
      form: {
        packageCode: "", //资产包编号	String
        channelCode: "", //来源渠道号	String
        prodCode: "", //	产品号	String
        caseLabel: "" //	资产标签	String
        //page: '', //	想查询第几页	Int	是	用于分页
        //rows: '', //	每页显示多少条纪录	Int	是	用于分页
      },
      stripe: true,
      tableData: [],
      total: 0,
      rows: 10,
      page: 1,
      selection: [],
      message: "",
      repayTypeList: [],
      tradeStatusList: []
    };
  },
  created() {
    this.$store.dispatch("getChannel"); //获取所有进件渠道
    this.$store.dispatch("getAssetTag"); //获取标签
    this.$store.dispatch("getProduct"); //获取所有产品号
    this.query(this.rows, this.page);
  },
  methods: {
    query(rows, page) {
      const params = Object.assign(
        {
          rows,
          page
        },
        this.form
      );
      console.log(params);
      findPackage(params)
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
    // loanStatusTranslate(row, column, cellValue, index) {
    //   const item = _.find(this.repayTypeList, { value: cellValue })
    //   if (item) {
    //     return item.name
    //   }
    // },
    // tradeStatusTranslate(row, column, cellValue, index) {
    //   const item = _.find(this.tradeStatusList, { value: cellValue })
    //   if (item) {
    //     return item.name
    //   }
    //   return cellValue
    // },
    // beginTimeChanged(value) {
    //   const beginTime = new Date(value)
    //   const endTime = new Date(this.form.edate)
    //   if (this.form.edate && beginTime.getTime() > endTime.getTime()) {
    //     this.form.sdate = null
    //     this.$message({
    //       message: '开始日期应小于截止日期',
    //       type: 'error'
    //     })
    //     return
    //   }
    // },
    // endTimeChanged(value) {
    //   const beginTime = new Date(this.form.sdate)
    //   const endTime = new Date(value)
    //   if (endTime.getTime() && this.form.sdate && beginTime.getTime() > endTime.getTime()) {
    //     this.form.edate = null
    //     this.$message({
    //       message: '截止日期应大于开始日期',
    //       type: 'error'
    //     })
    //     return
    //   }
    // },
    // changeTimeType(e){
    //     console.log(e)
    // },
    add() {
      this.$router.push("assetPackConf/add");
    },
    edit(row) {
      this.$router.push({ name: "assetPackConfEdit", params: { record: row } });
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
