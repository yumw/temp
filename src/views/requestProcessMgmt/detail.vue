<template>
  <div>
    <el-form label-width="100px" class="add-edit-wrap">
      <el-form-item label="请求内容：">{{ requestData }}</el-form-item>
      <el-form-item label="响应内容：">
        <el-table ref="multipleTable" row-key="id" :data="tableData" border >
          <el-table-column prop="responseData" >
            <template slot-scope="scope">
              {{ scope.row }}
            </template>
          </el-table-column>
        </el-table>
        <!-- <el-pagination
            class="mt10"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="rows"
            :current-page.sync="page"
            layout="total,sizes, prev, pager, next, jumper"
            :total="tableData.length"
        ></el-pagination> -->
      </el-form-item>
      
    </el-form>
        
  </div>
</template>
<script>
import { mapState } from "vuex";
import { findDetailById } from "@/api/requestProcess";
import { formatTime, timeToUnix } from "@/utils/index";

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
      title: '详情',
      id:'',
      requestData:''
    };
  },
  mounted() {
    this.id = this.$route.params.id;
    this.visible = true;
    this.tableData = [];
    this.query(this.rows,1);
  },
  methods: {
    formatTime,
    handleSizeChange(val) {
      this.rows = val;
      //this.query(this.rows, this.page);
    },
    handleCurrentChange(val) {
      this.page = val;
      //this.query(this.rows, this.page);
    },
    async query(rows, page) {
      this.page = page;
      // const params = Object.assign(
      //   {
      //     rows: 100000,
      //     page: 1
      //   },
      //   this.form
      // );
      let params = {
        id: this.id
      }
      let res = await findDetailById(params)
        if (res.resData) {
          //this.total = res.resData.total
          this.tableData = res.resData.responseData;
          this.requestData = res.resData.requestData;
        }
    },
    edit(record) {
      
    }
  }
};
</script>