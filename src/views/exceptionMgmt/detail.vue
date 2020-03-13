<template>
  <div>
    <el-form label-width="150px" class="mt20">
      <el-form-item label="业务流水号：">{{ formAddEdit.businessCode }}</el-form-item>
      <el-form-item label="服务名：">{{ formAddEdit.serviceCode }}</el-form-item>
      <el-form-item label="服务中文名：">{{ formAddEdit.serviceName }}</el-form-item>
      <el-form-item label="请求方：">{{ formAddEdit.requestSource }}</el-form-item>
      <el-form-item label="接收方：">{{ formAddEdit.requestTarget }}</el-form-item>
      <el-form-item label="创建时间：">{{ formatTime(formAddEdit.exceptionTime) }}</el-form-item>
      <el-form-item label="处理状态：">{{ formAddEdit.exceptionState | exceptionState }}</el-form-item>
      <el-form-item label="请求内容：" class="wordBreak">{{ formAddEdit.requestData }}</el-form-item>
      <el-form-item label="响应内容：" class="wordBreak">{{ formAddEdit.responseData }}</el-form-item>
      <el-form-item>
          <el-button @click="$router.go(-1)">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { findExceptionById } from "@/api/exception";
import { formatTime, timeToUnix } from "@/utils/index";
export default {
  name:'exceptionMgmtDetail',
  data() {
    return {
      visible: false,
      formAddEdit: {

      },
      tableData: [],
      total: 0,
      rows: 10,
      page: 1,
      title: '详情'
    };
  },
  mounted() {
    let { record } = this.$route.params;
    this.formAddEdit = record
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
      let res = await findExceptionById(params)
        if (res.resData) {
          //this.total = res.resData.total
          //this.formAddEdit = res.resData 
          this.formAddEdit.responseData = res.resData.responseData;
          this.formAddEdit.requestData = res.resData.requestData; 
        }
    },
    edit(record) {

    }
  }
};
</script>