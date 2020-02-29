<template>
  <div>
    <el-form :model="formAddEdit" :rules="formAddEditRules" ref="formAddEdit" label-width="100px" class="add-edit-wrap">
      <el-form-item label="资产包编号" prop="packageCode" v-if="type != 0">
          <!-- <el-input disabled v-model="formAddEdit.packageCode"></el-input> -->
          <div>{{ formAddEdit.packageCode }}</div>
      </el-form-item>
      <!-- <el-form-item label="资产标签" prop="zcbq">
        <el-select v-model="formAddEdit.acbq" auto-complete="off" filterable>
          <el-option v-for="item in $store.state.globalData.channels" :key="item.channelCode" :label="item.channelName" :value="item.channelName"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="资产标签" prop="caseLabel">
        <el-col :span="18">
          <el-input type="textarea" :autozize="{minRows:1,maxRows:6}" :rows="1" style="vertical-align: middle;" readonly v-model="formAddEdit.caseLabel" auto-complete="off"></el-input>
        </el-col>
        <el-col :span="6">
          &nbsp;
          <el-button @click="choocaseLabel" size="small">选择</el-button>
        </el-col>
      </el-form-item>
      <el-form-item label="来源渠道" prop="channelName">
        <el-col :span="18">
          <el-input type="textarea" autozize :rows="4" readonly v-model="formAddEdit.channelName" auto-complete="off"></el-input>
        </el-col>
        <el-col :span="6">
          &nbsp;
          <el-button @click="choochannelName" size="small">选择</el-button>
        </el-col>
      </el-form-item>
      <el-form-item label="产品号" prop="prodCode">
        <el-select v-model="formAddEdit.prodCode" auto-complete="off" filterable>
          <el-option v-for="item in product" :key="item.prodCode" :label="item.prodCode" :value="item.prodCode"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="输出比例" prop="ouputRate">
        <el-col :span="20">
          <el-input type="number" v-model="formAddEdit.ouputRate" auto-complete="off" oninput="value = /^(\d{1,2}|100)$/.test(value) ? value : ''" ></el-input>
        </el-col>
        <el-col :span="4">%</el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('formAddEdit')">确定</el-button>
        <el-button @click="$router.go(-1)">取消</el-button>
      </el-form-item>
    </el-form>
    <assettag-modal ref="assettagModal" :list="formAddEdit.caseLabel" @confirm="getcaseLabel"></assettag-modal>
    <channel-modal ref="channelModal" :list="formAddEdit.channelCode" @confirm="getChannel"></channel-modal>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import assettagModal from './components/assetTagModal';
import channelModal from './components/channelModal';
import { addPackage, updatePackage } from '@/api/assetPack'
export default  {
  name: 'assetPackEdit',
  components: {
    assettagModal,
    channelModal
  },
  data() {
    return {
      type: 0, // 0-新增  1-编辑
      formAddEdit: {
        packageCode: '',
        caseLabel: '',
        channelName: '',
        channelCode: '',
        prodCode: '',
        ouputRate: '',
      },
      formAddEditRules: {
        caseLabel: [{ required: true, message: '请选择资产标签' }],
        channelName: [{ required: true, message: '请选择来源渠道' }],
        prodCode: [{ required: true, message: '请选择产品号', trigger: 'change' }],
        ouputRate: [{ required: true, message: '请输入输出比例', trigger: 'blur' }]
      },
      formLabelWidth: '120',
      channelNames:[]
    }
  },
  computed:{
    ...mapState({
      assetTag: state => state.globalData.assetTag,
      product: state => state.globalData.product
    })
  },
  mounted(e){
    console.log(111,this.$route.params.record)
    let { record } = this.$route.params
    if(record){
      this.type = 1;
      this.formAddEdit = Object.assign(this.formAddEdit,record);
      let channelCode = this.formAddEdit.channelCode.split(',');
      
      let channelName = this.formAddEdit.channelName.split(',');
      for(let i in channelCode){
        channelName[i] = channelCode[i] + channelName[i]
      }
      this.formAddEdit.channelName = channelName.join('\n');
    }else{
      this.type = 0
      // this.formAddEdit = {
      //   packageCode: '',
      //   caseLabel: '',
      //   channelCode: '',
      //   channelName: '',
      //   prodCode: '',
      //   ouputRate: '',
      // }
    }
    
  },
  methods:{
    choocaseLabel(){
      this.$refs.assettagModal.edit();
    },
    choochannelName(){
      this.$refs.channelModal.edit();
    },
    submitForm(formName){
      this.$refs[formName].validate(valid => {
        if(valid){
          let params = {
            caseLabel: this.formAddEdit.caseLabel,
            channelCode: this.formAddEdit.channelCode,
            prodCode: this.formAddEdit.prodCode,
            ouputRate: Number(this.formAddEdit.ouputRate),
          }
          if(this.type == 0){ //新增
            this.addPackage(params);
          }else{ //编辑
            params.id = this.formAddEdit.id;
            params.packageCode = this.formAddEdit.packageCode
            this.updatePackage(params);
          }
        }else{
          return false;
        }
      })
    },
    addPackage(params){
      console.log(params)
      //return false;
      addPackage(params).then(res => {
        this.$router.go(-1);
        this.$message({
          type: 'success',
          message: '新增成功！'
        })
      }).catch(error => {
        console.log(error)
      })
    },
    updatePackage(params){
      updatePackage(params).then(res => {
        this.$router.go(-1)
        this.$message({
          type: 'success',
          message: '编辑成功！'
        })
      }).catch(error => {
        console.log(error)
      })
    },
    getcaseLabel(data){
      this.formAddEdit.caseLabel = data;
    },
    getChannel(values, labels){
      console.log(values,labels)
      this.formAddEdit.channelCode = values;
      this.formAddEdit.channelName = labels;
      //this.channelNames = labels.split(',')
    }
  }
}
</script>
<style>
.add-edit-wrap{
  padding: 20px;
  max-width: 500px;
}
.check-list{
  display: inline-block;
  padding: 10px 0;
  border: 1px solid #c0c4cc;
  min-height: 30px;
  width: 100%;
  vertical-align: middle;
  border-radius: 4px
}
.check-list > .item{
  line-height: 1.2;
  word-wrap: break-word;
  word-break: normal;
  margin-bottom: 6px;
}
</style>