<template>
  <div class="app-container">
    <el-form :inline="true" :model="formQry">
      <el-form-item label="渠道编码:">
        <el-input v-model="formQry.channelCode"></el-input>
      </el-form-item>
      <el-form-item label="渠道名称: ">
        <el-input v-model="formQry.channelName"></el-input>
      </el-form-item>
      <el-form-item label="渠道状态:">
        <el-select v-model="formQry.channelState">
          <el-option v-for="item in statusList" :label="item.name" :value="item.value" :key="item.value"></el-option>
        </el-select>
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
        <el-table-column type="expand" label="详情" width="50">
          <template slot-scope="props">
            <el-form label-position="left" inline>
              <el-form-item  label="回调地址：">
                <span>{{props.row.replyUrl}}</span>
              </el-form-item>
              <el-form-item label="加密参数：" style="word-break:break-word">
                <span>{{props.row.encryptParam}}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="序号"></el-table-column>
        <el-table-column prop="channelCode" label="渠道编号"></el-table-column>
        <el-table-column prop="channelName" label="渠道名称"></el-table-column>
        <el-table-column prop="channelState" label="渠道状态" :formatter="translate"></el-table-column>
        <!-- <el-table-column prop="replyUrl" label="回调地址"></el-table-column> -->
        <el-table-column prop="encryptMethod" label="加密方式" :formatter="encryptMethodTranslate"></el-table-column>
        <!-- <el-table-column prop="encryptParam" label="加密参数"></el-table-column> -->
        <el-table-column prop="createTime" label="新增时间"></el-table-column>
        <el-table-column prop="channelType" label="渠道属性" :formatter="channelTypeTranslate"></el-table-column>
        <!-- <el-table-column prop="updateTime" label="更新时间"></el-table-column> -->
        <el-table-column label="操作" align="center" width="270" fixed="right">
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
        <el-button type="primary" @click="confirm">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="编辑" :visible.sync="dialogFormVisible">
      <el-form :inline="true" :model="formAddEdit" :rules="formAddEditRules" ref="formAddEdit">
        <el-form-item label="渠道编码" :label-width="formLabelWidth" prop="channelCode">
          <el-input v-model="formAddEdit.channelCode" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="渠道状态" :label-width="formLabelWidth" prop="channelState">
          <el-select v-model="formAddEdit.channelState" >
            <el-option label="全部" value=""></el-option>
            <el-option v-for="item in statusList" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="渠道名称" :label-width="formLabelWidth" prop="channelName">
          <el-input v-model="formAddEdit.channelName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="渠道回调地址" :label-width="formLabelWidth" prop="replyUrl">
          <el-input v-model="formAddEdit.replyUrl" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="加密方式" :label-width="formLabelWidth" prop="encryptMethod">
          <el-select v-model="formAddEdit.encryptMethod" >
            <el-option v-for="item in encryptMethods" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="加密参数" :label-width="formLabelWidth" prop="encryptParam">
          <el-input v-model="formAddEdit.encryptParam" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="渠道属性" :label-width="formLabelWidth" prop="channelType">
          <el-select v-model="formAddEdit.channelType" >
            <el-option v-for="item in ChannelTypeEnumList" :key="item.value" :label="item.name" :value="item.value"></el-option>
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
import { channelQuery, channelInsert, channelUpdate, channelDelete, getChannelTypes } from '@/api/channelmgmt'
import { optionsQuery } from '@/api/common'
import _ from 'lodash'
export default {
  name: 'ChannelCfg',
  data() {
    return {
      formQry: {
        channelCode: '',
        channelName: '',
        channelState: ''
      },
      formAddEdit: {
        channelCode: '',
        channelName: '',
        channelState: '',
        replyUrl: '',
        encryptMethod: '',
        encryptParam: '',
        channelType: '',
        createTime: ''
      },
      formAddEditRules: {
        channelCode: [{ required: true, message: '请输入渠道编码', trigger: 'blur' }],
        channelName: [{ required: true, message: '请输入渠道名称', trigger: 'blur' }],
        channelState: [{ required: true, message: '请输入渠道状态', trigger: 'blur' }],
        replyUrl: [{ required: true, message: '请输入渠道回调地址', trigger: 'blur' }],
        encryptMethod: [{ required: true, message: '请输入加密方式', trigger: 'blur' }],
        encryptParam: [{ required: true, message: '请输入加密参数', trigger: 'blur' }],
        channelType: [{ required: true, message: '请选择渠道属性', trigger: 'blur' }]
      },
      stripe: true,
      dialogVisible: false,
      dialogFormVisible: false,
      formLabelWidth: '120',
      tableData: [],
      addEditFlag: '',
      encryptMethods: [],
      statusList: [],
      ChannelTypeEnumList: [],
      id: '', // 主键id
      total: 0,
      pageSize: 10,
      pageNum: 1
    }
  },
  created() {
    this.query(this.pageSize, this.pageNum)
    optionsQuery('encrypt_method').then(response => {
      this.encryptMethods = response.data
    })
    optionsQuery('channel_status').then(response => {
      this.statusList = response.data
    })
    getChannelTypes().then(res => {
      this.ChannelTypeEnumList = res.data
    }).catch(err => {
      console.log(err)
    })
  },
  methods: {
    add() {
      this.dialogFormVisible = true
      this.addEditFlag = 'add'
    },
    save() {
      this.$refs.formAddEdit.validate(valid => {
        console.log(valid)
        if (valid) {
          if (this.addEditFlag === 'add') {
            channelInsert(this.formAddEdit).then((response) => {
              console.log(response.data)
              this.dialogFormVisible = false
              this.query(this.pageSize, this.pageNum)
              this.$store.dispatch('getChannelInfo')
            }).catch(error => {
              console.log(error)
            })
          } else if (this.addEditFlag === 'edit') {
            const params = Object.assign({ id: this.id }, this.formAddEdit)
            channelUpdate(params).then((response) => {
              console.log(response.data)
              this.dialogFormVisible = false
              this.query(this.pageSize, this.pageNum)
              this.$store.dispatch('getChannelInfo')
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
      channelQuery(params).then((response) => {
        console.log(response.data)
        if (response.data) {
          this.total = response.data.total
          this.tableData = response.data.rows
        }
      }).catch(error => {
        console.log(error)
      })
    },
    handleEdit(row) {
      this.id = row.id
      this.dialogFormVisible = true
      this.addEditFlag = 'edit'
      this.formAddEdit.channelCode = row.channelCode
      this.formAddEdit.channelName = row.channelName
      this.formAddEdit.channelState = row.channelState
      this.formAddEdit.replyUrl = row.replyUrl
      this.formAddEdit.encryptMethod = row.encryptMethod
      this.formAddEdit.encryptParam = row.encryptParam
      this.formAddEdit.channelType = row.channelType ? Number(row.channelType) : row.channelType
    },
    handleDelete(id) {
      this.dialogVisible = true
      this.id = id
    },
    confirm() {
      channelDelete(this.id).then((response) => {
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
    cellClass({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 6) {
        return 'cellClass'
      }
    },
    copy(row) {
      console.log(row)
      const input = document.createElement('input')
      document.body.appendChild(input)
      input.setAttribute('value', row.encryptParam)
      input.select()
      if (document.execCommand('copy')) {
        document.execCommand('copy')
        console.log('复制成功')
        this.$message({
          message: '复制到粘贴板',
          type: 'success'
        })
      }
      document.body.removeChild(input)
    },
    translate(row, column, cellValue, index) {
      if (cellValue === 1) {
        return '启用'
      } else if (cellValue === 0) {
        return '停用'
      }
    },
    encryptMethodTranslate(row, column, cellValue, index) {
      const item = _.find(this.encryptMethods, { value: cellValue })
      if (item) {
        return item.name
      }
      return cellValue
    },
    channelTypeTranslate(row, column, cellValue, index) {
      const item = _.find(this.ChannelTypeEnumList, { value: cellValue && Number(cellValue) })
      if (item) {
        return item.name
      }
      return cellValue
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.cellClass > div {
  height: 100px;
}
</style>
