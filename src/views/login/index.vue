<template>
  <div class="login-container">
    <div id="color-name" class="fadeout" />
    <div className="verses" class="verses waves vertical">
      <div id="verses-content">{{ poem.content }}</div>
      <a href="" target="_blank" rel="noopener noreferrer">
        <div id="verses-origin">
          <span className="title" class="title">{{ '「' + poem.origin.title + '」' }}</span>
          <span className="stamp" class="stamp">{{ poem.origin.author }}</span>
          <span className="origin-search-icon" />
        </div>
      </a>
    </div>
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">Welcome Login</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="Username"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="pwd" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="Password"
          name="password"
          tabindex="2"
          auto-complete="on"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-form-item prop="code">
        <span class="svg-container">
          <i class="el-icon-success" />
        </span>
        <el-input
          :key="passwordType"
          ref="code"
          v-model="loginForm.code"
          placeholder="Code"
          name="code"
          tabindex="2"
          auto-complete="off"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-code-img" @click="renderCode">
          <!-- <el-image
            style="width: 120px; height: 35px"
            :src="captchaUrl"
            fit="contain"
          /> -->
          <img
            style="width: 120px; height: 35px; margin-top: 5%"
            :src="captchaUrl"
            fit="contain"
          >
        </span>
      </el-form-item>

      <el-form-item>
        <el-button id="loginButton" :loading="loading" type="primary" style="width:100%;" @click.native.prevent="handleLogin">
          Sign in
        </el-button>
      </el-form-item>
      <!--<div class="tips">
        <span style="margin-right:20px;">username: admin</span>
        <span> password: admin</span>
      </div>-->
    </el-form>
    <vue-p5
      @sketch="sketches[0]"
    />
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
// import Example from '@/components/p5/Example.vue'
import VueP5 from 'vue-p5'
import waves from '@/sketchs/waves'
import { load } from '@/utils/jinrishici'
// import blobs from './sketchs/blobs'

const DEFAULT_SHICI_LIST = require('@/constants/shici.json')

export default {
  name: 'Login',
  components: {
    'vue-p5': VueP5
  },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('Please enter the correct user name'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    return {
      poem: {
        'id': '5b8b9572e116fb3714e6fa58',
        'content': '乱花渐欲迷人眼，浅草才能没马蹄。',
        'popularity': 734000,
        'origin': {
          'title': '钱塘湖春行',
          'dynasty': '唐代',
          'author': '白居易',
          'content': [
            '孤山寺北贾亭西，水面初平云脚低。',
            '几处早莺争暖树，谁家新燕啄春泥。',
            '乱花渐欲迷人眼，浅草才能没马蹄。',
            '最爱湖东行不足，绿杨阴里白沙堤。'
          ],
          'translate': null
        },
        'matchTags': ['春'],
        'recommendedReason': '',
        'cacheAt': '2019-05-25T07:40:39.170681'
      },
      loginForm: {
        username: '',
        password: '',
        code: ''
      },
      captchaUrl: process.env.VUE_APP_BASE_API + 'kaptcha/render',
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      sketches: [waves]
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    const _this = this
    console.log('tag', '进入created')
    load(
      (result) => {
        // Storager.set({ verses: result.data })
        console.log('获取古诗词：result', result)
        _this.poem = result.data
      },
      (err) => {
        this.setState({ errMessage: err.errMessage })
        const localShici = DEFAULT_SHICI_LIST[Math.floor(Math.random() * DEFAULT_SHICI_LIST.length)]
        _this.poem = localShici
        // Storager.set({ verses: localShici })
        console.log('error', '获取诗词出问题了')
      }
    )
    console.log('tag', '结束created')
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    renderCode() {
      console.log('renderCode', '验证码刷新')
      this.captchaUrl = process.env.VUE_APP_BASE_API + 'kaptcha/render?' + new Date().getTime()
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          this.loading = false
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#E6E6E6;
$light_gray:#fff;
$cursor: #000;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      // color: $light_gray;
      color: #000;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 1);
    // background: rgba(0, 0, 0, 0.1);
    background: transparent;
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  // background-image: URL('https://cn.bing.com//th?id=OHR.MittenwalderHut_ZH-CN4406131876_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp');
  // background-size: cover;

  .login-form {
    // position: relative;
    width: 520px;
    max-width: 100%;
    // padding: 160px 35px 0;
    // margin: 0 auto;
    overflow: hidden;
    // background:#F5F5F5;
    // top: 200px;
    // margin-top: 100px;
    // padding-top: 20px;
    position: absolute;
    left: 40%;
    top: 25%;
    margin-left: 10%;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      // color: $light_gray;
      color: #000;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .show-code-img {
    position: absolute;
    right: 10px;
    // top: 7px;
    // font-size: 16px;
    // color: $dark_gray;
    // cursor: pointer;
    // user-select: none;
  }
}
</style>
