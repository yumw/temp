<template>
  <div>
    <el-form
      :model="formAddEdit"
      :rules="formAddEditRules"
      ref="formAddEdit"
      label-width="120px"
      class="add-edit-wrap"
    >
      <el-form-item label="资方编号" v-if="type != 0">
        <div>{{ formAddEdit.partnerCode }}</div>
      </el-form-item>
      <el-form-item label="资方名称" prop="partnerName">
        <!-- <el-input v-model="formAddEdit.partnerName"></el-input> -->
        <el-autocomplete v-model="formAddEdit.partnerName" :fetch-suggestions="querySearch"></el-autocomplete>
      </el-form-item>
      <el-form-item label="资方全称" prop="partnerFullName">
        <!-- <el-input v-model="formAddEdit.partnerFullName" placeholder="填写协议签署的公司全名"></el-input> -->
        <el-autocomplete
          v-model="formAddEdit.partnerFullName"
          :fetch-suggestions="querySearch2"
          placeholder="填写协议签署的公司全名"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="合作模式" prop="cooperativeMode">
        <el-select
          v-model="formAddEdit.cooperativeMode"
          auto-complete="off"
          filterable
          @change="cooperativeModeChange"
        >
          <el-option
            v-for="item in cooperativeMode"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="中邮出资比例" prop="investRatio">
        <el-col :span="20">
          <el-input
            type="number"
            v-model="formAddEdit.investRatio"
            :disabled="formAddEdit.cooperativeMode!='1'"
            auto-complete="off"
            oninput="value = /^(\d{1,2}|100)$/.test(value) ? value : ''"
          ></el-input>
        </el-col>
        <el-col :span="4">%</el-col>
      </el-form-item>
      <el-form-item label="资产偏好" prop="packageCode">
        <el-col :span="18">
          <el-input readonly v-model="formAddEdit.packageCode" auto-complete="off"></el-input>
        </el-col>
        <el-col :span="6">
          &nbsp;
          <el-button @click="choopackageCode">选择</el-button>
        </el-col>
      </el-form-item>
      <el-form-item label="审批时效" prop="approveTime">
        <el-select v-model="approveTime.h" @change="changeApproveTime" style="width:65px">
          <el-option
            v-for="item in 25"
            :key="item"
            :value="item.toString().length < 2 ? '0'+(item-1) : (item-1)"
          ></el-option>
        </el-select>
        <span>时</span>
        <el-select v-model="approveTime.m" style="width:65px">
          <el-option v-if="approveTime.h == '24'" :key="1" value="00"></el-option>
          <el-option
            v-else
            v-for="item in 60"
            :key="item"
            :value="item.toString().length < 2 ? '0'+(item-1) : (item-1)"
          ></el-option>
        </el-select>
        <span>分</span>
        <el-select v-model="approveTime.s" style="width:65px">
          <el-option v-if="approveTime.h == '24'" :key="1" value="00"></el-option>
          <el-option
            v-else
            v-for="item in 60"
            :key="item"
            :value="item.toString().length < 2 ? '0'+(item-1) : (item-1)"
          ></el-option>
        </el-select>
        <span>秒</span>
        <!-- <el-time-picker v-model="formAddEdit.approveTime" :picker-options="{selectableRange: '00:00:00 - 24:00:00'}"></el-time-picker> -->
      </el-form-item>
      <el-form-item label="提现开关" prop="advanceFlag">
        <el-radio-group v-model="formAddEdit.advanceFlag" @change="changeAdvanceFlag">
          <el-radio label="Y">开</el-radio>
          <el-radio label="N">关</el-radio>
        </el-radio-group>
      </el-form-item>
      <div v-if="formAddEdit.advanceFlag === 'N'">
        <el-form-item label="关闭时间段" prop="advanceCloseBeginTime">
          <el-date-picker
            type="datetime"
            placeholder="选择时间"
            @blur="xxx"
            v-model="formAddEdit.advanceCloseBeginTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            :disabled="formAddEdit.advanceCloseLongFlag === 'Y'"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="至" prop="advanceCloseEndTime">
          <el-date-picker
            type="datetime"
            placeholder="选择时间"
            v-model="formAddEdit.advanceCloseEndTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            :disabled="formAddEdit.advanceCloseLongFlag === 'Y'"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-checkbox
            v-model="formAddEdit.advanceCloseLongFlag"
            true-label="Y"
            false-label="N"
            @change="changeAdvanceCloseLongFlag"
          >长期有效</el-checkbox>
        </el-form-item>
      </div>

      <el-form-item>
        <el-button type="primary" @click="submitForm('formAddEdit')">确定</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
    <packageCode-modal
      ref="packageCodeModal"
      :list="formAddEdit.packageCode"
      @confirm="getpackageCode"
    ></packageCode-modal>
  </div>
</template>
<script>
import { mapState } from "vuex";
import packageCodeModal from "./components/packageCodeModal";
import { addPartner, updatePartner } from "@/api/partner";
import { formatTime, timeToUnix } from "@/utils/index";
export default {
  name: "assetPackEdit",
  components: {
    packageCodeModal
  },
  data() {
    let fullNameValid = (rule, value, callback) => {
      value = value.replace(/\s+/g, "");
      let valid = this.partner.some(item => item.partnerFullName == value);
      console.log(valid);
      if (valid === true) {
        callback(new Error("资方全称不能重复！"));
      } else {
        callback();
      }
    };
    return {
      type: 0, // 0-新增  1-编辑
      formAddEdit: {
        partnerName: "", //资方名称	String	是
        partnerFullName: "", //资产全称	String	是
        cooperativeMode: "", //合作模式	Int	是	0：中邮自营，1：联合贷款，2：资方全资
        investRatio: "", //中邮出资比例	Int	是
        packageCode: "", //资产偏好	String	是	可多选，渠道之间以逗号分隔
        approveTime: "24:00:00", //审批时效	Int	是	时间戳
        advanceFlag: "", //提现开关	Int	是	0：关闭，1：开启
        advanceCloseBeginTime: "", //提现开关关闭（开始时间）	Int		时间戳（提现开关关闭时才传）
        advanceCloseEndTime: "", //提现开关关闭（结束时间）	Int		时间戳（提现开关关闭时才传）
        advanceCloseLongFlag: 0 //提现关闭长期标志	Int		0：关闭，1：开启（提现开关关闭时才传）
      },
      approveTime: {
        h: "24",
        m: "00",
        s: "00"
      },
      formAddEditRules: {
        partnerName: [{ required: true, message: "请输入资方名称" }],
        partnerFullName: [
          { required: true, message: "请输入资方全称" }
          // { validator: fullNameValid, trigger: 'blur' }
        ],
        cooperativeMode: [{ required: true, message: "请选择合作模式" }],
        investRatio: [{ required: true, message: "请输入中邮出资比例" }],
        packageCode: [{ required: true, message: "请选择资产偏好" }],
        approveTime: [{ required: true, message: "请选择审批时效" }],
        advanceFlag: [{ required: true, message: "请选择提现开关" }],
        advanceCloseBeginTime: [{ required: true, message: "请输入开始时间" }],
        advanceCloseEndTime: [{ required: true, message: "请输入结束时间" }]

        // channelNames: [{ required: true, message: '请选择来源渠道' }],
        // prodCode: [{ required: true, message: '请选择产品号', trigger: 'change' }],
        // outputRate: [{ required: true, message: '请输入输出比例', trigger: 'blur' }]
      },
      formLabelWidth: "120",
      dirty: false
    };
  },
  computed: {
    ...mapState({
      cooperativeMode: state => state.globalData.cooperativeMode,
      partner: state => state.globalData.partner
    })
  },
  mounted(e) {
    this.$store.dispatch("getPartner"); //获取所有资方
    let { record } = this.$route.params;
    if (record) {
      this.type = 1;
      //this.formAddEdit = record;
      Object.assign(this.formAddEdit, record);
      this.formAddEdit.advanceCloseBeginTime = record.advanceCloseBeginTime
        ? formatTime(record.advanceCloseBeginTime)
        : "";
      this.formAddEdit.advanceCloseEndTime = record.advanceCloseEndTime
        ? formatTime(record.advanceCloseEndTime)
        : "";
      let approveTime = record.approveTime.split(":");
      this.approveTime = {
        h: approveTime[0],
        m: approveTime[1],
        s: approveTime[2]
      };
      this.changeAdvanceCloseLongFlag(this.formAddEdit.advanceCloseLongFlag);
      // if (this.formAddEdit.advanceCloseLongFlag === 'Y') {
      //   this.formAddEdit.advanceCloseBeginTime = "";
      //   this.formAddEdit.advanceCloseEndTime = "";

      //   this.formAddEditRules.advanceCloseBeginTime[0].required = false;
      //   this.formAddEditRules.advanceCloseEndTime[0].required = false;
      // } else {
      //   this.formAddEditRules.advanceCloseBeginTime[0].required = true;
      //   this.formAddEditRules.advanceCloseEndTime[0].required = true;
      // }
    } else {

    }

    this.$nextTick(() => {
      this.dirty = false;
    });
  },
  methods: {
    choopackageCode() {
      this.$refs.packageCodeModal.edit();
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let partnerName = this.formAddEdit.partnerName.replace(/\s+/g, "");
          let partnerFullName = this.formAddEdit.partnerFullName.replace(/\s+/g,"");

          let params = {
            partnerName,
            partnerFullName,
            cooperativeMode: this.formAddEdit.cooperativeMode,
            investRatio: Number(this.formAddEdit.investRatio),
            packageCode: this.formAddEdit.packageCode,
            approveTime: `${this.approveTime.h}:${this.approveTime.m}:${this.approveTime.s}`,
            advanceFlag: this.formAddEdit.advanceFlag,
            advanceCloseLongFlag: this.formAddEdit.advanceCloseLongFlag
          };
          if (params.advanceFlag === "N") {
            let params2 = {
              advanceCloseBeginTime: new Date(
                this.formAddEdit.advanceCloseBeginTime
              ).getTime(),
              advanceCloseEndTime: new Date(
                this.formAddEdit.advanceCloseEndTime
              ).getTime()
            };
            if (params2.advanceCloseBeginTime >= params2.advanceCloseEndTime) {
              this.$message({
                message: "开始日期应小于截止日期",
                type: "error"
              });
              return false;
            }
            params = { ...params, ...params2 };
          }
          if (this.type == 0) {
            //新增
            console.log(params);
            //return false;
            this.addPartner(params);
          } else {
            //
            params.id = this.formAddEdit.id;
            params.partnerCode = this.formAddEdit.partnerCode;
            this.updatePartner(params);
          }
        } else {
          return false;
        }
      });
    },
    addPartner(params) {
      addPartner(params)
        .then(res => {
          if (res) {
            this.$router.go(-1);
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
    updatePartner(params) {
      updatePartner(params)
        .then(res => {
          if (res) {
            this.$router.go(-1);
            this.$message({
              type: "success",
              message: "编辑成功！"
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getpackageCode(data) {
      console.log(data);
      let packageCode = [];
      data.forEach(item => {
        packageCode.push(item.packageCode);
      });
      this.formAddEdit.packageCode = packageCode.join();
    },
    changeApproveTime() {
      if (this.approveTime.h == "24") {
        this.approveTime.m = "00";
        this.approveTime.s = "00";
      }
    },
    changeAdvanceFlag() {
      console.log(this.formAddEdit.advanceFlag);
      // if (this.formAddEdit.advanceFlag === "N") {
      //   if (this.advanceCloseLongFlag === false) {
      //   }
      // } else {
      // }
    },
    changeAdvanceCloseLongFlag(e) {
      if (e === 'Y') {
        this.formAddEdit.advanceCloseBeginTime = "";
        this.formAddEdit.advanceCloseEndTime = "";

        this.formAddEditRules.advanceCloseBeginTime[0].required = false;
        this.formAddEditRules.advanceCloseEndTime[0].required = false;
      } else {
        this.formAddEditRules.advanceCloseBeginTime[0].required = true;
        this.formAddEditRules.advanceCloseEndTime[0].required = true;
      }
    },
    cooperativeModeChange(e) {
      console.log(e);
      if (e === "0") {
        this.formAddEdit.investRatio = "100";
      } else if (e === "2") {
        this.formAddEdit.investRatio = "0";
      }
    },
    cancel() {
      if (this.dirty == true) {
        this.$confirm("是否保存此次修改？", "提示", {
          type: "warning"
        })
          .then(() => {
            this.submitForm("formAddEdit");
          })
          .catch(() => {
            this.$router.go(-1);
          });
      } else {
        this.$router.go(-1);
      }
    },
    createFilter(data) {
      return res => {
        return res.value.toLowerCase().indexOf(data.toLowerCase()) === 0;
      };
    },
    querySearch(data, cb) {
      let partner = [];
      this.$store.state.globalData.partner.forEach(item => {
        partner.push({
          value: item.partnerName
        });
      });
      let result = data ? partner.filter(this.createFilter(data)) : partner;
      cb(result);
    },
    querySearch2(data, cb) {
      let partnerFullName = [];
      this.$store.state.globalData.partner.forEach(item => {
        console.log(item.partnerFullName);
        if (item.partnerFullName != undefined) {
          partnerFullName.push({
            value: item.partnerFullName
          });
        }
      });
      let result = data
        ? partnerFullName.filter(this.createFilter(data))
        : partnerFullName;
      cb(result);
    },
    xxx(e, b, c) {
      console.log(e, b, c);
    }
  },
  watch: {
    formAddEdit: {
      handler(obj) {
        console.log(obj);
        this.dirty = true;
      },
      deep: true
    },
    approveTime: {
      handler(obj) {
        console.log(obj);
        this.dirty = true;
      },
      deep: true
    }
  }
};
</script>
<style>
.add-edit-wrap {
  padding: 20px;
  max-width: 500px;
}
</style>