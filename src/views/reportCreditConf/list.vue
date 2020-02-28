<template>
  <div class="app-container">
    <div class="table-container">
      <el-table ref="multipleTable" :data="partner.slice((page-1)*rows,page*rows)" border :stripe="stripe" style="width: 100%">
        <el-table-column label="序号" width="50" type="index"></el-table-column>
        <el-table-column prop="partnerCode" label="资方编号" width="100"></el-table-column>
        <el-table-column prop="partnerName" label="资方名称"></el-table-column>
        <el-table-column prop="partnerFullName" label="资方全称"></el-table-column>
        <el-table-column prop="cooperativeMode" label="合作模式">
          <template
            slot-scope="scope"
            v-if="scope.row.cooperativeMode"
          >{{ scope.row.cooperativeMode | cooperativeMode }}</template>
        </el-table-column>
        <el-table-column label="中邮出资比例">
          <template
            slot-scope="scope"
            v-if="scope.row.investRatio && scope.row.investRatio != ''"
          >{{ scope.row.investRatio }}%</template>
        </el-table-column>
        <el-table-column label="是否报送征信" fixed="right" width="160">
          <template slot-scope="scope">
            <el-radio-group :value="scope.row.isReportCredit">
              <el-radio label="Y" @change="itemChange($event,scope.row,'Y')">是</el-radio>
              <el-radio label="N" @change="itemChange($event,scope.row,'N')">否</el-radio>
            </el-radio-group>
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
        :total="partner.length"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import { findPartner, updatePartnerIsReportCredit } from "@/api/partner";
//import { optionsQuery } from '@/api/common'
import _ from "lodash";
import { formatTime, timeToUnix } from "@/utils/index";
import { mapState } from "vuex";

export default {
  name: "RepayList",
  data() {
    return {
      form: {
        partnerCode: "", //资方编号	String
        partnerName: "", //资方名称	String
        cooperativeMode: "" //合作模式	Int		0：中邮自营，1：联合贷款，2：资方全资
      },
      stripe: true,
      tableData: [],
      total: 0,
      rows: 10,
      page: 1
    };
  },
  created() {
    this.$store.dispatch("getPartner"); //获取所有资方
    //this.query(this.rows, this.page)
  },
  computed: {
    ...mapState({
      partner: state => state.globalData.partner
    })
  },
  methods: {
    formatTime,
    query(rows, page) {
      const params = Object.assign(
        {
          rows,
          page
        },
        this.form
      );
      findPartner(params)
        .then(res => {
          if (res) {
            this.total = res.resData.total;
            this.tableData = res.resData.list;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    handleSizeChange(val) {
      this.rows = val;
      //this.query(this.rows, this.page);
    },
    handleCurrentChange(val) {
      this.page = val;
      //this.query(this.rows, this.page);
    },
    add() {
      this.$router.push("partnerMgmt/add");
    },
    edit(row) {
      this.$router.push({ name: "partnerMgmtEdit", params: { record: row } });
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
    },
    edit(params) {
      updatePartnerIsReportCredit(params)
        .then(res => {
          if (res) {
            this.$store.dispatch("getPartner");
            this.$message({
              type: "success",
              message: "修改成功！"
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    itemChange(e, row, type) {
      console.log(e, row);
      this.$confirm("是否确认修改？", "提示", {
        type: "warning"
      }).then(() => {
        let params = {
          id: row.id,
          isReportCredit: type
        };
        this.edit(params);
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
