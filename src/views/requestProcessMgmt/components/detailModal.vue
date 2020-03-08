<template>
  <div>
    <el-dialog :title="title" :visible.sync="visible" width="80%">
      <div class="table-container">
        <div>requestData：</div><br/>
        <div>{{ requestData }}</div><br/>
        <el-table ref="multipleTable" row-key="id" :data="tableData.slice((page-1)*rows,page*rows)" border >
          <el-table-column prop="responseData" label="responseData">
            <template slot-scope="scope">
              {{ scope.row }}
            </template>
          </el-table-column>
          <!-- <el-table-column prop="id" label="id"></el-table-column>
          <el-table-column prop="processId" label="处理id"></el-table-column>
          <el-table-column prop="processTime" label="处理时间">
            <template slot-scope="scope">
              {{ formatTime(scope.row.processTime,'yyyy-MM-dd HH:mm:ss') }}
            </template>
          </el-table-column>
          <el-table-column prop="responseTime" label="响应时间">
            <template slot-scope="scope">
              {{ formatTime(scope.row.responseTime,'yyyy-MM-dd HH:mm:ss') }}
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间">
            <template slot-scope="scope">
              {{ formatTime(scope.row.createTime,'yyyy-MM-dd HH:mm:ss') }}
            </template>
          </el-table-column> -->
        </el-table>
        <el-pagination
            class="mt10"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="rows"
            :current-page.sync="page"
            layout="total,sizes, prev, pager, next, jumper"
            :total="tableData.length"
        ></el-pagination>
      </div>
        
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="visible = false">确定</el-button>
      </span>
    </el-dialog>
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
      console.log(record)
      this.id = record.id;
      this.visible = true;
      this.tableData = [];
      this.query(this.rows,1);
    }
  }
};
</script>