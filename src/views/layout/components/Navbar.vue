<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
    <breadcrumb></breadcrumb>
    <div class="clock">{{ clock }}</div>
    <el-dropdown class="avatar-container" trigger="click">
      <div class="avatar-wrapper">
        <div>hi，{{username}}</div>
        <i class="el-icon-caret-bottom"></i>
      </div>
      <el-dropdown-menu class="user-dropdown" slot="dropdown">
        <!-- <el-dropdown-item>
          <span @click="dialogFormVisible = true">修改密码</span>
        </el-dropdown-item> -->
        <el-dropdown-item divided>
          <span @click="dialogVisible = true" style="display:block;">退出登录</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <!-- <el-dialog title="修改密码" :visible.sync="dialogFormVisible">
      <el-form :inline="true" :model="form">
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="form.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" :label-width="formLabelWidth">
          <el-input v-model="form.confirmPassword" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">确认</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog> -->
    <el-dialog title="温馨提示" :visible.sync="dialogVisible" width="30%">
      <span>确认退出吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="logout">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { findUserName, exit } from '@/api/common'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      // dialogFormVisible: false,
      dialogVisible: false,
      // form: {
      //   password: '',
      //   confirmPassword: ''
      // },
      formLabelWidth: '120',
      username:'',
      clock:''
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'sidebar',
      'avatar'
    ])
  },
  mounted(){
    setInterval(()=>{this.clock_12h()},1000)
    findUserName().then(res => {
      if (res) {
        this.username = res.resData
      }
    }).catch(error => {
      console.log(error)
    })
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      // const url = window.location.href
      // const loginPath = `${window.location.origin}/logout?redirect_uri=${url}`
      // window.location.replace(loginPath)
      // return
      exit().then(res => {
        if (res) {
          window.location.replace(res.resData)
          // this.$message({
          //   type: 'success',
          //   message: '退出成功！'
          // })
        }
      }).catch(error => {
        console.log(error)
      })
    },
    clock_12h(){ 
      var today = new Date(); //获得当前时间 
      //获得年、月、日，Date()函数中的月份是从0－11计算 
      var year = today.getFullYear();   
      var month = today.getMonth()+1; 
      var date = today.getDate(); 
      var hour = today.getHours();  //获得小时、分钟、秒 
      var minute = today.getMinutes(); 
      var second = today.getSeconds(); 
      minute = minute < 10 ? '0' + minute : minute;
      second = second < 10 ? '0' + second : second;
  
      var apm="AM"; //默认显示上午: AM 
      if (hour>12) //按12小时制显示 
      { 
      hour=hour-12; 
      apm="PM"  ; 
      } 
      var weekday = 0; 
      switch(today.getDay()){ 
      case 0: 
          weekday = "星期日"; 
      break; 
      case 1: 
          weekday = "星期一"; 
      break; 
      case 2: 
          weekday = "星期二"; 
      break; 
      case 3: 
          weekday = "星期三"; 
      break; 
      case 4: 
          weekday = "星期四"; 
      break; 
      case 5: 
          weekday = "星期五"; 
      break; 
      case 6: 
          weekday = "星期六"; 
      break; 
      } 
      this.clock = `${year}年${month}月${date}日 ${hour}:${minute}:${second} ${apm} ${weekday}`; 
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}
.clock{
  position: absolute;
  right: 150px;
  top: 6px;
  font-size: 12px;
}
</style>

