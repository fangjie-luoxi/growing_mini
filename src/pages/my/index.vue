<template>
  <nut-row type="flex" align="center">
    <view style="padding: 5px;">
      <nut-avatar size="large" v-if="state.avatar" :icon="state.avatar"></nut-avatar>
      <nut-avatar size="large" v-else>
        <open-data type="userAvatarUrl" />
      </nut-avatar>
    </view>

    <view style="padding: 5px;">
      <view style="margin-bottom: 2px">
        <p v-if="state.userName">{{ state.userName }}</p>
        <open-data v-else type="userNickName" />
      </view>
      <nut-button size="mini" @tap="onSynchronize">同步资料</nut-button>
    </view>
    <view class="setInfo">
      <nut-button size="small" @tap="onInfoSet">账户设置</nut-button>
    </view>
  </nut-row>
  <nut-row>
    <nut-cell title="积分记录" to="/"></nut-cell>
    <nut-cell title="目标列表" to="/"></nut-cell>
    <nut-cell title="任务列表" to="/"></nut-cell>
  </nut-row>
</template>

<script setup>
import { reactive, ref } from 'vue';
import Taro from "@tarojs/taro";

import { OpenData } from '@tarojs/components'

import { getCurrentUser, upCurrentUser } from '@/services/user'
import { upUserInfo } from './service'

import "./index.scss";

const userInfo = getCurrentUser()

const state = reactive({
  userName: userInfo.UserName,
  avatar: userInfo.Avatar
});

// 同步资料
const onSynchronize = () => {
  console.log("同步个人信息")
  Taro.getUserProfile({
    desc: '用于完善用户个人资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
    success: (res) => {
      upUserInfo(userInfo.Id, res.userInfo.nickName, res.userInfo.avatarUrl)
      upCurrentUser()
      state.userName = res.userInfo.nickName
      state.avatar = res.userInfo.avatarUrl
    }
  })
}

// 账号设置
const onInfoSet = () => {
  console.log("onInfoSet")
  Taro.navigateTo({
    url: "/pages/subpages/user/index"
  })
}

</script>
