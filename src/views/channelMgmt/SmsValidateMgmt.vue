<template>
  <div class="app-container">
    <el-form :inline="true" :model="formQry">
      <el-form-item label="渠道编号:">
        <el-select v-model="formQry.channelCode" filterable>
            <el-option v-for="item in $store.state.globalData.channels" :key="item.channelCode" :label="item.channelName" :value="item.channelCode"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="产品编码: ">
        <el-input v-model="formQry.prodCode"></el-input>
      </el-form-item>
      <el-form-item label="产品名称: ">
        <el-input v-model="formQry.prodName"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="query(pageSize,1)">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="table-container">
      <div class="table-toolbar">
        <el-button type="primary" @click="add">新增</el-button>
      </div>
      <el-table ref="multipleTable" :data="tableData" border :stripe="stripe" style="width: 100%">
        <el-table-column prop="id" label="编号"></el-table-column>
        <el-table-column prop="channelCode" label="渠道编码"></el-table-column>
        <el-table-column prop="channelName" label="渠道名称"></el-table-column>
        <el-table-column prop="prodCode" label="产品编码"></el-table-column>
        <el-table-column prop="prodName" label="产品名称"></el-table-column>
        <el-table-column prop="messageCheckType" label="短信校验" :formatter="translate"></el-table-column>
        <el-table-column prop="hourTimes" label="校验次数(小时)"></el-table-column>
        <el-table-column prop="dayTimes" label="校验次数(天)"></el-table-column>
        <el-table-column  prop="createTime" label="更新时间" :formatter="updateTime"></el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.row)" type="primary" size="mini">编辑</el-button>
            <el-button @click="handleDelete(scope.row.id)" type="warning" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="mt10" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10,20,30]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog title="温馨提示" :visible.sync="dialogVisible" width="30%">
      <span>确认删除吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="comfirm">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="popupTitle" :visible.sync="dialogFormVisible">
      <el-form :inline="true" :model="formAddEdit" :rules="formAddEditRules" ref="formAddEdit">
        <el-form-item label="渠道名称" :label-width="formLabelWidth" prop="channelCode">
          <el-select :disabled="addEditFlag === 'edit'" @change="channelCodeChange" v-model="formAddEdit.channelName" auto-complete="off" filterable>
            <el-option v-for="item in $store.state.globalData.channels" :key="item.channelCode" :label="item.channelName" :value="item.channelName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="渠道编码" :label-width="formLabelWidth" prop="channelName">
          <el-input disabled v-model="formAddEdit.channelCode" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="商户编码" :label-width="formLabelWidth" prop="merchantCode">
          <el-select :disabled="addEditFlag === 'edit'" v-model="formAddEdit.merchantCode" auto-complete="off">
            <el-option v-for="(item, index) in merchantCodeList" :key="index" :value="item.channelCode"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品编码" :label-width="formLabelWidth" prop="prodCode">
          <el-input :disabled="addEditFlag === 'edit'" v-model="formAddEdit.prodCode" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="产品名称" :label-width="formLabelWidth" prop="prodName">
          <el-input :disabled="addEditFlag === 'edit'" v-model="formAddEdit.prodName" auto-complete="off"></el-input>
        </el-form-item>
        <br />
        <el-form-item label="短信校验" :label-width="formLabelWidth" prop="messageCheckType">
          <el-select v-model="formAddEdit.messageCheckType">
            <el-option label="贷款申请" value="LOAN_APPLY"></el-option>
            <el-option label="提现确认" value="LOAN_ADVANCE"></el-option>
          </el-select>
        </el-form-item>
        <div>短信配置</div>
        <el-form-item label="每小时" :label-width="formLabelWidth" prop="hourTimes">
          <el-input v-model="formAddEdit.hourTimes" type="number" max="10" min="1" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="每天" :label-width="formLabelWidth" prop="dayTimes">
          <el-input v-model="formAddEdit.dayTimes" type="number" max="10" min="1" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="save">保存</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { messageControlQry, messageControlInsert, messageControlDelete, messageControlUpdate, getChannelInfo, getChannelMerchantCodes } from '@/api/channelmgmt'
import { hasCalendarMonth, hasCalendarWeek } from '@/utils'
import _ from 'lodash'
export default {
  name: 'MerchantCfg',
  data() {
    const validateHourTimes = (rule, value, callback) => {
      if (value <= 0 || value > 10) {
        callback(new Error('每小时短信校验次数为1-10'))
      } else {
        callback()
      }
    }
    const validateDayTimes = (rule, value, callback) => {
      if (value <= 0 || value > 20) {
        callback(new Error('每天短信校验次数为1-20'))
      } else if (Number(value) < this.formAddEdit.hourTimes) {
        callback(new Error('每小时校验次数不能大于每天校验次数'))
      } else {
        callback()
      }
    }
    return {
      formQry: {
        channelCode: '',
        prodCode: '',
        status: '',
        channelName: '',
        prodName: ''
      },
      formAddEdit: {
        id: '',
        channelCode: '',
        channelName: '',
        merchantCode: '',
        prodCode: '',
        prodName: '',
        messageCheckType: 'LOAN_APPLY',
        hourTimes: 0,
        dayTimes: 0
      },
      formAddEditRules: {
        channelCode: [{ required: true, message: '请选择渠道名称', trigger: 'change' }],
        merchantCode: [{ required: true, message: '请选择商户编码', trigger: 'change' }],
        prodCode: [{ required: true, message: '请输入产品编码', trigger: 'blur' }],
        prodName: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
        messageCheckType: [{ required: true, message: '请输入控制类型', trigger: 'change' }],
        hourTimes: [{ required: true, validator: validateHourTimes, trigger: 'blur' }],
        dayTimes: [{ required: true, validator: validateDayTimes, trigger: 'blur' }]
      },
      stripe: true,
      dialogVisible: false,
      dialogFormVisible: false,
      formLabelWidth: '120',
      tableData: [],
      id: '',
      total: 0,
      pageSize: 10,
      pageNum: 1,
      merchantCodeList: [],
      addEditFlag: '',
      popupTitle: '新增'
    }
  },
  created() {
    this.query(this.pageSize, this.pageNum)
  },
  methods: {
    add() {
      this.popupTitle = '新增'
      this.dialogFormVisible = true
      this.addEditFlag = 'add'
      for (const p in this.formAddEdit) {
        this.formAddEdit[p] = ''
      }
    },
    save() {
      this.$refs.formAddEdit.validate(valid => {
        console.log(valid)
        if (valid) {
          if (this.addEditFlag === 'add') {
            messageControlInsert(this.formAddEdit).then((response) => {
              console.log(response.data)
              this.dialogFormVisible = false
              this.query(this.pageSize, this.pageNum)
            }).catch(error => {
              console.log(error)
            })
          } else if (this.addEditFlag === 'edit') {
            messageControlUpdate(this.formAddEdit).then((response) => {
              console.log(response.data)
              this.dialogFormVisible = false
              this.query(this.pageSize, this.pageNum)
            }).catch(error => {
              console.log(error)
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    query(pageSize, pageNum) {
      const params = Object.assign({
        pageSize, pageNum
      }, this.formQry)
      messageControlQry(params).then((response) => {
        console.log(response.data)
        if (response.data) {
          this.tableData = response.data.rows
          this.total = response.data.total
        }
      }).catch(error => {
        console.log(error)
      })
    },
    handleEdit(row) {
      this.popupTitle = '编辑'
      Object.assign(this.formAddEdit, row)
      this.dialogFormVisible = true
      this.addEditFlag = 'edit'
    },
    handleDelete(id) {
      this.dialogVisible = true
      this.id = id
    },
    comfirm() {
      messageControlDelete(this.id).then((response) => {
        console.log(response.data)
        this.dialogVisible = false
        this.query(this.pageSize, this.pageNum)
      }).catch(error => {
        console.log(error)
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.query(this.pageSize, this.pageNum)
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.query(this.pageSize, this.pageNum)
    },
    controlTypeChange(value) {
      const beginTime = new Date(this.formAddEdit.beginTime)
      const endTime = new Date(this.formAddEdit.endTime)
      if (this.formAddEdit.beginTime && this.formAddEdit.endTime) {
        if (!hasCalendarMonth(beginTime, endTime) && value === 'M') {
          this.formAddEdit.controlType = ''
          this.$message({
            message: '有效日期不包含自然月，无法选择此项',
            type: 'error'
          })
        }
        if (!hasCalendarWeek(beginTime, endTime) && value === 'W') {
          this.formAddEdit.controlType = ''
          this.$message({
            message: '有效日期不包含自然周，无法选择此项',
            type: 'error'
          })
        }
        if (this.formAddEdit.longTermFlag === 'Y' && value === 'E') {
          this.formAddEdit.controlType = ''
          this.$message({
            message: '有效日期长期有效，无法选择此项',
            type: 'error'
          })
        }
      }
    },
    channelCodeChange(value) {
      const item = _.find(this.$store.state.globalData.channels, { channelName: value })
      this.formAddEdit.channelCode = item.channelCode
      getChannelMerchantCodes({ channelCode: item.channelCode }).then((response) => {
        this.merchantCodeList = response.data
        this.formAddEdit.merchantCode = ''
      }).catch(error => {
        console.log(error)
      })
    },
    translate(row, column, cellValue, index) {
      if (cellValue === 'LOAN_APPLY') {
        return '贷款申请'
      } else if (cellValue === 'LOAN_ADVANCE') {
        return '提现确认'
      }
    },
    updateTime(row, column, cellValue, index) {
      if (row.editTime) {
        return row.editTime
      }
      return cellValue
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-input {
  width: 150px;
}
</style>
