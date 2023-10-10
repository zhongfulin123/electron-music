<template>
  <div>
    <el-dropdown trigger="click" v-if="userStore.uid">
      <div class="avatar">
        <img :src="userInfo?.avatarUrl" alt="" class="avatar-img" />
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
    <el-dialog v-model="dialogFormVisible" :modal="false" width="30%" @close="closeDialog()">
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
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@renderer/store/user'
import { onMounted, reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'
import { loginUser, getUserDetail, logoutUser } from '@renderer/api'
import { ElMessage } from 'element-plus'
const loginFormRef = ref<FormInstance>()
const userStore = useUserStore()
const dialogFormVisible = ref(false)
const userInfo = ref()
onMounted(() => {
  const uid =  userStore.uid 
  if (uid) {
    userdetail(uid)
  }
})

const form = ref({
  phone: '',
  password: ''
})

const rules = reactive({
  phone: [{ required: true, validator: validatePhone, trigger: 'blur' }],
  password: [{ required: true, trigger: 'blur', message: '请输入密码' }]
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
  userStore.setUid(uid)
  const res = await getUserDetail(uid)
  if (res.code !== 200) return
  userInfo.value = res.profile
  userStore.setUserInfo( userInfo.value)
}


/**
 * 关闭对话框并重置表单
 */
function closeDialog() {
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
      const res = await loginUser(form.value)
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
    }
  })
}

/**
 * 退出
 */
async function handleLogout() {
  userStore.setUid('')
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
