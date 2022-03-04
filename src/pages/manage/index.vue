<template>
  <nut-popup position="bottom" round :style="{ height: '30%' }" v-model:visible="state.showRound">
    <nut-cell title="任务" desc="添加任务" @click="toAdd('task')"></nut-cell>
    <nut-cell title="目标" desc="添加目标" @click="toAdd('target')"></nut-cell>
    <nut-cell title="规则" desc="添加规则" @click="toAdd('rule')"></nut-cell>
  </nut-popup>
  <view class="tabs">
    <nut-navbar :left-show="false" icon="uploader" @on-click-send="more">
      <template #content>
        <nut-tabs v-model="state.tab" @change="changeTabList">
          <nut-tabpane title="任务" pane-key="task">任务</nut-tabpane>
          <nut-tabpane title="目标" pane-key="target">目标</nut-tabpane>
          <nut-tabpane title="规则" pane-key="rule">规则</nut-tabpane>
        </nut-tabs>
      </template>
    </nut-navbar>
  </view>
</template>

<script setup>
import { reactive } from 'vue';
import Taro from "@tarojs/taro";
import { getCurrentUser } from '@/services/user'

import "./index.scss";

const state = reactive({
  tab: 'task',
  showRound: false,
});

const changeTabList = (tab) => {
  console.log("tab:", tab);
}

const more = () => {
  state.showRound = true
}

const toAdd = (tp) => {
  let urlPath = "addTask"
  if (tp === "target") {
    urlPath = "addTarget"
  }
  if (tp === "rule") {
    urlPath = "addRule"
  }
  state.showRound = false
  Taro.navigateTo({ url: "/pages/subpages/" + urlPath + "/index" })
}

</script>
