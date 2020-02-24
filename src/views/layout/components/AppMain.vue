<template>
  <section class="app-main">
    <transition
      name="fade"
      mode="out-in"
    >
      <!-- <keep-alive> -->
        <router-view></router-view>
      <!-- </keep-alive> -->
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    // key() {
    //   return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    // }
  },
  created() {
    this.$store.dispatch('getChannel') //获取所有进件渠道
    this.$store.dispatch('getAssetPackNo')

    this.$store.dispatch('getAssetTag')
    this.$store.dispatch('getProduct') //获取所有产品号
    this.$store.dispatch('getPartner') //获取所有资方
    
    this.$store.dispatch('getCooperativeMode')

    //this.$store.dispatch('getChannelInfo')
  }
}
</script>
