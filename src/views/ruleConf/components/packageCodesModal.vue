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
            v-for="item in $store.state.globalData.incomingChannels"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="产品号">
        <el-select v-model="form.prodCode" filterable>
          <el-option key label="全部" value></el-option>
          <el-option
            v-for="item in $store.state.globalData.productId"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="资产标签">
        <el-select v-model="form.caseLabel" filterable>
          <el-option key label="全部" value></el-option>
          <el-option
            v-for="item in $store.state.globalData.assetTag"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="query(pageSize,1)">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="table-container">
      <el-table ref="multipleTable" :data="tableData" @selection-change="handleSelectionChange" border style="width: 100%">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="packageCode" label="资产包编号" width="100"></el-table-column>
        <el-table-column prop="caseLabels" label="资产标签"></el-table-column>
        <el-table-column prop="channelNames" label="来源渠道"></el-table-column>
        <el-table-column prop="prodCode" label="产品号"></el-table-column>
        <el-table-column prop="outputRate" label="输出比例"></el-table-column>
      </el-table>
      <el-pagination
        class="mt10"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
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
      pageSize: 10,
      pageNum: 1,
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
  mounted() {},
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.query(this.pageSize, this.pageNum);
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.query(this.pageSize, this.pageNum);
    },
    query(pageSize, pageNum) {
      const params = Object.assign(
        {
          pageSize,
          pageNum
        },
        this.form
      );
      console.log(params);
      this.tableData = [
        {
          packageCode: "123123",
          caseLabels: "REJ_2,REJ_3",
          channelNames: "a1,a3",
          prodCode: "123456",
          outputRate: "20"
        },
        {
          packageCode: "666666",
          caseLabels: "REJ_2,REJ_3",
          channelNames: "a1,a3",
          prodCode: "123456",
          outputRate: "20"
        }
      ];
      this.$nextTick(() => {
        this.defaultSelection(this.list)
      })
      findPackage(params)
        .then(response => {
          console.log(response.data);
          if (response.data) {
            this.total = response.data.total;
            this.tableData = response.data.rows;
            console.log(this.tableData);
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
      this.query(this.pageSize, this.pageNum);
    },
    confirm() {
      this.$emit("confirm", this.multipleTable);
      this.visible = false;
    },
    handleSelectionChange(val){
      this.multipleTable = val;
    }
  }
};
</script>