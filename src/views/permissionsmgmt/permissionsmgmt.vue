<template>
  <div class="app-container">
    <el-button type="primary" @click="manualSycn" v-if="hasPerm('manualSyncRole')">手动同步角色</el-button>
    <el-table ref="multipleTable" :data="tableData" border :stripe="stripe" style="width: 100%">
      <el-table-column label="编号" width="50" type="index"></el-table-column>
      <el-table-column prop="roleName" label="角色" width></el-table-column>
      <!-- <el-table-column prop="roleCode" label="角色ID" width></el-table-column>
      <el-table-column prop="updateTime" label="更新时间" width></el-table-column>-->
      <el-table-column label="操作" width>
        <template slot-scope="scope" class="control">
          <div
            class="control-item edit-text"
            @click="handleEdit(scope.row.id)"
            v-if="hasPerm('saveMenuPrivilege')"
          >
            <img src="../../assets/edit.png" class="edit-icon" />
            <span>编辑</span>
          </div>
          <div
            class="control-item detail-text"
            @click="handleDetail(scope.row.id)"
            v-if="hasPerm('saveMenuPrivilege')"
          >
            <img src="../../assets/search.png" class="edit-icon" />
            <span>详情</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="mt10"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="rows"
      :current-page.sync="page"
      layout="total,sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <el-dialog :visible.sync="editDialogVisible" width="80%">
      <h3>权限设置</h3>
      <!-- <span>超级管理员权限列表</span> -->
      <div>
        <el-tree
          :data="data"
          show-checkbox
          default-expand-all
          node-key="id"
          ref="tree"
          highlight-current
          :props="defaultProps"
          :default-checked-keys="checkKeys"
          :render-content="renderTreeCont"
        ></el-tree>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="update(rowId)">保存</el-button>
        <el-button @click="editDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="detailDialogVisible" width="80%">
      <h3>权限设置</h3>
      <!-- <span>超级管理员权限列表</span> -->
      <div>
        <el-tree
          :data="data"
          default-expand-all
          node-key="id"
          ref="tree2"
          highlight-current
          :props="defaultProps"
          :render-content="renderTreeCont"
          :filter-node-method="filterNode"
        ></el-tree>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  findRole,
  query,
  update,
  getMenuPrivilegeList,
  saveMenuPrivilege,
  manualSycn
} from "@/api/permissionsmgmt";
//import { asyncRouterMap } from "@/router/index";
import { filterMenu } from "@/store/modules/permission";
import { deepCopy } from "@/utils";

export default {
  name: "permissionsmgmt",
  data() {
    return {
      tableData: [],
      checked: "",
      stripe: true,
      editDialogVisible: false,
      detailDialogVisible: false,
      data: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      rowId: "",
      checkKeys: [],

      total: 0,
      rows: 10,
      page: 1
    };
  },
  components: {},
  computed: {},
  beforeMount() {},
  async mounted() {
    this.query(this.rows, this.page);
  },
  methods: {
    async query(rows, page) {
      this.page = page;
      let params = {
        rows,
        page
      };
      const res = await findRole(params);
      if (res) {
        this.tableData = res.resData.list;
        this.total = res.resData.total;
      }
    },
    handleSizeChange(val) {
      this.rows = val;
      this.query(this.rows, this.page);
    },
    handleCurrentChange(val) {
      this.page = val;
      this.query(this.rows, this.page);
    },
    getTreeData(data) {
      let arr = [];
      for (var i = 0; i < data.length; i++) {
        let item = data[i];
        if (item.flag === 1) {
          arr.push(item.id);
        }
        for (var j = 0; j < item.children.length; j++) {
          let item2 = item.children[j];
          if (item2.type === 0) {
            item2.id = `${item.id}_${item2.id}`;
          }
          if (item2.flag === 1) {
            arr.push(item2.id);
          }
          for (let k in item2.children) {
            let item3 = item2.children[k];
            if (item3.type === 0) {
              item3.id = `${item2.id}_${item3.id}`;
            }
            if (item3.flag === 1) {
              arr.push(item3.id);
            }
          }
        }
      }
      var newArr = [];
      var item = "";
      arr.forEach(item => {
        checked(item, data, newArr);
      });
      console.log(arr);
      console.log(newArr);

      function checked(id, data, newArr) {
        data.forEach(item => {
          if (item.id == id) {
            if (item.children == undefined) {
              newArr.push(item.id);
            }
          } else {
            if (item.children && item.children.length != 0) {
              checked(id, item.children, newArr);
            }
          }
        });
      }
      return newArr;
    },
    async getPermissionsList(id, showCheck) {
      let params = {
        id
      };
      const res = await getMenuPrivilegeList(params);

      if (res.resData) {
        this.data = res.resData;
        //console.log(JSON.stringify(res.resData))

        if (showCheck) {
          this.editDialogVisible = true;
          let treeCheck = this.getTreeData(this.data);
          this.$nextTick(() => {
            this.$refs.tree.setCheckedKeys(treeCheck);
          });
        } else {
          this.detailDialogVisible = true;
          this.$nextTick(() => {
            this.$refs.tree2.filter();
          });
        }
      }
    },
    handleEdit(id) {
      this.rowId = id;
      this.getPermissionsList(id, true);
    },
    toTreeData(router) {
      const parent = [];
      for (let i = 0; i < router.length; i++) {
        const obj = {
          id: i,
          label: router[i].name,
          children: []
        };
        for (let j = 0; j < router[i].children.length; j++) {
          if (!router[i].children[j].hidden) {
            const child = {
              id: router[i].children[j].id,
              label: router[i].children[j].name
            };
            obj.children.push(child);
          }
        }
        parent.push(obj);
      }
      return parent;
    },
    handleDetail(id) {
      this.getPermissionsList(id, false);
    },
    // 根据编辑中选中的键查找值
    searchFromData(id) {
      const selectNode = [];
      for (let i = 0; i < this.data.length; i++) {
        if (this.data[i].id === id) {
          return { id: this.data[i].id, name: this.data[i].label };
        }
        if (this.data[i].children) {
          for (let j = 0; j < this.data[i].children.length; j++) {
            if (this.data[i].children[j].id === id) {
              return {
                id: this.data[i].children[j].id,
                name: this.data[i].children[j].label
              };
            }
          }
        }
      }
    },
    async update(id) {
      // 选中节点的key组成的数组
      let selectData1 = this.$refs.tree.getCheckedKeys();
      let selectData2 = this.$refs.tree.getHalfCheckedKeys();
      this.$nextTick(() => {
        let selectData = [...selectData1, ...selectData2];
        console.log(selectData1, selectData2);
        console.log(selectData);

        let menuIds = selectData.filter(
          item => typeof item === "number" && !isNaN(item)
        );
        let _privilegeIds = selectData.filter(
          item => typeof item === "string" && item.indexOf("_") > -1
        );
        let privilegeIds = _privilegeIds.map(item =>
          Number(item.split("_")[1])
        );
        let params = {
          id,
          menuIds: menuIds.join(),
          privilegeIds: privilegeIds.join()
        };
        console.log(params);
        //return false;

        saveMenuPrivilege(params).then(res => {
          if (res) {
            this.editDialogVisible = false;
            this.$message({
              type: "success",
              message: "编辑成功！"
            });
          }
        });
        //const res = await saveMenuPrivilege(params);
      });
    },
    renderTreeCont(h, { node, data, store }) {
      // return (
      //   <span>{data.id}  {data.text}   flag:{data.flag} type:{data.type}</span>
      // )
      return <span>{data.text}</span>;
    },
    manualSycn() {
      manualSycn()
        .then(res => {
          if (res) {
            this.$message({
              type: "success",
              message: "同步成功！"
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    filterNode(value, data, node) {
      console.log(value, data);
      return data.flag === 1;
    }
  }
};
</script>
<style scoped>
.edit-icon {
  width: 18px;
  height: 18px;
  margin-right: 5px;
}
.el-table .cell {
  display: flex;
  flex-direction: row;
}
.control {
  display: flex;
  flex-direction: row;
}
.detail-text {
  color: #e6a23c;
}
.edit-text {
  color: #409eff;
}
.control-item {
  margin-right: 14px;
  display: inline-block;
  width: 55px;
  height: 18px;
  line-height: 18px;
}
</style>