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
        <el-form-item label="枚举类型" prop="enumTypeName">
          <el-input v-model="formAddEdit.enumTypeName"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="enumTypeDesc">
          <el-input type="textarea" v-model="formAddEdit.enumTypeDesc"></el-input>
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
import { insertType, updateType } from "@/api/configEnum";
export default {
  data() {
    return {
      title: "新增",
      type: 0, // 0-新增  1-编辑
      formAddEdit: {},
      formAddEditRules: {
        enumTypeName: [{ required: true, message: '枚举类型不能为空' }],
        enumTypeDesc: [{ required: true, message: '描述不能为空' }],
      },
      visible: false
    };
  },
  methods: {
    edit(record) {
      if (record) {
        this.type = 1;
        this.title = "编辑";
        this.formAddEdit = Object.assign({}, this.formAddEdit, {
          enumTypeName: "",
          enumTypeDesc: ""
        }, record);
      } else {
        this.type = 0;
        this.title = "新增";
        this.formAddEdit = Object.assign({}, this.formAddEdit, {
          enumTypeName: "",
          enumTypeDesc: ""
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
          enumTypeName: this.formAddEdit.enumTypeName,
          enumTypeDesc: this.formAddEdit.enumTypeDesc
        };
        if (this.type == 1) {
          params.id = this.formAddEdit.id;
          this.updateType(params);
        }else{
          this.insertType(params);
        }
      }
    },
    //新增
    async insertType(params) {
      let res = await insertType(params)
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
    async updateType(params) {
      let res = await updateType(params)
        if (res) {
          this.$emit("confirm", res);
          this.visible = false;
          this.$message({
            type: "success",
            message: "操作成功！"
          });
        }
    }
  }
};
</script>