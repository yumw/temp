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
        <el-form-item label="产品号" prop="prodCode">
          <el-input v-model="formAddEdit.prodCode"></el-input>
        </el-form-item>
        <el-form-item label="产品名称" prop="prodName">
          <el-input v-model="formAddEdit.prodName"></el-input>
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
import { addProduct, updateProduct, findProductByCode } from "@/api/product";
export default {
  data() {
    return {
      title: "新增",
      type: 0, // 0-新增  1-编辑
      formAddEdit: {
        prodCode: "",
        prodName: ""
      },
      formAddEditRules: {
        prodCode: [{ required: true, message: "产品号不能为空" }],
        prodName: [{ required: true, message: "产品名称不能为空" }]
      },
      visible: false,
      prodCode:''
    };
  },
  methods: {
    edit(record) {
      console.log(record);
      if (record) {
        this.type = 1;
        this.title = "编辑";
        this.formAddEdit = { ...record };
        this.prodCode = this.formAddEdit.prodCode;
      } else {
        this.type = 0;
        this.title = "新增";
        this.formAddEdit = {
          prodCode: "",
          prodName: ""
        };
      }
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["formAddEdit"].clearValidate();
        //this.$refs.tree.setCheckedKeys(this.list.split(","));
      });
    },
    //新增/编辑点击确定
    confirm() {
      this.$refs["formAddEdit"].validate(valid => {
        if (valid) {
          let params = {
            prodCode: this.formAddEdit.prodCode,
            prodName: this.formAddEdit.prodName
          };
          findProductByCode({ prodCode: params.prodCode }).then(res => {
            if (
              res.resData &&
              res.resData.list &&
              ((this.type === 0 && res.resData.list.length > 0) ||
                (this.type === 1 &&
                  res.resData.list.length > 0 &&
                  res.resData.list[0].prodCode !== this.prodCode))
            ) {
              this.$message({
                type: "error",
                message: "该产品号已存在，请勿重复添加！"
              });
            } else {
              if (this.type == 0) {
                //新增
                this.addProduct(params);
              } else {
                params.id = this.formAddEdit.id;
                this.updateProduct(params);
              }
            }
          });
        } else {
          return false;
        }
      });
    },
    //新增产品号
    addProduct(params) {
      addProduct(params)
        .then(res => {
          if (res) {
            this.$emit("confirm", res);
            this.visible = false;
            this.$message({
              type: "success",
              message: "新增成功！"
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //编辑产品号
    updateProduct(params) {
      addProduct(params)
        .then(res => {
          if (res) {
            this.$emit("confirm", res);
            this.visible = false;
            this.$message({
              type: "success",
              message: "编辑成功！"
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>