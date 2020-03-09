<template>
  <div class="app-container">
    <div class="table-container">
      <el-row :gutter="24" v-if="hasPerm('getEnumType')">
        <el-col :span="12">
          <div class="table-toolbar">
            <el-button type="primary" @click="add">新增</el-button>
          </div>
          <el-table ref="singleTable" :data="tableData.slice((page-1)*rows,page*rows)" border :stripe="stripe" highlight-current-row style="width: 100%">
            <el-table-column prop="id" label="id" width="50"></el-table-column>
            <el-table-column prop="enumTypeName" label="枚举类型"></el-table-column>
            <el-table-column prop="enumTypeDesc" label="描述"></el-table-column>
            <el-table-column prop="paymentType" label="操作" fixed="right" width="240">
              <template slot-scope="scope">
                <el-button
                  @click="edit(scope.row)"
                  size="small"
                  type="warning"
                >编辑</el-button>
                <el-button
                  @click="del(scope.row)"
                  size="small"
                  type="danger"
                >删除</el-button>
                <el-button
                  @click="detail(scope.row)"
                  size="small"
                  type="primary"
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
            layout="total,sizes, prev, pager, next, jumper"
            :total="tableData.length"
          ></el-pagination>
        </el-col>
        <el-col :span="12" v-if="dirty">
          <div class="table-toolbar">
            <el-button type="primary" @click="addChild">新增</el-button>
          </div>
          <el-table ref="multipleTable" :data="tableChildData" border :stripe="stripe" style="width: 100%">
            <el-table-column prop="id" label="id" width="50"></el-table-column>
            <el-table-column prop="name" label="枚举Key"></el-table-column>
            <el-table-column prop="value" label="枚举Value"></el-table-column>
            <el-table-column prop="enumDesc" label="描述"></el-table-column>
            <el-table-column prop="paymentType" label="操作" fixed="right" width="160">
              <template slot-scope="scope">
                <el-button
                  @click="editChild(scope.row)"
                  size="small"
                  type="warning"
                >编辑</el-button>
                <el-button
                  @click="delChild(scope.row)"
                  size="small"
                  type="danger"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>  
    </div>
    <enumtype-modal ref="enumtypeModal" @confirm="confirm"></enumtype-modal>
    <enum-modal ref="enumModal" @confirm="childConfirm"></enum-modal>
  </div>
</template>
<script>
import { getTypeInfo, deleteType, getEnumByType, deleteEnum } from "@/api/configEnum";
import enumtypeModal from "./components/enumtypeModal";
import enumModal from "./components/enumModal";
import { formatTime, timeToUnix } from "@/utils/index";
import { mapState } from "vuex";

export default {
  name: "kvMgmt",
  components: {
    enumtypeModal,
    enumModal
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
      tableChildData: [],
      rowData:'',
      dirty:false
    };
  },
  created() {
    this.query(this.rows, 1)
  },
  computed: {
    // ...mapState({
    //   partner: state => state.globalData.partner
    // })
  },
  methods: {
    formatTime,
    async query(rows, page) {
      this.page = page;
      // const params = Object.assign(
      //   {
      //     rows,
      //     page
      //   },
      //   this.form
      // );
      let res = await getTypeInfo();
      if (res.resData) {
        //this.total = res.resData.total;
        this.tableData = res.resData;
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
      this.$refs.enumtypeModal.edit();
    },
    edit(row) {
      this.$refs.enumtypeModal.edit(row);
    },
    confirm(data) {
      this.query(this.rows, 1);
      this.tableChildData = [];
      this.dirty = false;
      this.$refs.singleTable.setCurrentRow();
    },
    async itemDel(params) {
      let res = await deleteType(params)
      if (res) {
        this.query(this.rows, 1);
        this.tableChildData = [];
        this.dirty = false;
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
    },
    async detail(row) {
      this.tableChildData = [];
      let res = await getEnumByType(row.enumTypeName);
      if(res.resData){
        this.tableChildData = res.resData;
        this.dirty = true;
        this.rowData = row;
        this.$refs.singleTable.setCurrentRow(row);
      }
    },
    addChild() {
      this.rowData.enumKey = this.rowData.name;
      this.rowData.enumValue = this.rowData.value;
      this.$refs.enumModal.edit(this.rowData,0);
    },
    editChild(row) {
      row.enumKey = row.name;
      row.enumValue = row.value;
      this.$refs.enumModal.edit(row,1);
    },
    async itemChildDel(params) {
      let res = await deleteEnum(params)
      if (res) {
        this.detail(this.rowData)
        this.$message({
          type: "success",
          message: "删除成功！"
        });
      }
    },
    delChild(row) {
      this.$confirm("是否确认删除？", "提示", {
        type: "warning"
      }).then(() => {
        let params = {
          id: row.id
        };
        this.itemChildDel(params);
      });
    },
    childConfirm(res){
      this.detail(this.rowData)
    }
  }
};
</script>