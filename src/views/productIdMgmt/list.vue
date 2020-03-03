<template>
  <div class="app-container">
    <div class="table-container">
      <div class="table-toolbar">
        <el-button type="primary" @click="add" v-if="hasPerm('addProduct')">新增</el-button>
      </div>
      <el-table ref="multipleTable" :data="product.slice((page-1)*rows,page*rows)" border>
        <el-table-column label="序号" width="50" type="index"></el-table-column>
        <el-table-column prop="prodCode" label="产品号"></el-table-column>
        <el-table-column prop="prodName" label="名称"></el-table-column>
        <el-table-column prop="paymentType" label="操作" fixed="right" width="80">
          <template slot-scope="scope">
            <el-button
              @click="edit(scope.row)"
              size="small"
              type="warning"
              v-if="hasPerm('addProduct')"
            >编辑</el-button>
            <!-- <el-button
              @click="del(scope.row)"
              size="small"
              type="danger"
              v-if="hasPerm('deleteProduct')"
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
        :total="product.length"
      ></el-pagination>
    </div>
    <productid-modal ref="productidModal" @confirm="confirm"></productid-modal>
  </div>
</template>
<script>
import { mapState } from "vuex";
import productidModal from "./components/productIdModal";
import { deleteProduct } from "@/api/product";
export default {
  name: "productIdMgmt",
  components: {
    productidModal
  },
  data() {
    return {
      show: true,
      tableData: [],
      total: 0,
      rows: 10,
      page: 1,
    };
  },
  created() {
    this.$store.dispatch("getProduct"); //获取所有产品号
  },
  mounted() {
    //this.tableData = this.$store.state.globalData.product
    //console.log(this.tableData)
  },
  computed: {
    ...mapState({
      product: state => state.globalData.product
    })
  },
  methods: {
    query() {},
    handleSizeChange(val) {
      this.rows = val;
      this.query(this.rows, this.page);
    },
    handleCurrentChange(val) {
      this.page = val;
      this.query(this.rows, this.page);
    },
    add() {
      this.$refs.productidModal.edit();
    },
    edit(row) {
      console.log(row);
      this.$refs.productidModal.edit(row);
    },
    itemDel(params) {
      deleteProduct(params)
        .then(res => {
          if (res) {
            this.$store.dispatch("getProduct");
            this.$message({
              type: "success",
              message: "删除成功！"
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    del(row) {
      console.log(row);
      this.$confirm("是否确认删除？", "提示", {
        type: "warning"
      }).then(() => {
        let params = {
          id: row.id
        };
        this.itemDel(params);
      });
    },
    confirm(data) {
      console.log(data);
      this.$store.dispatch("getProduct");
    }
  }
};
</script>