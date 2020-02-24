<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
    <breadcrumb></breadcrumb>
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
      username:''
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
          this.$message({
            type: 'success',
            message: '退出成功！'
          })
        }
      }).catch(error => {
        console.log(error)
      })
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
</style>

