<template>
  <div class="login" :style="'background-image:url('+ Background +');'">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" label-position="left" label-width="0px" class="login-form">
      <h3 class="title">
        Z-BLOG 后台管理系统
      </h3>
      <el-form-item prop="username">
        <el-input ref="username" v-model="loginForm.username" type="text" auto-complete="off" placeholder="请输入用户名">
          <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input ref="password" v-model="loginForm.password" :type="pwdFlagType" auto-complete="off" placeholder="请输入密码" @keyup.enter.native="handleLogin">
          <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
          <i slot="suffix" :class="[pwdFlag ? 'el-icon-view' : 'el-icon-view']" style="margin-top: 12px; margin-right: 5px; font-size: 16px;" @click="getPwdFlag()" />
        </el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input ref="code" v-model="loginForm.code" auto-complete="off" placeholder="请输入验证码" style="width: 63%" @keyup.enter.native="handleLogin">
          <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" alt="" @click="getCode">
        </div>
      </el-form-item>
      <el-checkbox v-model="loginForm.rememberMe" style="margin:0 0 25px 0;">
        记住我
      </el-checkbox>
      <el-form-item style="width:100%;">
        <el-button ref="loginBtn" :loading="loading" size="medium" type="primary" style="width:100%;" @click.native.prevent="handleLogin">
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </el-form-item>
    </el-form>
    <!--  底部  -->
    <div v-if="$store.state.settings.showFooter" id="el-login-footer">
      <span v-html="$store.state.settings.footerTxt" />
      <span> ⋅ </span>
      <a href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank">{{ $store.state.settings.caseNumber }}</a>
    </div>
  </div>
</template>

<script>
import qs from 'qs'
import Background from '@/assets/images/background.jpeg'
import { encrypt } from '@/utils/rsaEncrypt'
export default {
  name: 'Login',
  data() {
    return {
      Background: Background,
      codeUrl: '',
      loginForm: {
        username: '',
        password: '',
        rememberMe: false,
        code: '',
        uuid: '',
        loginType: '1'
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '用户名不能为空' }],
        password: [{ required: true, trigger: 'blur', message: '密码不能为空' }],
        code: [{ required: true, trigger: 'change', message: '验证码不能为空' }]
      },
      loading: false,
      redirect: undefined,
      // password input type
      pwdFlag: false,
      pwdFlagType: 'password'
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const data = route.query
        if (data && data.redirect) {
          this.redirect = data.redirect
          delete data.redirect
          if (JSON.stringify(data) !== '{}') {
            this.redirect = this.redirect + '&' + qs.stringify(data, { indices: false })
          }
        }
      },
      immediate: true
    }
  },
  // 在模板渲染成html前调用，即通常初始化某些属性值，然后再渲染成视图
  created() {
    // 获取验证码
    this.getCode()
    // 登录过期提醒
    this.point()
  },
  // 在模板渲染成html后调用，通常是初始化页面完成后，再对html的dom节点进行一些需要的操作
  mounted() {
    // 页面加载自动聚焦
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    } else if (this.loginForm.code === '') {
      this.$refs.code.focus()
    } else {
      this.$refs.loginBtn.focus()
    }
  },
  methods: {
    getPwdFlag() {
      this.pwdFlag = !this.pwdFlag
      this.pwdFlagType = this.pwdFlag ? 'text' : 'password'
    },
    getCode() {
      this.$mapi.communal.loginCode({ _t: new Date().getTime() }).then(res => {
        this.codeUrl = res.data.img
        this.loginForm.code = ''
        this.loginForm.uuid = res.data.uuid
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          const loginParam = {
            username: this.loginForm.username,
            password: encrypt(this.loginForm.password),
            rememberMe: this.loginForm.rememberMe,
            code: this.loginForm.code,
            uuid: this.loginForm.uuid
          }

          this.loading = true
          this.$store.dispatch('Login', loginParam).then(() => {
            this.$message.success('登录成功')
            this.$router.push({ path: this.redirect || '/admin' })
          }).catch(() => {
            this.getCode()
            this.$refs.code.focus()
          }).finally(_ => {
            this.loading = false
          })
        }
      })
    },
    point() {
      const point = window.sessionStorage.getItem('point')
      if (point !== null && point !== undefined) {
        this.$message.warning('当前登录状态已过期，请重新登录')
        window.sessionStorage.removeItem('point')
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  .login {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-size: cover;
  }
  .title {
    margin: 0 auto 30px auto;
    text-align: center;
    color: #707070;
  }

  .login-form {
    border-radius: 6px;
    background: #ffffff;
    width: 385px;
    padding: 25px 25px 5px 25px;
    .el-input {
      height: 38px;
      input {
        height: 38px;
      }
    }
    .input-icon {
      height: 39px;width: 14px;margin-left: 2px;
    }
  }
  .login-tip {
    font-size: 13px;
    text-align: center;
    color: #bfbfbf;
  }
  .login-code {
    width: 33%;
    display: inline-block;
    height: 38px;
    float: right;
    img {
      cursor: pointer;
      vertical-align:middle
    }
  }
</style>
