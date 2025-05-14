<template>
  <el-config-provider :locale="zhCn">
    <router-view v-slot="{ Component }">
      <transition name="appFade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </el-config-provider>
</template>

<script setup>
import { ElConfigProvider } from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
</script>

<style>
@import './styles/style.css';

.appFade-enter-active,
.appFade-leave-active {
  transition: opacity 0.2s ease;
}

.appFade-enter-from,
.appFade-leave-to {
  opacity: 0;
}

#nprogress .bar {
  background: rgb(186, 54, 93) !important;
}
</style>
