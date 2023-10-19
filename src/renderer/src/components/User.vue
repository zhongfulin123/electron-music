<template>
  <div>
    <el-dropdown trigger="click" v-if="userStore.uid">
      <div class="avatar">
        <el-image :src="userInfo?.avatarUrl" alt="" class="avatar-img" lazy />
        <div class="text">{{ userInfo?.nickname }}</div>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            ><div class="item" @click="handleLogout">
              <Icon type="tuichu"></Icon> <span class="text">退出登录</span>
            </div></el-dropdown-item
          >
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <div class="avatar" @click="dialogFormVisible = true" v-else>
      <Icon type="weidenglu-touxiang" size="25"></Icon>
      <div class="text">未登录</div>
    </div>
    <!-- <el-dialog v-model="dialogFormVisible" :modal="false" width="30%" @close="closeDialog()">
      <el-form :model="form" :rules="rules" ref="loginFormRef">
        <el-form-item label="手机号" label-width="70" prop="phone">
          <el-input v-model="form.phone" type="numbner" />
        </el-form-item>
        <el-form-item label="密码" label-width="70" prop="password">
          <el-input v-model="form.password" type="password" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="display: flex; justify-content: center" @click.stop="handleLogin">
          <el-button type="danger" color="#FF3A3A" style="width: 100%"> 登录 </el-button>
        </div>
      </template>
    </el-dialog> -->
    <z-dialog v-model="dialogFormVisible" @finish="closeDialog">
      <div class="otherLogin" v-if="!isQr">
        <div style="position: absolute; left: 0; top: 0" @click="changeLgon">
          <Icon type="erweimajiaobiao-copy" size="30"></Icon>
        </div>

        <div style="margin-top: 100px">
          <el-form :model="form" :rules="rules" ref="loginFormRef">
            <el-form-item prop="phone">
              <el-input v-model="form.phone" type="numbner" placeholder="请输入手机号" />
            </el-form-item>
            <el-form-item prop="password" v-show="!isCaptcha">
              <el-input v-model="form.password" type="password" placeholder="请输入密码" />
            </el-form-item>
            <el-form-item prop="captcha" v-show="isCaptcha">
              <el-input v-model="form.captcha" type="captcha" placeholder="请输入验证码">
                <template #append>
                  <el-button
                    style="color: #0c73c2; width: 100px"
                    @click="getCaptchaSent"
                    :disabled="isDown"
                  >
                    {{ isDown ? countDown : '获取验证码' }}
                  </el-button>
                </template>
              </el-input>
            </el-form-item>
          </el-form>
          <div
            style="text-align: right; color: #0c73c2; cursor: pointer"
            @click="isCaptcha = !isCaptcha"
          >
            {{ isCaptcha ? '验证码登录' : '密码登录' }}
          </div>
          <div
            style="display: flex; justify-content: center; margin-top: 10px"
            @click.stop="handleLogin"
          >
            <el-button type="danger" color="#FF3A3A" style="width: 100%"> 登录 </el-button>
          </div>
        </div>
      </div>
      <div class="qr" v-else>
        <div class="title">扫码登录(延迟较高)</div>
        <div class="qrImg">
          <img :src="qrImg" alt="" />
        </div>
        <div @click="qrLogin" v-if="isRefresh">刷新二维码</div>
        <div>使用网易云APP扫码登录</div>
        <div class="other" @click="changeLgon">选中其他登录方式></div>
      </div>
    </z-dialog>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@renderer/store/user'
import { onMounted, reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'
import {
  loginUser,
  getUserDetail,
  logoutUser,
  createKey,
  createQr,
  checkQr,
  loginStatus,
  captchaSent
} from '@renderer/api'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import md5 from 'crypto-js/md5'
import ZDialog from './ZDialog.vue'
const loginFormRef = ref<FormInstance>()
const userStore = useUserStore()
const dialogFormVisible = ref(false)
const userInfo = ref()
onMounted(() => {
  const uid = userStore.uid
  if (uid) {
    userdetail(uid)
  }
})
const qrImg = ref('')
let timer: any
const isRefresh = ref(false)
const isCaptcha = ref(false)
async function qrLogin() {
  if (timer) clearInterval(timer)
  const res1 = await createKey()
  const key = res1.data.unikey
  const res2 = await createQr(key)
  qrImg.value = res2.data.qrimg
  timer = setInterval(async () => {
    const res3 = await checkQr(key)
    if (res3.code === 800) {
      isRefresh.value = true
      clearInterval(timer)
    }
    if (res3.code === 803) {
      const res4 = await loginStatus({
        cookie: res3.cookie
      })
      userdetail(res4.data.account.id)
      dialogFormVisible.value = false
    }
  }, 3000)
}
const countDown = ref(60)
const isDown = ref(false)
let timerDown: any
async function getCaptchaSent() {
  await captchaSent(form.value.phone)
  isDown.value = true
  timerDown = setInterval(() => {
    if (countDown.value <= 0) {
      clearInterval(timerDown)
      isDown.value = false
      countDown.value = 60
    }
    countDown.value--
  }, 1000)
}
const isQr = ref(false)
function changeLgon() {
  isQr.value = !isQr.value
  if (isQr.value) {
    qrLogin()
  } else {
    clearInterval(timer)
  }
}

const router = useRouter()

const form = ref({
  phone: '',
  password: '',
  captcha: ''
})

const rules = reactive({
  phone: [{ required: true, validator: validatePhone, trigger: 'blur' }],
  password: [{ trigger: 'blur', message: '请输入密码' }],
  captcha: [{ trigger: 'blur', message: '请输入验证码' }]
})

/**
 *  验证手机号
 * @param _rule
 * @param value
 * @param callback
 */
function validatePhone(_rule: any, value: any, callback: any) {
  const reg = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/
  if (reg.test(value)) {
    callback()
  } else {
    callback(new Error('手机号格式错误'))
  }
}
/**
 *  获取用户详情
 * @param uid 用户id
 */

async function userdetail(uid) {
  closeDialog()
  userStore.setUid(uid)
  const res = await getUserDetail(uid)
  if (res.code !== 200) return
  userInfo.value = res.profile
  userStore.setUserInfo(userInfo.value)
  router.replace({
    path: '/'
  })
}

/**
 * 关闭对话框并重置表单
 */
function closeDialog() {
  isQr.value = false
  if (timerDown) clearInterval(timerDown)
  isDown.value = false
  isCaptcha.value = false
  countDown.value = 60
  if (!loginFormRef.value) return
  loginFormRef.value.resetFields()
}

/**
 * 登录
 */

const handleLogin = async () => {
  if (!loginFormRef.value) return
  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      const params: Record<string, any> = {
        phone: form.value.phone,
        md5_password: md5(form.value.password)
      }
      if (isCaptcha.value) {
        Reflect.deleteProperty(params, 'md5_password')
        params.captcha = form.value.captcha
      }
      console.log(params)

      try {
        const res = await loginUser(params)
        if (res.code === 200) {
          userdetail(res.account.id)
          dialogFormVisible.value = false
          ElMessage({
            message: '登录成功',
            type: 'success'
          })
        } else {
          ElMessage({
            message: '账号或者密码错误',
            type: 'error'
          })
        }
      } catch (error: any) {
        ElMessage({
          message: error.message,
          type: 'error'
        })
      }
    }
  })
}

/**
 * 退出
 */

async function handleLogout() {
  userStore.setUid('')
  router.replace({
    path: '/'
  })
  await logoutUser()
}
</script>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item:not(.is-disabled):focus) {
  background-color: var(--header-bgcolor);
  color: var(--header-font-color);
}

.el-dropdown-menu {
  padding: 0px;
  border: none;
}
.qr {
  display: flex;
  flex-direction: column;
  align-items: center;
  .title {
    font-weight: bold;
    font-size: 24px;
    margin-top: 150px;
  }
  .other {
    margin-top: 20px;
  }
}
.otherLogin {
  padding: 0 40px;
}
.avatar {
  display: flex;
  align-items: center;
  margin-right: 15px;
  .avatar-img {
    @include round(30px);
  }
  .text {
    margin-left: 5px;
    color: var(--header-font-color);
  }
}
.item {
  display: flex;
  padding: 2px 0;
  align-items: center;
  .text {
    margin-left: 5px;
  }
}
</style>
