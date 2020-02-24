<template>
  <div class="table-container wrap">
    <div style="width: 45%;display:inline-block;">
      <div class="table-toolbar">
        <el-button type="primary" @click="add('key-value-type')">新增</el-button>
      </div>
      <el-table ref="multipleTable" :data="tableData" border :stripe="stripe" style="width: 100%;">
        <el-table-column prop="enumTypeName" label="类型">
        </el-table-column>
        <el-table-column prop="enumTypeDesc" label="描述">
        </el-table-column>
        <el-table-column label="操作" align="center" width="270" fixed="right">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.row, 'key-value-type')" type="primary" size="mini">编辑</el-button>
            <el-button @click="handleDelete(scope.row.id, 'key-value-type')" type="primary" size="mini">删除</el-button>
            <el-button @click="check(scope.row.enumTypeName)" type="primary" size="mini">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="width: 45%;display:inline-block">
      <div class="table-toolbar">
        <el-button type="primary" @click="add('key-value-list')">新增</el-button>
        <span v-if="enumTypeName" style="margin-left:30px;">类型：{{enumTypeName}}</span>
      </div>
      <el-table ref="multipleTable" :data="keyValueTableData" border :stripe="stripe" style="width: 100%;">
        <el-table-column prop="enumKey" label="key">
        </el-table-column>
        <el-table-column prop="enumValue" label="value">
        </el-table-column>
        <el-table-column prop="enumDesc" label="Desc">
        </el-table-column>
        <el-table-column label="操作" align="center" width="270" fixed="right">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.row, 'key-value-list')" type="primary" size="mini">编辑</el-button>
            <el-button @click="handleDelete(scope.row.id, 'key-value-list')" type="primary" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :visible.sync="dialogVisible">
      <el-form v-if="dialogType === 'key-value-type'" :inline="true" :model="formAddEdit" :rules="formAddEditRules" ref="formAddEdit">
        <el-form-item label="类型" :label-width="formLabelWidth" prop="enumTypeName">
          <el-input v-model="formAddEdit.enumTypeName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth" prop="enumTypeDesc">
          <el-input v-model="formAddEdit.enumTypeDesc" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <el-form v-if="dialogType === 'key-value-list'" :inline="true" :model="formAddEditForKeyValue" :rules="formAddEditForKeyValueRules" ref="formAddEditForKeyValue">
        <el-form-item label="key" :label-width="formLabelWidth" prop="enumKey">
          <el-input v-model="formAddEditForKeyValue.enumKey" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="value" :label-width="formLabelWidth" prop="enumValue">
          <el-input v-model="formAddEditForKeyValue.enumValue" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="Desc" :label-width="formLabelWidth" prop="enumDesc">
          <el-input v-model="formAddEditForKeyValue.enumDesc" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="save">保存</el-button>
        <el-button type="primary" @click="dialogVisible = false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="温馨提示" :visible.sync="confirmDialogVisible" width="30%">
      <span>确认删除吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirm">确 定</el-button>
        <el-button @click="confirmDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getTypeInfo, insertType, updateType, deleteType, getEnumByType, insertKeyValue, updateKeyValue, deleteKeyValue } from '@/api/KeyValueMgmt'
import { Message } from 'element-ui'
export default {
  name: 'KeyValueMgmt',
  data() {
    return {
      stripe: true,
      formLabelWidth: '120',
      tableData: [],
      keyValueTableData: [],
      formAddEdit: {
        enumTypeName: '',
        enumTypeDesc: ''

      },
      formAddEditRules: {
        enumTypeName: [{ required: true, message: '请输入类型值', trigger: 'blur' }],
        enumTypeDesc: [{ required: true, message: '请输入类型描述', trigger: 'blur' }]

      },
      formAddEditForKeyValue: {
        enumKey: '',
        enumValue: '',
        enumDesc: ''
      },
      formAddEditForKeyValueRules: {
        enumKey: [{ required: true, message: '请输入类型值', trigger: 'blur' }],
        enumValue: [{ required: true, message: '请输入类型描述', trigger: 'blur' }]
      },
      dialogVisible: false,
      confirmDialogVisible: false,
      dialogType: '',
      id: '',
      keyValueId: '',
      enumTypeName: ''
    }
  },
  created() {
    this.query()
  },
  methods: {
    query() {
      getTypeInfo().then(res => {
        this.tableData = res.data
      }).catch(res => {
        console.log(res)
      })
    },
    add(type) {
      if (type === 'key-value-type') {
        this.formAddEdit.enumTypeName = ''
        this.formAddEdit.enumTypeDesc = ''
      } else if (type === 'key-value-list') {
        this.formAddEditForKeyValue.enumKey = ''
        this.formAddEditForKeyValue.enumValue = ''
        this.formAddEditForKeyValue.enumDesc = ''
        if (!this.enumTypeName) {
          Message({
            message: '请选择一个类型',
            type: 'warning',
            duration: 3 * 1000
          })
          return
        }
      }
      this.dialogVisible = true
      this.addEditFlag = 'add'
      this.dialogType = type
    },
    handleEdit(row, type) {
      this.dialogType = type
      if (type === 'key-value-type') {
        this.id = row.id
        this.formAddEdit.enumTypeName = row.enumTypeName
        this.formAddEdit.enumTypeDesc = row.enumTypeDesc
      } else if (type === 'key-value-list') {
        this.keyValueId = row.id
        this.enumTypeId = row.enumTypeId
        this.formAddEditForKeyValue.enumKey = row.enumKey
        this.formAddEditForKeyValue.enumValue = row.enumValue
        this.formAddEditForKeyValue.enumDesc = row.enumDesc
      }
      this.dialogVisible = true
      this.addEditFlag = 'edit'
    },
    handleDelete(id, type) {
      this.dialogType = type
      if (type === 'key-value-type') {
        this.id = id
      } else if (type === 'key-value-list') {
        this.keyValueId = id
      }
      this.confirmDialogVisible = true
    },
    save() {
      if (this.dialogType === 'key-value-type') {
        this.$refs.formAddEdit.validate(valid => {
          if (valid) {
            if (this.addEditFlag === 'add') {
              insertType(this.formAddEdit).then((response) => {
                this.dialogVisible = false
                this.query()
              }).catch(error => {
                console.log(error)
              })
            } else if (this.addEditFlag === 'edit') {
              const params = Object.assign({ id: this.id }, this.formAddEdit)
              updateType(params).then((response) => {
                this.dialogVisible = false
                this.query()
              }).catch(error => {
                console.log(error)
              })
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      } else if (this.dialogType === 'key-value-list') {
        this.$refs.formAddEditForKeyValue.validate(valid => {
          if (valid) {
            if (this.addEditFlag === 'add') {
              const params = Object.assign({ enumTypeName: this.enumTypeName }, this.formAddEditForKeyValue)
              insertKeyValue(params).then((response) => {
                this.dialogVisible = false
                this.check(this.enumTypeName)
              }).catch(error => {
                console.log(error)
              })
            } else if (this.addEditFlag === 'edit') {
              const params = Object.assign({ id: this.keyValueId, enumTypeId: this.enumTypeId, enumTypeName: this.enumTypeName }, this.formAddEditForKeyValue)
              updateKeyValue(params).then((response) => {
                this.dialogVisible = false
                this.check(this.enumTypeName)
              }).catch(error => {
                console.log(error)
              })
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    },
    confirm() {
      if (this.dialogType === 'key-value-type') {
        deleteType(this.id).then((response) => {
          this.confirmDialogVisible = false
          this.query()
        }).catch(error => {
          console.log(error)
        })
      } else if (this.dialogType === 'key-value-list') {
        deleteKeyValue(this.keyValueId).then((response) => {
          this.confirmDialogVisible = false
          this.check(this.enumTypeName)
        }).catch(error => {
          console.log(error)
        })
      }
    },
    check(enumTypeName) {
      this.enumTypeName = enumTypeName
      getEnumByType(enumTypeName).then((response) => {
        this.keyValueTableData = response.data
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>
<style scoped>
.wrap {
  display: flex;
  justify-content: space-between;
}
</style>