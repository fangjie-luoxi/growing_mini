<template>
  <Login v-if="state.login" @login="onLogin" />
  <view v-else>
    <nut-row>
      <view class="noticebar">
        <nut-noticebar
          direction="vertical"
          :list="horseLamp"
          :speed="8"
          :standTime="1000"
          background="#f0f8ff"
        >
          <template v-slot:rightIcon>
            <nut-icon color="#93b5cf" size="20px" :name="playState.icon" @click="playMusic"></nut-icon>
          </template>
        </nut-noticebar>
      </view>
    </nut-row>
    <nut-row>
      <view class="integral">
        <view class="integral-title">成长积分</view>
        <view class="integral-num">{{ state.integral }}</view>
      </view>
    </nut-row>
    <nut-row>
      <view class="tabs">
        <nut-tabs v-model="state.tab" type="smile" background="#f0f8ff">
          <nut-tabpane title="任务" pane-key="task">
            <TaskDetail :userId="state.user.Id" @change="onChange" />
          </nut-tabpane>
          <nut-tabpane title="目标" pane-key="target">
            <TargetDetail :userId="state.user.Id" @change="onChange" />
          </nut-tabpane>
          <nut-tabpane title="规则" pane-key="rule">
            <RuleDetail :userId="state.user.Id" @change="onChange" />
          </nut-tabpane>
        </nut-tabs>
      </view>
    </nut-row>
  </view>
</template>

<script setup>
import { reactive, onMounted, ref } from 'vue';
import Taro from "@tarojs/taro";

import Login from '@/components/Login'
import TaskDetail from '@/components/TaskDetail'
import TargetDetail from '@/components/TargetDetail'
import RuleDetail from '@/components/RuleDetail'

import { getMusic, getUser } from './service'
import { getCurrentUser, getUserInfo, upCurrentUser } from '@/services/user'

import "./index.scss";

const horseLamp = ['富强 民主 文明 和谐', '自由 平等 公正 法治', '爱国 敬业 诚信 友善'];

const state = reactive({
  login: true,
  tab: "task",
  integral: 0, // 积分
  navVisible: false,
  user: { Id: 0 },
});

const playState = reactive({
  icon: "play-start",
  isPlay: false,
})

const onLogin = () => {
  state.login = false
  state.user = getCurrentUser()
  getUser(state.user.Id).then((res) => {
    state.integral = res.data.data.Integral
  })
}

const playManager = Taro.getBackgroundAudioManager()

playManager.onEnded(() => {
  playManager.src = getMusic()
})

const onChange = (e) => {
  state.integral += e
}

const playMusic = () => {
  playState.isPlay = !playState.isPlay
  if (playState.isPlay) {
    playState.icon = "play-stop"

    playManager.title = '我的答案'
    playManager.epname = '我的答案'
    playManager.singer = '周深'
    playManager.src = getMusic()
    playManager.play()
  } else {
    playState.icon = "play-start"
    playManager.pause()
  }
}

</script>
