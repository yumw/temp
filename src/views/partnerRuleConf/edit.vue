<template>
  <div>
    <el-form :model="formAddEdit" :rules="formAddEditRules" ref="formAddEdit" label-width="120px" class="add-edit-wrap">
      <el-form-item label="被分发资方编号" prop="partnerCode">
        <el-col :span="12">
          <el-select v-model="formAddEdit.partnerCode" auto-complete="off" filterable @change="partnerCodeChange">
            <el-option v-for="item in partner" :key="item.partnerCode" :label="item.partnerCode" :value="item.partnerCode"></el-option>
          </el-select>
        </el-col>
        <el-col :span="12">
          &nbsp;{{ partnerName }}
        </el-col>
      </el-form-item>
      <el-form-item label="知识包" prop="knowledgeId">
        <el-input v-model="formAddEdit.knowledgeId"></el-input>
      </el-form-item>
      <el-form-item label="执行顺序" prop="checkOrder">
        <el-input v-model.number="formAddEdit.checkOrder"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('formAddEdit')">确定</el-button>
        <el-button @click="$router.go(-1)">取消</el-button>
      </el-form-item>
    </el-form>
    <!-- <packagecodes-modal ref="packagecodesModal" :list="formAddEdit.packageCodes" @confirm="getPackagecodes"></packagecodes-modal> -->
  </div>
</template>
<script>
import { mapState } from 'vuex'
// import packagecodesModal from './components/packageCodesModal';
import { addPartnerSettingCheck, updatePartnerSettingCheck } from '@/api/partnerSettingCheck'
import { findRemainPartner } from '@/api/partner'
import { formatTime, timeToUnix } from '@/utils/index'
export default  {
  name: 'partnerRuleConfEdit',
  // components: {
  //   packagecodesModal
  // },
  data() {
    return {
      type: 0, // 0-新增  1-编辑
      formAddEdit: {
        partnerCode: '',
        knowledgeId: '',
        checkOrder: ''
      },
      formAddEditRules: {
        partnerCode: [{ required: true, message: '请输入被分发资方编号' }],
        knowledgeId: [{ required: true, message: '请输入知识包' }],
        checkOrder: [
          { required: true, message: '请输入执行顺序' },
          { type: 'number', message: '执行顺序必须是数字' }],
      },
      formLabelWidth: '120',
      partnerName:''
    }
  },
  computed:{
    ...mapState({
      //cooperativeMode: state => state.globalData.cooperativeMode,
      partner: state => state.globalData.partner
    })
  },
  created(){
    
  },
  async mounted(e){
    let { record } = this.$route.params
    await this.$store.dispatch('getPartner') //获取所有资方
    if(record){
      this.type = 1;
      this.formAddEdit = Object.assign(this.formAddEdit,record);
      this.partnerCodeChange(this.formAddEdit.partnerCode);
    }else{

    }
    //this.getPartner();
    
    
  },
  methods:{
    async getPartner(){
      let res = await findRemainPartner();
      if(res.resData){
        this.partner = res.resData;
        if(this.type === 1){
          let { partnerCode, partnerName } = this.formAddEdit;
          this.partner.push({partnerCode, partnerName})
          this.partnerCodeChange(partnerCode);
        }
      }
    },
    chooPackagecodes(){
      this.$refs.packagecodesModal.edit();
    },
    submitForm(formName){
      console.log(this.formAddEdit)
      this.$refs[formName].validate(valid => {
        if(valid){
          let params = {
            partnerCode: this.formAddEdit.partnerCode,
            knowledgeId: this.formAddEdit.knowledgeId,
            checkOrder: this.formAddEdit.checkOrder,
          }
          if(this.type == 0){ //新增
            console.log(params)
            //return false;
            this.addPartnerSettingCheck(params);
          }else{ //
            params.id = this.formAddEdit.id;
            this.updatePartnerSettingCheck(params);
          }
        }else{
          return false;
        }
      })
    },
    addPartnerSettingCheck(params){
      addPartnerSettingCheck(params).then(res => {
        if (res) {
          this.$router.go(-1);
          this.$message({
            type: 'success',
            message: '新增成功！'
          })
        }
      }).catch(error => {
        console.log(error)
      })
    },
    updatePartnerSettingCheck(params){
      updatePartnerSettingCheck(params).then(res => {
        if (res) {
          this.$router.go(-1);
          this.$message({
            type: 'success',
            message: '编辑成功！'
          })
        }
      }).catch(error => {
        console.log(error)
      })
    },
    getPackagecodes(data){
      console.log(data)
      let packageCodes = []
      data.forEach(item => {
        packageCodes.push(item.packageCode)
      })
      this.formAddEdit.packageCodes = packageCodes.join();
    },
    changeApproveTime(){
      if(this.approveTime.h == '24'){
        this.approveTime.m = '00';
        this.approveTime.s = '00';
      }
    },
    changeLongTermFlag(){
      if(this.formAddEdit.advanceFlag === 0){
        if(this.advanceCloseLongFlag === false){

        }
      }else{

      }
    },
    changeAdvanceCloseLongFlag(e){
      if(e === true){
        this.formAddEdit.advanceCloseBeginTime = '';
        this.formAddEdit.advanceCloseEndTime = '';
        this.formAddEdit.advanceCloseLongFlag = 1;

        this.formAddEditRules.advanceCloseBeginTime[0].required = false;
        this.formAddEditRules.advanceCloseEndTime[0].required = false;
      }else{
        this.formAddEdit.advanceCloseLongFlag = 0;

        this.formAddEditRules.advanceCloseBeginTime[0].required = true;
        this.formAddEditRules.advanceCloseEndTime[0].required = true;
      }
    },
    partnerCodeChange(e){
      let filterObj = this.partner.filter(item => item.partnerCode === e);
      this.partnerName = filterObj.length ? filterObj[0].partnerName : '';
    }
  }
}
</script>
<style>
.add-edit-wrap{
  padding: 20px;
  max-width: 500px;
}
</style>