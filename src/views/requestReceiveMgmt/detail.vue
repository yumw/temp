<template>
  <div>
    <el-form :model="formAddEdit" ref="formAddEdit" label-width="100px" class="add-edit-wrap">
        <el-form-item label="id">{{ formAddEdit.id }}</el-form-item>
        <el-form-item label="请求流水号">{{ formAddEdit.businessCode }}</el-form-item>
        <el-form-item label="资方编号">{{ formAddEdit.partnerCode }}</el-form-item>
        <el-form-item label="服务编码">{{ formAddEdit.serviceCode }}</el-form-item>
        <el-form-item label="服务名称">{{ formAddEdit.serviceName }}</el-form-item>
        <el-form-item label="请求时间">{{ formatTime(formAddEdit.requestTime,'yyyy-MM-dd HH:mm:ss') }}</el-form-item>
        <el-form-item label="请求内容">{{ formAddEdit.requestContent }}</el-form-item>
        <el-form-item label="请求类型">{{ formAddEdit.requestType }}</el-form-item>
        <el-form-item label="创建时间">{{ formatTime(formAddEdit.createTime,'yyyy-MM-dd HH:mm:ss') }}</el-form-item>
        <el-form-item>
            <el-button @click="$router.go(-1)">返回</el-button>
        </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { getRequestReceiveDetail } from "@/api/requestReceive";
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
      formAddEdit: {},
      tableData: [],
      total: 0,
      rows: 10,
      page: 1,
      title: '详情',
      id:''
    };
  },
  mounted(e) {
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
      let res = await getRequestReceiveDetail(params)
        if (res.resData) {
          this.total = res.resData.total
          this.formAddEdit = res.resData  
        }
    },
    edit(record) {
      
    }
  }
};
</script>
