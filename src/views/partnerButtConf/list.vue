<template>
  <div class="app-container">
    <el-form :inline="true" :model="form">
      <el-form-item label="资方编号">
        <el-input v-model="form.partnerCode"></el-input>
      </el-form-item>
      <el-form-item label="资方名称">
        <el-input v-model="form.partnerName"></el-input>
      </el-form-item>
      <el-form-item label="对接模式">
        <!-- <el-input v-model="form.serviceCode"></el-input> -->
        <el-select v-model="form.partnerType" filterable>
          <el-option key label="全部" value></el-option>
          <el-option key="1" label="标准" value="1"></el-option>
          <el-option key="2" label="定制化" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="query(rows,1)">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="table-container">
      <div class="table-toolbar">
        <el-button type="primary" @click="add" v-if="hasPerm('addPartnerSetting')">新增</el-button>
      </div>
      <el-table ref="multipleTable" :data="tableData" border :stripe="stripe" style="width: 100%">
        <el-table-column label="序号" width="50" type="index"></el-table-column>
        <el-table-column prop="partnerCode" label="资方编号" width="100"></el-table-column>
        <el-table-column prop="partnerName" label="资方名称" width="100"></el-table-column>
        <el-table-column prop="requestUrl" label="请求地址" min-width="200"></el-table-column>
        <el-table-column prop="encryptParam" label="资方秘钥" type="expand" width="100">
          <template slot-scope="scope">
            <div style="word-wrap: break-word;">{{ scope.row.encryptParam }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="partnerType" label="对接模式">
          <template
            slot-scope="scope"
          >{{ partnerTypeMap[scope.row.partnerType] }}</template>
        </el-table-column>
        <!-- <el-table-column prop="createTime" label="创建时间">
          <template
            slot-scope="scope"
          >{{ formatTime(scope.row.createTime,'yyyy-MM-dd HH:mm:ss') }}</template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间">
          <template
            slot-scope="scope"
          >{{ formatTime(scope.row.updateTime,'yyyy-MM-dd HH:mm:ss') }}</template>
        </el-table-column> -->
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
        :page-sizes="[20, 50, 100]"
        :page-size="rows"
        layout="total,sizes, prev, pager, next, jumper"
        :total="total"
        v-if="total > 20"
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
        partnerType: ''
      },
      stripe: true,
      tableData: [],
      total: 0,
      rows: 20,
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
      this.page = page;
      const params = Object.assign(
        {
          rows,
          page
        },
        this.form
      );
      let res = await findAllPartnerSetting(params);
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