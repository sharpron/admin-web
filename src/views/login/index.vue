<template>
  <el-card class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      label-width="40px"
      class="login-form"
      autocomplete="on"
      label-position="left"
    >

      <div class="title-container">
        <h3 class="title">登录界面</h3>
      </div>

      <el-form-item prop="username">
        <svg-icon slot="label" icon-class="user" />
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="Username"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="password">
          <svg-icon slot="label" icon-class="password" />
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="Password"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          >
            <el-button slot="append" class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </el-button>
          </el-input>
        </el-form-item>
      </el-tooltip>

      <el-form-item prop="captcha">
        <svg-icon slot="label" icon-class="captcha" />
        <el-input
          v-model="loginForm.captcha"
          placeholder="输入验证码"
          class="captcha"
          tabindex="2"
          autocomplete="on"
        >
          <template slot="append">
            <el-button v-if="captchaLoading" :loading="captchaLoading" />
            <img v-else class="captcha-img" :src="captcha.img" alt="验证码" @click="getCaptcha">
          </template>
        </el-input>
      </el-form-item>

      <el-button
        class="bottom"
        :loading="loading"
        type="primary"
        @click.native.prevent="handleLogin"
      >登 录
      </el-button>
    </el-form>
  </el-card>
</template>

<script>
import { validUsername } from '@/utils/validate'
import { getCaptcha } from '@/api/auth'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('请输入正确的密码'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: 'admin',
        password: 'admin123',
        rememberMe: false,
        captcha: ''
      },
      captcha: {
        cacheKey: '',
        img: ''
      },
      captchaLoading: true,
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        captcha: [{ required: true, trigger: 'blur', message: '请输入验证码' }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    this.getCaptcha()
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    getCaptcha() {
      this.captchaLoading = true
      getCaptcha().then(captcha => {
        console.log(captcha)
        this.captcha = captcha
      }).finally(() => {
        this.captchaLoading = false
      })
    },
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
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
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          const form = Object.assign({}, this.loginForm)
          this.$store.dispatch('user/login', Object.assign(form, this.captcha))
            .then(() => {
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
            })
            .catch(() => {
              this.getCaptcha()
            })
            .finally(() => {
              this.loading = false
            })
        } else {
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>
<style lang="scss">
.captcha .el-input-group__append {
  padding: 0;
}
</style>
<style lang="scss" scoped>
.login-container {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 400px;

  .captcha {
    .captcha-img {
      width: 100px;
      height: 32px;
      cursor: pointer;
      vertical-align: bottom;
    }
  }

  .bottom {
    width: 100%;
  }
}
</style>
