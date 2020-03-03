<template>
  <div class="app-container">
    <div class="table-container">
      <div class="table-toolbar">
        <el-button type="primary" @click="add" v-if="hasPerm('addChannel')">新增</el-button>
      </div>
      <el-table ref="multipleTable" :data="channel.slice((page-1)*rows,page*rows)" border>
        <el-table-column label="序号" width="50" type="index"></el-table-column>
        <el-table-column prop="channelCode" label="渠道号"></el-table-column>
        <el-table-column prop="channelName" label="渠道名称"></el-table-column>
        <el-table-column prop="paymentType" label="操作" fixed="right" width="80">
          <template slot-scope="scope">
            <el-button
              @click="edit(scope.row)"
              size="small"
              type="warning"
              v-if="hasPerm('addChannel')"
            >编辑</el-button>
            <!-- <el-button
              @click="del(scope.row)"
              size="small"
              type="danger"
              v-if="hasPerm('deleteChannel')"
            >删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="mt10"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="rows"
        layout="total,sizes, prev, pager, next, jumper"
        :total="channel.length"
      ></el-pagination>
    </div>
    <channel-modal ref="channelModal" @confirm="confirm"></channel-modal>
  </div>
</template>
<script>
import { mapState } from "vuex";
import channelModal from "./components/channelModal";
import { deleteChannel } from "@/api/channel";
export default {
  name: "channelMgmt",
  components: {
    channelModal
  },
  data() {
    return {
      show: true,
      tableData: [],
      total: 0,
      rows: 10,
      page: 1
    };
  },
  created() {
    this.$store.dispatch("getChannel"); //获取所有进件渠道
  },
  mounted() {
    //this.tableData = this.$store.state.globalData.product
    //console.log(this.tableData)
  },
  computed: {
    ...mapState({
      channel: state => state.globalData.channel
    })
  },
  methods: {
    query() {},
    handleSizeChange(val) {
      this.rows = val;
      //this.query(this.rows, this.page);
    },
    handleCurrentChange(val) {
      this.page = val;
      //this.query(this.rows, this.page);
    },
    add() {
      this.$refs.channelModal.edit();
    },
    edit(row) {
      console.log(row);
      this.$refs.channelModal.edit(row);
    },
    itemDel(params) {
      deleteChannel(params)
        .then(res => {
          if (res) {
            this.$store.dispatch("getChannel");
            this.$message({
              type: "success",
              message: "删除成功！"
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    del(row) {
      console.log(row);
      this.$confirm("是否确认删除？", "提示", {
        type: "warning"
      }).then(() => {
        let params = {
          id: row.id
        };
        this.itemDel(params);
      });
    },
    confirm(data) {
      console.log(data);
      this.$store.dispatch("getChannel");
    }
  }
};
</script>
