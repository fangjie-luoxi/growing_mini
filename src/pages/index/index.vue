<template>
  <nut-row>
    <view class="has-padding">
      <nut-noticebar
        direction="vertical"
        :list="horseLamp"
        :speed="10"
        :standTime="1000"
        background="#f0f8ff"
      >
        <template v-slot:rightIcon>
          <nut-icon color="#93b5cf" size="20px" :name="playState.icon" @click="playMusic"></nut-icon>
        </template>
      </nut-noticebar>
    </view>
  </nut-row>
  <nut-row>{{ state.integral }}</nut-row>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import Taro from "@tarojs/taro";

import { getMusic, getUser } from './service'
import { getCurrentUser } from '@/services/user'

import "./index.scss";

const horseLamp = ['富强 民主 文明 和谐', '自由 平等 公正 法治', '爱国 敬业 诚信 友善'];

const state = reactive({
  msg: '首页',
  integral: 0, // 积分
});

const playState = reactive({
  icon: "play-start",
  isPlay: false,
})

const user = getCurrentUser()

onMounted(async () => {
  const userInfo = await getUser(user.Id)
  state.integral = userInfo.data.data.Integral
})

const playManager = Taro.getBackgroundAudioManager()

playManager.onEnded(() => {
  console.log("音乐播放结束")
  playManager.play()
})

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
