<template>
  <div>
    <el-dialog :title="title" :visible.sync="visible" width="80%">
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
      </el-form>
        
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="visible = false">确定</el-button>
      </span>
    </el-dialog>
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
      let res = await getRequestReceiveDetail(params)
        if (res.resData) {
          this.total = res.resData.total
          this.formAddEdit = res.resData  
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
<style lang="scss" scoped>
/deep/ .el-form-item {
  &__label {
    font-weight: 700;
  }
  &__content {
    word-break: break-all
  }
}

</style>