<template>
  <div class="app-container">
    <div class="table-container">
      <div class="table-toolbar">
        <el-button type="primary" @click="add" v-if="hasPerm('addPartnerSetting')">新增</el-button>
      </div>
      <el-table ref="multipleTable" :data="tableData.slice((page-1)*rows,page*rows)" border :stripe="stripe" style="width: 100%">
        <el-table-column prop="id" label="id" width="50"></el-table-column>
        <el-table-column prop="partnerCode" label="资方编号" width="100"></el-table-column>
        <el-table-column prop="requestUrl" label="请求地址"></el-table-column>
        <el-table-column prop="encryptParam" label="资方秘钥"></el-table-column>
        <el-table-column prop="partnerType" label="资方类型">
          <template
            slot-scope="scope"
          >{{ partnerTypeMap[scope.row.partnerType] }}</template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间">
          <template
            slot-scope="scope"
          >{{ formatTime(scope.row.createTime,'yyyy-MM-dd HH:mm:ss') }}</template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间">
          <template
            slot-scope="scope"
          >{{ formatTime(scope.row.updateTime,'yyyy-MM-dd HH:mm:ss') }}</template>
        </el-table-column>
        <el-table-column prop="paymentType" label="操作" fixed="right" width="160">
          <template slot-scope="scope">
            <el-button
              @click="edit(scope.row)"
              size="small"
              type="warning"
              v-if="hasPerm('addPartnerSetting')"
            >编辑</el-button>
            <el-button
              @click="del(scope.row)"
              size="small"
              type="danger"
              v-if="hasPerm('deletePartnerSetting')"
            >删除</el-button>
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
        :total="tableData.length"
      ></el-pagination>
    </div>
    <partnerbutt-modal ref="partnerbuttModal" @confirm="confirm"></partnerbutt-modal>
  </div>
</template>
<script>
import { findAllPartnerSetting, deletePartnerSetting } from "@/api/partnerSetting";
import partnerbuttModal from "./components/partnerButtModal";
import { formatTime, timeToUnix } from "@/utils/index";
import { mapState } from "vuex";

export default {
  name: "partnerButt",
  components: {
    partnerbuttModal
  },
  data() {
    return {
      form: {
      },
      stripe: true,
      tableData: [],
      total: 0,
      rows: 10,
      page: 1,
      partnerTypeMap: {
        '1': '标准',
        '2': '定制化' 
      }
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
      // const params = Object.assign(
      //   {
      //     rows,
      //     page
      //   },
      //   this.form
      // );
      let res = await findAllPartnerSetting();
      if (res.resData) {
        //this.total = res.resData.total;
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
      this.$refs.partnerbuttModal.edit();
    },
    edit(row) {
      this.$refs.partnerbuttModal.edit(row);
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