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
      <el-form-item label="状态: ">
        <el-select v-model="formQry.status">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="(item, index) in statusList" :key="index" :label="item.name" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <br>
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
        <el-table-column prop="id" label="序号"></el-table-column>
        <el-table-column prop="channelCode" label="渠道编码"></el-table-column>
        <el-table-column prop="channelName" label="渠道名称"></el-table-column>
        <el-table-column prop="prodCode" label="产品编码"></el-table-column>
        <el-table-column prop="prodName" label="产品名称"></el-table-column>
        <el-table-column prop="quantity" label="进件数量"></el-table-column>
        <el-table-column prop="status" label="状态" :formatter="translate"></el-table-column>
        <el-table-column prop="merchantCode" label="有效日期">
          <template slot-scope="scope">
            <span v-if="scope.row.longTermFlag === 'Y'">长久有效</span>
            <span v-else>{{scope.row.beginTime}}至{{scope.row.endTime}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间"></el-table-column>
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
        <el-form-item :label-width="formLabelWidth" label="有效日期">
          <el-col :span="7">
            <el-date-picker :picker-options="pickerOptions" type="date" @change="beginTimeChanged" placeholder="选择日期" v-model="formAddEdit.beginTime" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
          </el-col>
          <el-col class="line" :span="2" style="text-align:center;">-</el-col>
          <el-col :span="7">
            <el-date-picker :picker-options="pickerOptions" type="date" @change="endTimeChanged" placeholder="选择日期" v-model="formAddEdit.endTime" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
          </el-col>
          <el-col :span="6" :offset="2">
            <el-radio @change="longTermFlagChange" v-model="formAddEdit.longTermFlag" label="Y">长期有效</el-radio>
          </el-col>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="进件数量:" prop="controlType">
          <el-select @change="controlTypeChange" v-model="formAddEdit.controlType">
            <el-option v-for="(item, index) in controlTypeList" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="quantity">
          <el-input style="width:100px;" type="number" v-model="formAddEdit.quantity"></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="状态:" prop="status">
          <el-select v-model="formAddEdit.status">
            <el-option v-for="(item, index) in statusList" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select>
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
import { loanControlQry, loanControlInsert, loanControlUpdate, loanControlDelete, getChannelStatus, getChannelInfo, getChannelMerchantCodes } from '@/api/channelmgmt'
import { optionsQuery } from '@/api/common'
import { hasCalendarMonth, hasCalendarWeek } from '@/utils'
import _ from 'lodash'
export default {
  name: 'ProductCfg',
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          // console.log(time)
          return time.getTime() < (Date.now() - 1000 * 60 * 60 * 24)
        }
      },
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
        beginTime: '',
        endTime: '',
        longTermFlag: 'N',
        controlType: '',
        quantity: '',
        status: ''
      },
      formAddEditRules: {
        channelCode: [{ required: true, message: '请选择渠道名称', trigger: 'change' }],
        merchantCode: [{ required: true, message: '请选择商户编码', trigger: 'change' }],
        prodCode: [{ required: true, message: '请输入产品编码', trigger: 'blur' }],
        prodName: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
        controlType: [{ required: true, message: '请输入控制类型', trigger: 'change' }],
        quantity: [{ required: true, message: '请选择进件数量', trigger: 'blur' }],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }]
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
      statusList: [],
      controlTypeList: [],
      merchantCodeList: [],
      addEditFlag: '',
      popupTitle: '新增'
    }
  },
  created() {
    this.query(this.pageSize, this.pageNum)
    getChannelStatus().then((response) => {
      this.statusList = response.data
    }).catch(error => {
      console.log(error)
    })
    optionsQuery('control_type').then(response => {
      this.controlTypeList = response.data
    })
    // getMerchantCodes().then((response) => {
    //   this.merchantCodeList = response.data
    // }).catch(error => {
    //   console.log(error)
    // })
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
      if (this.formAddEdit.longTermFlag !== 'Y' && !(this.formAddEdit.beginTime && this.formAddEdit.endTime)) {
        this.$message({
          message: '请选择进件时间',
          type: 'error'
        })
        return
      }
      this.$refs.formAddEdit.validate(valid => {
        console.log(valid)
        if (valid) {
          if (this.addEditFlag === 'add') {
            loanControlInsert(this.formAddEdit).then((response) => {
              console.log(response.data)
              this.dialogFormVisible = false
              this.query(this.pageSize, this.pageNum)
            }).catch(error => {
              console.log(error)
            })
          } else if (this.addEditFlag === 'edit') {
            loanControlUpdate(this.formAddEdit).then((response) => {
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
      loanControlQry(params).then((response) => {
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
      // loanControlQryById(row.id).then((response) => {
      //   Object.assign(this.formAddEdit, response.data)
      // })
      this.popupTitle = '编辑'
      if (row.longTermFlag === 'Y') {
        row.beginTime = ''
        row.endTime = ''
      }
      row.status = Number(row.status)
      Object.assign(this.formAddEdit, row)
      this.dialogFormVisible = true
      this.addEditFlag = 'edit'
    },
    handleDelete(id) {
      this.dialogVisible = true
      this.id = id
    },
    comfirm() {
      loanControlDelete(this.id).then((response) => {
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
    beginTimeChanged(value) {
      this.formAddEdit.longTermFlag = 'N'
      const beginTime = new Date(value)
      const endTime = new Date(this.formAddEdit.endTime)
      if (this.formAddEdit.endTime && beginTime.getTime() > endTime.getTime()) {
        this.formAddEdit.beginTime = null
        this.$message({
          message: '开始日期应小于截止日期',
          type: 'error'
        })
        return
      }
      if (value && this.formAddEdit.endTime) {
        if (!hasCalendarMonth(beginTime, endTime) && this.formAddEdit.controlType === 'M') {
          this.formAddEdit.controlType = ''
        }
        if (!hasCalendarWeek(beginTime, endTime) && this.formAddEdit.controlType === 'W') {
          this.formAddEdit.controlType = ''
        }
      }
    },
    endTimeChanged(value) {
      this.formAddEdit.longTermFlag = 'N'
      const beginTime = new Date(this.formAddEdit.beginTime)
      const endTime = new Date(value)
      if (beginTime.getTime() > endTime.getTime()) {
        this.formAddEdit.endTime = null
        this.$message({
          message: '截止日期应大于开始日期',
          type: 'error'
        })
        return
      }
      if (value && this.formAddEdit.beginTime) {
        if (!hasCalendarMonth(beginTime, endTime) && this.formAddEdit.controlType === 'M') {
          this.formAddEdit.controlType = ''
        }
        if (!hasCalendarWeek(beginTime, endTime) && this.formAddEdit.controlType === 'W') {
          this.formAddEdit.controlType = ''
        }
      }
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
    longTermFlagChange() {
      this.formAddEdit.beginTime = ''
      this.formAddEdit.endTime = ''
    },
    translate(row, column, cellValue, index) {
      if (cellValue == 1) {
        return '启用'
      } else if (cellValue == 0) {
        return '停用'
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
