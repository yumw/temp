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
      <el-form-item label="分发日期" prop="longTermFalg">
        <el-radio-group v-model="formAddEdit.longTermFalg" @change="changeLongTermFlag">
          <el-radio label="Y">长期有效</el-radio>
          <el-radio label="N">设置日期</el-radio>
        </el-radio-group>
      </el-form-item>
      <div v-if="formAddEdit.longTermFalg === 'N'">
      <el-form-item label="日期范围" prop="ruleDate">
        <el-date-picker type="daterange" v-model="formAddEdit.ruleDate" start-placeholder="开始日期" end-placeholder="结束日期" range-separator="至"></el-date-picker>
      </el-form-item> 
      </div>
      <el-form-item label="每日分发时间" prop="distTime">
        <el-time-picker is-range v-model="formAddEdit.distTime" value-format="HH:mm:ss" start-placeholder="开始时间" end-placeholder="结束时间" range-separator="至"></el-time-picker>
      </el-form-item>
      <el-form-item label="每日分发上限" prop="dayLimit">
        <el-col :span="20">
          <el-input v-model="formAddEdit.dayLimit" auto-complete="off" ></el-input>
        </el-col>
        <el-col :span="4">&nbsp;笔</el-col>
      </el-form-item>
      <!-- <el-form-item label="分发模式" prop="ruleMode">
        <el-select v-model="formAddEdit.ruleMode">
          <el-option :key="1" label="随机分发" :value="1"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="分发开关" prop="distFlag">
        <el-radio-group v-model="formAddEdit.distFlag">
          <el-radio label="Y">是</el-radio>
          <el-radio label="N">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('formAddEdit')">确定</el-button>
        <el-button @click="$router.go(-1)">取消</el-button>
      </el-form-item>
    </el-form>
    <packagecodes-modal ref="packagecodesModal" :list="formAddEdit.packageCodes" @confirm="getPackagecodes"></packagecodes-modal>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import packagecodesModal from './components/packageCodesModal';
import { addRule, updateRule } from '@/api/rule'
import { formatTime, timeToUnix } from '@/utils/index'
export default  {
  name: 'ruleEdit',
  components: {
    packagecodesModal
  },
  data() {
    return {
      type: 0, // 0-新增  1-编辑
      formAddEdit: {
        partnerCode: '',
        longTermFalg: 'Y',
        ruleDate: ['',''],
        distTime:['00:00:00','23:59:59'],
        dayLimit: '',
        distFlag: 'Y',
        //ruleMode: '',
      },
      advanceCloseLongFlag: false,
      formAddEditRules: {
        partnerCode: [{ required: true, message: '请输入被分发资方编号' }],
        longTermFalg: [{ required: true, message: '请选择分发日期' }],
        dayLimit: [
          { required: true, message: '请输入每日分发上限' }, 
          { min: 0, max: 99999999, message: '每日分发上限格式不正确' }
        ],
        distFlag: [{ required: true, message: '请选择分发开关' }],
        ruleDate: [{ required: true, message: '请输入日期范围' }],
        distTime: [{ required: true, message: '请输入时间范围' }],
        //ruleMode: [{ required: true, message: '请选择分发模式' }],
      },
      formLabelWidth: '120',
      partnerName:''
    }
  },
  computed:{
    ...mapState({
      cooperativeMode: state => state.globalData.cooperativeMode,
      partner: state => state.globalData.partner
    })
  },
  mounted(e){
    console.log(111,this.$route.params.record)
    let { record } = this.$route.params
    if(record){
      this.type = 1;
      record.dayLimit = String(record.dayLimit)
      this.formAddEdit = Object.assign(this.formAddEdit,record);
      this.formAddEdit.ruleDate = [formatTime(this.formAddEdit.ruleBeginDate,'yyyy-MM-dd'),formatTime(this.formAddEdit.ruleEndDate,'yyyy-MM-dd')]
      this.formAddEdit.distTime = [this.formAddEdit.distBeginTime,this.formAddEdit.distEndTime]
    }else{
      // this.formAddEdit = {
      //   packageCode: '',
      //   caseLabels: '',
      //   channelNames: '',
      //   prodCode: '',
      //   outputRate: '',
      // }
    }
    
  },
  methods:{
    chooPackagecodes(){
      this.$refs.packagecodesModal.edit();
    },
    submitForm(formName){
      console.log(this.formAddEdit)
      this.$refs[formName].validate(valid => {
        if(valid){
          let params = {
            partnerCode: this.formAddEdit.partnerCode,
            longTermFalg: this.formAddEdit.longTermFalg,
            distBeginTime: this.formAddEdit.distTime[0],
            distEndTime: this.formAddEdit.distTime[1],
            dayLimit: Number(this.formAddEdit.dayLimit),
            //ruleMode: this.formAddEdit.ruleMode,
            distFlag: this.formAddEdit.distFlag,
          }
          if(params.longTermFalg === 'N'){
            let params2 = {
              ruleBeginDate: timeToUnix(this.formAddEdit.ruleDate[0]),
              ruleEndDate: timeToUnix(this.formAddEdit.ruleDate[1]),
            }
            params = {...params,...params2}
          }
          if(this.type == 0){ //新增
            console.log(params)
            //return false;
            this.addRule(params);
          }else{ //
            params.id = this.formAddEdit.id;
            this.updateRule(params);
          }
        }else{
          return false;
        }
      })
    },
    addRule(params){
      addRule(params).then(res => {
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
    updateRule(params){
      updateRule(params).then(res => {
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
      console.log(e)
      let filterObj = this.partner.filter(item => item.partnerCode === e);
      console.log(filterObj)
      this.partnerName = filterObj[0].partnerName
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