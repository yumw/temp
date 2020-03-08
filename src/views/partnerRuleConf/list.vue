<template>
  <div class="app-container">
    <el-form :inline="true" :model="form">
      <el-form-item label="资方编号">
        <el-input v-model="form.partnerCode"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="query(rows,1)" v-if="hasPerm('findPartnerSettingCheck')">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="table-container">
      <div class="table-toolbar">
        <el-button type="primary" @click="add" v-if="hasPerm('addPartnerSettingCheck')">新增</el-button>
      </div>
      <el-table ref="multipleTable" :data="tableData" border :stripe="stripe" style="width: 100%">
        <el-table-column prop="id" label="id" width="50"></el-table-column>
        <el-table-column prop="partnerCode" label="资方编号"></el-table-column>
        <el-table-column prop="ruleSource" label="规则来源"></el-table-column>
        <el-table-column prop="knowledgeId" label="知识包"></el-table-column>
        <el-table-column prop="checkOrder" label="执行顺序"></el-table-column>
        <el-table-column prop="createTime" label="创建时间">
          <template
            slot-scope="scope"
          >{{ formatTime(scope.row.createTime,'yyyy-MM-dd HH:mm:ss') }}</template>
        </el-table-column>
        <el-table-column prop="paymentType" label="操作" fixed="right" width="80">
          <template slot-scope="scope">
            <el-button
              @click="edit(scope.row)"
              size="small"
              type="warning"
              v-if="hasPerm('updatePartnerSettingCheck')"
            >编辑</el-button>
            <!-- <el-button
              @click="del(scope.row)"
              size="small"
              type="danger"
            >删除</el-button> -->
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
    <!-- <partnersetting-modal ref="partnersettingModal" @confirm="confirm"></partnersetting-modal> -->
  </div>
</template>
<script>
import { findPartnerSettingCheck } from "@/api/partnerSettingCheck";
// import partnersettingModal from "./components/partnerSettingModal";
//import { optionsQuery } from '@/api/common'
import { formatTime, timeToUnix } from "@/utils/index";
import { mapState } from "vuex";

export default {
  name: "partnerSetting",
  // components: {
  //   partnersettingModal
  // },
  data() {
    return {
      form: {
      },
      stripe: true,
      tableData: [],
      total: 0,
      rows: 10,
      page: 1
    };
  },
  created() {
    this.query(this.rows, 1)
  },
  computed: {
    ...mapState({
      partner: state => state.globalData.partner
    })
  },
  methods: {
    formatTime,
    async query(rows, page) {
      const params = Object.assign(
        {
          rows,
          page
        },
        this.form
      );
      let res = await findPartnerSettingCheck(params);
      if (res.resData) {
        this.total = res.resData.total;
        this.tableData = res.resData.list;
      }
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
      //this.$refs.partnersettingModal.edit();
      this.$router.push("partnerRuleConf/add");
    },
    edit(row) {
      //this.$refs.partnersettingModal.edit(row);
      this.$router.push({ name: "partnerRuleConfEdit", params: { record: row } });
    },
    confirm(data) {
      this.query(this.rows, 1);
    },
    async itemDel(params) {
      let res = await deletePartnerSetting(params)
      if (res) {
        this.query(this.rows, 1);
        this.$message({
          type: "success",
          message: "删除成功！"
        });
      }
    },
    del(row) {
      this.$confirm("是否确认删除？", "提示", {
        type: "warning"
      }).then(() => {
        let params = {
          id: row.id
        };
        this.itemDel(params);
      });
    }
  }
};
</script>
