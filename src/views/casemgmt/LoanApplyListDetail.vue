<template>
  <div>
    <pre>
      <code id="json"></code>
    </pre>
  </div>
</template>
<script>
import { loanapplyQueryDetail } from '@/api/casemgmt'
export default {
  name: 'LoanApplyListDetail',
  data() {
    return {
      detail: {}
    }
  },
  activated() {
    const serialNumber = this.$route.params.serialNumber
    loanapplyQueryDetail(serialNumber).then((response) => {
      // this.detail = JSON.parse(response.data)
      // console.log(this.detail)
      // this.jsonString = JSON.stringify(this.detail, null, 4)
      const jsonDom = document.getElementById('json')
      console.log(jsonDom)
      jsonDom.textContent = response.data
    }).catch(error => {
      console.log(error)
    })
  },
  methods: {

  }
}
</script>
<style scoped>
</style>


