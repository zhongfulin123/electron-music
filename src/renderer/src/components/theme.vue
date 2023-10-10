<template>
      <div class="theme">
    <el-popover
      placement="top"
      trigger="click"
      width="230"
    >
      <div class="themes">
        <div
          :key="index"
          @click="changeTheme(themeKey)"
          class="theme-item"
          v-for="(themeValue, themeKey, index) in themeMap"
        >
          <div
            :style="themeValue.style"
            class="theme-icon"
          ></div>
          <p>{{themeValue.title}}</p>
        </div>
      </div>
      <template #reference>
        <Icon
        :backdrop="true"
        slot="reference"
        type="skin"
        :size="20"
      />
      </template>
    

    </el-popover>
  </div>
</template>

<script setup lang="ts">
import variables from "@renderer/assets/css/themes/variables"
import variablesWhite from "@renderer/assets/css/themes/variables-white"
import variablesRed from "@renderer/assets/css/themes/variables-red"
import { onMounted, ref } from "vue";
import {useGlobalStore} from '@renderer/store/global'
const globalStore =  useGlobalStore()
const themes = {
  white: "white",
  dark: "dark",
  red: "red"
}
const themeMap = ref({
    [themes.dark]: {
        title: "深色",
        file: variables,
        style: {
          backgroundColor: "#202020"
        }
      },
      [themes.white]: {
        title: "浅色",
        file: variablesWhite,
        style: {
          backgroundColor: "#F6F6F6",
          border: "1px solid #EBEAEA"
        }
      },
      [themes.red]: {
        title: "红色",
        file: variablesRed,
        style: {
          backgroundColor: "#EC4141"
        }
      }
})
function  changeTheme(themeKey) {
     globalStore.setTheme(themeKey)
      const theme = themeMap.value[themeKey].file
      Object.keys(theme).forEach(key => {
        const value = theme[key]
        document.documentElement.style.setProperty(key, value)
      })
    }
    onMounted(()=>{
        changeTheme(globalStore.theme)
    })
  
</script>

<style scoped lang="scss">
.themes {
  @include flex-center();

  .theme-item {
    @include flex-center();
    flex-direction: column;
    margin: 0 8px;
    cursor: pointer;

    .theme-icon {
      width: 25px;
      height: 25px;
      border-radius: 50%;
      margin-bottom: 4px;
    }
  }
}
</style>