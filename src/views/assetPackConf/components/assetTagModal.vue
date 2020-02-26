<template>
  <div>
    <el-dialog title="选择" :visible.sync="visible">
      <el-form :inline="true">
        <el-form-item>
          <el-input v-model="searchForm"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
      <el-tree
        ref="tree"
        :data="data"
        show-checkbox
        node-key="caseLabel"
        :expand-on-click-node="false"
        :default-expand-all="true"
        :props="defaultProps"
        :render-content="renderTreeCont"
      ></el-tree>
      
        <!-- node-key="caseLabel" -->
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirm">确定</el-button>
        <el-button @click="visible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  props: {
    list: {
      default: [],
      type: String
    }
  },
  data() {
    return {
      visible: false,
      data: [],
      defaultProps: {
        label: "label",
        children: "children"
      },
      checkList: [],
      searchForm:''
    };
  },
  computed:{
    ...mapState({
      assetTag: state => state.globalData.assetTag
    })
  },
  mounted() {
    
  },
  methods: {
    search(){
      let list = this.assetTag.filter(item => item.caseLabel.indexOf(this.searchForm) > -1)
      console.log(list)
      this.data = [{
        key: "0",
        caseLabel: "全选",
        children: list
      }]
      this.$nextTick(() => {
        this.list.length && this.$refs.tree.setCheckedKeys(this.list.split(","));
      });
    },
    edit(record) {
      this.$store.dispatch('getAssetTag') //获取标签
      this.data = [{
        key: "0",
        caseLabel: "全选",
        children: this.assetTag
      }]
      this.searchForm = '';
      this.visible = true;
      this.$nextTick(() => {
        console.log(this.list)
        this.list.length && this.$refs.tree.setCheckedKeys(this.list.split(","));
      });
    },
    confirm() {
      //let list = this.$refs.tree.getCheckedKeys(true);
      let list = this.$refs.tree.getCheckedNodes(true);
      let labels = list.map(item => item.caseLabel)
      this.$emit("confirm", labels.join());
      this.visible = false;
    },
    renderTreeCont(h, {node, data, store}){
      return (
        <span>{data.caseLabel}</span>
      )
    }
  }
};
</script>