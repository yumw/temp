<template>
  <div>
    <div class="container">
      <div v-if="source === 'abnormal'">
        <div>异常ID：{{details.id}}</div>
        <div>流水号：{{details.serialNumber}}</div>
        <div>接口名称：{{details.serviceName}}</div>
        <div>服务接口中文名称：{{details.serviceNameChinese}}</div>
        <div>请求方：{{details.requestChannel}}</div>
        <div>接收方：{{details.receiveChannel}}</div>
        <div>请求参数：{{details.requestData}}</div>
        <div>反馈参数：{{details.responseData}} </div>
        <div>失败原因：{{details.exceptionContent}}</div>
        <div>处理状态：{{details.processState}}</div>
        <div>重试次数：{{details.retryCount}}</div>
        <div>创建时间：{{details.exceptionTime}}</div>
        <div>更新时间：{{details.retryTimeLatest}}</div>
      </div>
      <div v-else>
        <div>流水号：{{details.serialNumber}}</div>
        <div>服务接口：{{details.serviceName}}</div>
        <div>服务接口中文名称：{{details.serviceNameChinese}}</div>
        <div>请求方：{{details.scource}}</div>
        <div>接收方：{{details.target}}</div>
        <div v-if="source === 'request'">请求内容：{{details.requestContent}}</div>
        <div v-else>请求内容：{{details.replyContent}}</div>
        <div>响应内容：{{details.responseContent}}</div>
        <div>状态：{{details.state|stateTranslate}}</div>
        <div>创建时间：{{details.createTime}}</div>
      </div>
      <div class="log" v-if="details.logRetries&&details.logRetries.length>0">
        <div>日志：</div>
        <div>
          <div class="item" v-for="item in details.logRetries" :key="item.id">
            <div>日志ID：{{item.id}}</div>
            <div>代码：{{item.logCode}}</div>
            <div>日志类型：{{item.logType }}</div>
            <div>内容：{{item.logContent}}</div>
            <div>记录时间：{{item.createTime}}</div>
          </div>
        </div>
      </div>
    </div>
    <pre style="display:none;">
      <code id="details"></code>
    </pre>
  </div>
</template>
<script>
export default {
  name: 'TaskDetails',
  data() {
    return {
      details: {},
      jsonString: '',
      source: ''
    }
  },
  activated() {
    this.details = this.$store.state.globalData.requestDetails
    this.source = this.$route.params.source
    this.jsonString = JSON.stringify(this.details, null, 4)
    const jsonDom = document.getElementById('details')
    jsonDom.textContent = this.jsonString
  },
  methods: {
  },
  filters: {
    stateTranslate(value) {
      if (value === 1) {
        return '成功'
      } else if (value === 0) {
        return '失败'
      }
    }
  }
}
</script>
<style scoped>
.container {
  padding: 20px;
  line-height: 40px;
}
a {
  color: blue;
}
.log {
  display: -webkit-box;
}
.item {
  line-height: 20px;
  margin-bottom: 10px;
}
</style>


