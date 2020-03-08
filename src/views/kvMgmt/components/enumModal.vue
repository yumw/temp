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
        <el-form-item label="枚举Key" prop="enumKey">
          <el-input v-model="formAddEdit.enumKey"></el-input>
        </el-form-item>
        <el-form-item label="枚举Value" prop="enumValue">
          <el-input v-model="formAddEdit.enumValue"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="enumDesc">
          <el-input type="textarea" v-model="formAddEdit.enumDesc"></el-input>
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
import { insertEnum, updateEnum } from "@/api/configEnum";
export default {
  data() {
    return {
      title: "新增",
      type: 0, // 0-新增  1-编辑
      formAddEdit: {},
      formAddEditRules: {
        enumKey: [{ required: true, message: '枚举Key不能为空' }],
        enumValue: [{ required: true, message: '枚举Value不能为空' }],
        enumDesc: [{ required: true, message: '描述不能为空' }],
      },
      visible: false
    };
  },
  methods: {
    edit(record,type) {
      if (type === 1) {
        this.type = 1;
        this.title = "编辑";
        this.formAddEdit = Object.assign({}, this.formAddEdit, {
          enumKey: "",
          enumValue: "",
          enumDesc: ""
        }, record);
      } else {
        this.type = 0;
        this.title = "新增";
        this.formAddEdit = Object.assign({}, this.formAddEdit, {
          enumKey: "",
          enumValue: "",
          enumDesc: ""
        },record);
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
          enumTypeName: this.formAddEdit.enumTypeName,
          enumKey: this.formAddEdit.enumKey,
          enumValue: this.formAddEdit.enumValue,
          enumDesc: this.formAddEdit.enumDesc
        };
        console.log(params)
        if (this.type == 1) {
          params.id = this.formAddEdit.id;
          this.updateEnum(params);
        }else{
          this.insertEnum(params);
        }
      }
    },
    //新增
    async insertEnum(params) {
      let res = await insertEnum(params)
        if (res) {
          this.$emit("confirm", res);
          this.visible = false;
          this.$message({
            type: "success",
            message: "新增成功！"
          });
        }
    },
    //编辑
    async updateEnum(params) {
      let res = await updateEnum(params)
        if (res) {
          this.$emit("confirm", res);
          this.visible = false;
          this.$message({
            type: "success",
            message: "编辑成功！"
          });
        }
    }
  }
};
</script>