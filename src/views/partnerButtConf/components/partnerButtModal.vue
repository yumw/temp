<template>
  <div>
    <el-dialog :title="title" :visible.sync="visible">
      <el-form
        :model="formAddEdit"
        :rules="formAddEditRules"
        ref="formAddEdit"
        label-width="100px"
        class="add-edit-wrap"
      >
        <el-form-item label="资方编号" prop="partnerCode">
          <el-select v-model="formAddEdit.partnerCode" filterable :disabled="type === 1">
            <el-option
              v-for="item in partner"
              :key="item.partnerCode"
              :label="item.partnerCode"
              :value="item.partnerCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="请求地址">
          <el-input v-model="formAddEdit.requestUrl"></el-input>
        </el-form-item>
        <el-form-item label="资方秘钥">
          <el-input type="textarea" v-model="formAddEdit.encryptParam"></el-input>
        </el-form-item>
        <el-form-item label="资方类型">
          <el-select v-model="formAddEdit.partnerType" auto-complete="off" filterable>
            <el-option v-for="item in partnerType" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirm">确定</el-button>
        <el-button @click="visible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { addPartnerSetting, findPartnerSettingByCode } from "@/api/partnerSetting";
export default {
  data() {
    return {
      title: "新增",
      type: 0, // 0-新增  1-编辑
      formAddEdit: {},
      formAddEditRules: {
        partnerCode: [{ required: true, message: '请选择资方编号' }],
      },
      visible: false,
      partnerType:[
        {value: '1', label: '标准'},
        {value: '2', label: '定制化'}
      ]
    };
  },
  computed: {
    ...mapState({
      partner: state => state.globalData.partner
    })
  },
  methods: {
    edit(record) {
      this.$store.dispatch('getPartner') //获取所有资方
      if (record) {
        this.type = 1;
        this.title = "编辑";
        this.formAddEdit = Object.assign({}, this.formAddEdit, {
          partnerCode: "",
          requestUrl: "",
          encryptParam: "",
          partnerType:"",
        }, record);
      } else {
        this.type = 0;
        this.title = "新增";
        this.formAddEdit = Object.assign({}, this.formAddEdit, {
          partnerCode: "",
          requestUrl: "",
          encryptParam: "",
          partnerType:"",
        });
      }
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["formAddEdit"].clearValidate();
        //this.$refs.tree.setCheckedKeys(this.list.split(","));
      });
    },
    //新增/编辑点击确定
    async confirm() {
      let valid = await this.$refs["formAddEdit"].validate();
      if (valid) {
        let params = {
          partnerCode: this.formAddEdit.partnerCode,
          requestUrl: this.formAddEdit.requestUrl,
          encryptParam: this.formAddEdit.encryptParam,
          partnerType: this.formAddEdit.partnerType
        };
        if (this.type == 1) {
          params.id = this.formAddEdit.id;
          console.log(params)
          this.addPartnerSetting(params);
        }else{
          let res = await findPartnerSettingByCode({partnerCode:params.partnerCode})
          if(res.resData && res.resData.list && res.resData.list.length > 0 ){
            this.$message({
              type: "error",
              message: "该资方编号已存在，请勿重复添加！"
            });
          }else{
            this.addPartnerSetting(params);
          }
        }
      }
    },
    //编辑
    addPartnerSetting(params) {
      addPartnerSetting(params)
        .then(res => {
          if (res) {
            this.$emit("confirm", res);
            this.visible = false;
            this.$message({
              type: "success",
              message: "操作成功！"
            });
            //this.$store.dispatch("getPartner");
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>