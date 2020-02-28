<template>
  <el-dialog title="选择" :visible.sync="visible" width="80%">
    <el-form :inline="true" :model="form">
      <!-- <el-form-item label="资产包编号">
        <el-input v-model="form.packageCode"></el-input>
      </el-form-item>-->
      <el-form-item label="来源渠道">
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
            v-for="item in $store.state.globalData.assetTag"
            :key="item.caseLabel"
            :label="item.caseLabel"
            :value="item.caseLabel"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="query(rows,1)">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="table-container">
      <el-table ref="multipleTable" row-key="id" :data="tableData.slice((page-1)*rows,page*rows)" @selection-change="handleSelectionChange" border style="width: 100%">
        <el-table-column type="selection" :reserve-selection="true" width="55"></el-table-column>
        <el-table-column prop="packageCode" label="资产包编号" width="100"></el-table-column>
        <el-table-column prop="caseLabel" label="资产标签"></el-table-column>
        <el-table-column prop="channelName" label="来源渠道"></el-table-column>
        <el-table-column prop="prodCode" label="产品号"></el-table-column>
        <el-table-column prop="ouputRate" label="输出比例">
          <template
            slot-scope="scope"
            v-if="scope.row.ouputRate && scope.row.ouputRate != ''"
          >{{ scope.row.ouputRate }}%</template>
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
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirm">确定</el-button>
      <el-button @click="visible = false">取消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { mapState } from "vuex";
import { findPackage } from "@/api/assetPack";
export default {
  name:'packageCodesModel',
  props: {
    list: {
      default: '',
      type: String
    }
  },
  data() {
    return {
      visible: false,
      tableData: [],
      total: 0,
      rows: 10,
      page: 1,
      checkList: [],
      form: {
        channelCode: "", //来源渠道号	String
        prodCode: "", //	产品号	String
        caseLabel: "" //	资产标签	String
      },
      multipleTable:''
    };
  },
  computed: {
    ...mapState({
      assetTag: state => state.globalData.assetTag
    })
  },
  mounted() {
    this.$store.dispatch('getChannel') //获取所有进件渠道
    this.$store.dispatch('getAssetTag') //获取标签
    this.$store.dispatch('getProduct') //获取所有产品号
  },
  methods: {
    handleSizeChange(val) {
      this.rows = val;
      //this.query(this.rows, this.page);
    },
    handleCurrentChange(val) {
      this.page = val;
      //this.query(this.rows, this.page);
    },
    query(rows, page) {
      const params = Object.assign(
        {
          rows: 100000,
          page: 1
        },
        this.form
      );
      findPackage(params)
        .then(res => {
          if (res) {
            this.total = res.resData.total
            this.tableData = res.resData.list
            this.$nextTick(() => {
              this.defaultSelection(this.list)
            })
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    defaultSelection(list){
      console.log(this.$refs)
      console.log(this.$refs.multipleTable)
      this.$refs.multipleTable.clearSelection();
      list = list.split(',')
      this.tableData.forEach(item => {
        if(list.indexOf(item.packageCode) > -1){
          
          this.$refs.multipleTable.toggleRowSelection(item)
        }
      })
    },
    edit(record) {
      this.visible = true;
      this.tableData = []
      //this.query(this.rows, this.page);
      this.query();
    },
    confirm() {
      this.$emit("confirm", this.multipleTable);
      this.visible = false;
    },
    handleSelectionChange(val){
      console.log(val)
      this.multipleTable = val;
    }
  }
};
</script>