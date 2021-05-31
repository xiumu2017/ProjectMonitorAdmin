<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img src="http://paradise-1256237186.cos.ap-nanjing.myqcloud.com/135942HCimg2.jpg?imageView2/1/w/80/h/80" class="user-avatar">
          <!-- <img :src="avatar+'http://localhost:9000/test/lADPDetfShzYdPzNBDjNB4A_1920_1080.jpg?imageView2/1/w/80/h/80'" class="user-avatar"> -->
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              Home
            </el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://github.com/PanJiaChen/vue-admin-template/">
            <el-dropdown-item>Github</el-dropdown-item>
          </a>
          <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
            <el-dropdown-item>Docs</el-dropdown-item>
          </a>
          <el-dropdown-item @click.native="changePass">修改密码</el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">Log Out</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <div>
      <el-dialog :visible.sync="passDialogVisible" width="35%" title="登录密码修改" :close-on-click-modal="false">
        <el-form size="middle">
          <el-form-item label="原密码" prop="oldPass">
            <el-input v-model="oldPass" type="password" />
          </el-form-item>
          <el-form-item label="新密码" prop="newPass">
            <el-input v-model="newPass" type="password" />
          </el-form-item>
          <el-form-item label="确认密码" prop="newPass">
            <el-input v-model="newPass" type="password" />
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="modifyPass">确认</el-button>
        <el-button type="danger" @click.native="passDialogVisible = false">取消</el-button>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import { mapGetters } from 'vuex'
import { changePass } from '@/api/user'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      passDialogVisible: false,
      oldPass: '',
      newPass: ''
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    changePass() {
      this.passDialogVisible = true
    },
    modifyPass() {
      console.log('info', 'modifyPass-click')
      console.log('newPass', this.newPass)
      changePass({ 'oldPass': this.oldPass, 'newPass': this.newPass }).then(res => {
        console.log('res', res)
        if (res.code === 200) {
          Message({
            message: res.message,
            type: 'success'
          })
          this.passDialogVisible = false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
