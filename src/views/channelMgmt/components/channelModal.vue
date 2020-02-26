<template>
  <div>
    <el-dialog :title="title" :visible.sync="visible">
      <el-form :model="formAddEdit" :rules="formAddEditRules" ref="formAddEdit" label-width="100px" class="add-edit-wrap">
        <el-form-item label="渠道号" prop="channelCode">
            <el-input v-model="formAddEdit.channelCode"></el-input>
        </el-form-item>
        <el-form-item label="渠道名称" prop="channelName">
            <el-input v-model="formAddEdit.channelName"></el-input>
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
import { addChannel, updateChannel, findChannelByCode } from '@/api/channel'
export default  {
  data() {
    return {
      title: '新增',
      type: 0, // 0-新增  1-编辑
      formAddEdit: {
        channelCode: '',
        channelName: '',
      },
      formAddEditRules: {
        channelCode: [
          { required: true, message: '渠道号不能为空' },
          { min: 16, max: 16, message: '请输入正确渠道号' }
        ],
        channelName: [
          { required: true, message: '渠道名称不能为空' }
        ]
      },
      visible: false,
      channelCode: ''
    }
  },
  methods:{
    edit(record) {
      console.log(record)
      if(record){
        this.type = 1;
        this.title = "编辑";
        this.formAddEdit = {...record};
        this.channelCode = this.formAddEdit.channelCode;
      }else{
        this.type = 0;
        this.title = "新增";
        this.formAddEdit = {
          channelCode: '',
          channelName: ''
        }
      }
      this.visible = true;
      this.$nextTick(() => {
      this.$refs['formAddEdit'].clearValidate();
        //this.$refs.tree.setCheckedKeys(this.list.split(","));
      });
    },
    //新增/编辑点击确定
    confirm(){
      this.$refs['formAddEdit'].validate(valid => {
        if(valid){
          let channelName = this.formAddEdit.channelName.replace(/\s+/g,"");
          let params = {
            channelCode: this.formAddEdit.channelCode,
            channelName
          }
          findChannelByCode({ channelCode: params.channelCode }).then(res => {
            if (
              res.resData &&
              res.resData.list &&
              ((this.type === 0 && res.resData.list.length > 0) ||
                (this.type === 1 &&
                  res.resData.list.length > 0 &&
                  res.resData.list[0].channelCode !== this.channelCode))
            ) {
              this.$message({
                type: "error",
                message: "该渠道号已存在，请勿重复添加！"
              });
            } else {
              if(this.type == 0){ //新增
                this.addChannel(params);
              }else{
                params.id = this.formAddEdit.id
                this.updateChannel(params);
              }
            }
          });
        }else{
          return false;
        }
      }) 
    },
    //新增产品号
    addChannel(params){
      addChannel(params).then(res => {
        if (res) {
          this.$emit("confirm",res);
          this.visible = false;
          this.$message({
            type: 'success',
            message: '新增成功！'
          })
        }
      }).catch(error => {
        console.log(error)
      })
    },
    //编辑产品号
    updateChannel(params){
      addChannel(params).then(res => {
        if (res) {
          this.$emit("confirm",res);
          this.visible = false;
          this.$message({
            type: 'success',
            message: '编辑成功！'
          })
        }
      }).catch(error => {
        console.log(error)
      })
    },
  }
}
</script>