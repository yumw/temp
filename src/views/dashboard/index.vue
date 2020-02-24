<template>
  <div class="dashboard-container">
    <!-- <div class="dashboard-head">
      <span>今日数据</span>
      <span>
        <div>进件总数</div>
        <div>{{firstPageData.loanSum}}</div>
      </span>
      <span>
        <div>进件客户数</div>
        <div>{{firstPageData.loanCustomNum}}</div>
      </span>
      <span>
        <div>审批通过笔数</div>
        <div>{{firstPageData.auditNum}}</div>
      </span>
      <span>
        <div>放款笔数</div>
        <div>{{firstPageData.advanceNum}}</div>
      </span>
      <span>
        <div>请求异常任务数</div>
        <div>{{firstPageData.excepRequestNum}}</div>
      </span>
      <span>
        <div>反馈异常任务数</div>
        <div>{{firstPageData.excepResponseNum}}</div>
      </span>
      <el-button type="primary" size="mini" @click="refresh">刷新</el-button>
    </div>
    <ve-line :data="lineChartData"></ve-line>

    <ve-pie style="width:600px;height:auto;" :data="pieChartData"></ve-pie>

    <div class="mask"></div>
    <div class="waitForward">建设中，敬请期待.....</div> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import VeLine from 'v-charts/lib/line.common'
import VePie from 'v-charts/lib/pie.common'
import { firstData } from '@/api/login'
export default {
  name: 'dashboard',
  computed: {
    ...mapGetters(['name', 'permission_routers'])
  },
  components: { VeLine, VePie },
  data() {
    return {
      lineChartData: {
        columns: ['日期', '中邮钱包App', '支付宝'],
        rows: [
          { '日期': '1/1', '中邮钱包App': 1393, '支付宝': 1093 },
          { '日期': '1/2', '中邮钱包App': 3530, '支付宝': 3230 },
          { '日期': '1/3', '中邮钱包App': 2923, '支付宝': 2623 },
          { '日期': '1/4', '中邮钱包App': 1723, '支付宝': 1423 },
          { '日期': '1/5', '中邮钱包App': 3792, '支付宝': 3492 },
          { '日期': '1/6', '中邮钱包App': 4593, '支付宝': 4293 }
        ]
      },
      pieChartData: {
        columns: ['渠道', '渠道进件失败量'],
        rows: [
          { '渠道': '中邮钱包App', '渠道进件失败量': 1393 },
          { '渠道': '支付宝', '渠道进件失败量': 3530 },
          { '渠道': '微信', '渠道进件失败量': 2923 }
        ]
      },
      firstPageData: {}
    }
  },
  activated() {
    firstData().then((response) => {
      this.firstPageData = response.data
    }).catch(error => {
      console.log('we')
      console.log(error)
    })
  },
  methods: {
    refresh() {
      firstData().then((response) => {
        this.firstPageData = response.data
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
  &-head {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 100px;
    line-height: 30px;
  }
}
</style>
