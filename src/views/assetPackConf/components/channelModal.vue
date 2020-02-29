<template>
  <div>
    <!-- <el-form>
      <el-form-item label="渠道号" prop="channelCode">
          <el-input v-model="formAddEdit.channelCode"></el-input>
      </el-form-item>
    </el-form>-->
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
        node-key="channelCode"
        :expand-on-click-node="false"
        :default-expand-all="true"
        :props="defaultProps"
        :render-content="renderTreeCont"
        :filter-node-method="filterNode"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirm">确定</el-button>
        <el-button @click="visible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from "vuex";
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
      //channel:[],
      checkList: [],
      searchForm: ""
    };
  },
  computed: {
    ...mapState({
      channel: state => state.globalData.channel
    })
  },
  mounted() {},
  methods: {
    search() {
      let list = this.channel.filter(
        item =>
          item.channelCode.indexOf(this.searchForm) > -1 ||
          item.channelName.indexOf(this.searchForm) > -1
      );
      console.log(list);
      this.data = [
        {
          key: "0",
          channelName: "全选",
          children: list
        }
      ];
      this.$nextTick(() => {
        this.list.length &&
          this.$refs.tree.setCheckedKeys(this.list.split(","));
      });
    },
    edit(record) {
      this.$store.dispatch("getChannel"); //获取所有进件渠道
      //this.channel = [...this.$store.state.globalData.channel];
      this.data = [
        {
          key: "0",
          channelName: "全选",
          children: this.channel
        }
      ];
      this.searchForm = "";
      this.visible = true;
      this.$nextTick(() => {
        this.list.length &&
          this.$refs.tree.setCheckedKeys(this.list.split(","));
      });
    },
    confirm() {
      let list = this.$refs.tree.getCheckedNodes(true);
      let values = list.map(item => item.channelCode);
      let labels = list.map(item => item.channelCode + item.channelName);
      this.$emit("confirm", values.join(), labels.join("\n"));
      this.visible = false;
    },
    renderTreeCont(h, { node, data, store }) {
      return (
        <span>
          {data.channelCode} {data.channelName}
        </span>
      );
    },
    filterNode(value, data, node) {
      return (
        data.channelName.toLowerCase().indexOf(this.searchForm.toLowerCase()) > -1 ||
        data.channelCode.toLowerCase().indexOf(this.searchForm.toLowerCase()) > -1
      );
    }
  },
  watch: {
    "$store.state.globalData.channel": function(data) {
      this.data = [
        {
          key: "0",
          channelName: "全选",
          children: this.channel
        }
      ];
    }
  }
};
</script>