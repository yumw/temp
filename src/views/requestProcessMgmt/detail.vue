<template>
  <div>
    <el-form label-width="150px" class="mt20">
      <el-form-item label="业务流水号：">{{ formAddEdit.businessCode }}</el-form-item>
      <el-form-item label="服务名：">{{ formAddEdit.serviceCode }}</el-form-item>
      <el-form-item label="服务中文名：">{{ formAddEdit.serviceName }}</el-form-item>
      <el-form-item label="请求方：">{{ formAddEdit.requestSource }}</el-form-item>
      <el-form-item label="接收方：">{{ formAddEdit.requestTarget }}</el-form-item>
      <el-form-item label="创建时间：">{{ formatTime(formAddEdit.createTime) }}</el-form-item>
      <el-form-item label="处理状态：">{{ formAddEdit.processState | processState }}</el-form-item>
      <el-form-item label="请求内容：" class="wordBreak">{{ formAddEdit.requestData }}</el-form-item>
      <el-form-item label="响应内容：">
        <div v-for="item in tableData" :key="item" class="wordBreak" style="border-bottom: 1px solid #eee;">{{ item }}</div>
      </el-form-item>
      <el-form-item>
          <el-button @click="$router.go(-1)">返回</el-button>
      </el-form-item>
    </el-form>
        
  </div>
</template>
<script>
import { mapState } from "vuex";
import { findDetailById } from "@/api/requestProcess";
import { formatTime, timeToUnix } from "@/utils/index";

export default {
  name:'requestProcessMgmtDetail',
  data() {
    return {
      tableData: [],
      formAddEdit:{

      },
      total: 0,
      rows: 10,
      page: 1,
      title: '详情',
      id:'',
    };
  },
  mounted() {
    let { record } = this.$route.params
    console.log(record)
    this.formAddEdit = record;
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
        id: this.formAddEdit.id
      }
      let res = await findDetailById(params)
        if (res.resData) {
          //this.total = res.resData.total
          this.tableData = res.resData.responseData;
          this.formAddEdit.requestData = res.resData.requestData;
        }
    },
    edit(record) {
      
    }
  }
};
</script>