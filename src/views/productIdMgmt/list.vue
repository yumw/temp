<template>
  <div class="app-container">
    <div class="table-container">
      <div class="table-toolbar">
        <el-button type="primary" @click="add">新增</el-button>
      </div>
      <el-table ref="multipleTable" :data="product" border>
        <el-table-column label="序号" width="50" type="index"></el-table-column>
        <el-table-column prop="prodCode" label="产品号"></el-table-column>
        <el-table-column prop="prodName" label="名称"></el-table-column>
        <el-table-column prop="paymentType" label="操作" fixed="right" width="160">
          <template slot-scope="scope">
            <el-button @click="edit(scope.row)" size="small" type="warning">编辑</el-button>
            <el-button @click="del(scope.row)" size="small" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <el-pagination class="mt10" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total,sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>-->
    </div>
    <productid-modal ref="productidModal" @confirm="confirm"></productid-modal>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import productidModal from './components/productIdModal';
import { deleteProduct } from '@/api/product'
export default {
  name: "productIdMgmt",
  components:{
    productidModal
  },
  data() {
    return {
      show:true,
      tableData: []
    }
  },
  mounted() {
    //this.tableData = this.$store.state.globalData.product
    //console.log(this.tableData)
  },
  computed:{
    ...mapState({
      product: state => state.globalData.product
    })
  },
  methods: {
    query() {

    },
    add() {
      this.$refs.productidModal.edit();
    },
    edit(row) {
      console.log(row)
      this.$refs.productidModal.edit(row);
    },
    itemDel(params){
      deleteProduct(params).then(res => {
        if (res) {
          this.$store.dispatch('getProduct')
          this.$message({
            type: 'success',
            message: '删除成功！'
          })
        }
      }).catch(error => {
        console.log(error)
      })
    },
    del(row) {
      console.log(row)
      this.$confirm('是否确认删除？','提示',{
        type:'warning'
      }).then(() => {
        let params = {
          id: row.id
        }
        this.itemDel(params);
      })
    },
    confirm(data){
      console.log(data)
      this.$store.dispatch('getProduct')
    }
  }
};
</script>