<template>
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
          <TaskDetail :userId="user.Id" @change="onChange" />
        </nut-tabpane>
        <nut-tabpane title="目标" pane-key="target">
          <TargetDetail :userId="user.Id" @change="onChange" />
        </nut-tabpane>
        <nut-tabpane title="规则" pane-key="rule">
          <RuleDetail :userId="user.Id" @change="onChange" />
        </nut-tabpane>
      </nut-tabs>
    </view>
  </nut-row>

  <!-- <nut-fixednav
    :position="{ bottom: '10px' }"
    v-model:visible="state.navVisible"
    un-active-text="添加"
    active-text="选择添加"
    @selected="navSelected"
    :nav-list="navList"
  />-->
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import Taro from "@tarojs/taro";

import TaskDetail from '@/components/TaskDetail'
import TargetDetail from '@/components/TargetDetail'
import RuleDetail from '@/components/RuleDetail'

import { getMusic, getUser } from './service'
import { getCurrentUser } from '@/services/user'

import "./index.scss";

const horseLamp = ['富强 民主 文明 和谐', '自由 平等 公正 法治', '爱国 敬业 诚信 友善'];

const state = reactive({
  tab: "task",
  integral: 0, // 积分
  navVisible: false,
});

const playState = reactive({
  icon: "play-start",
  isPlay: false,
})

const navList = [
  {
    id: 1,
    text: '任务',
    icon: 'https://img11.360buyimg.com/imagetools/jfs/t1/117646/2/11112/1297/5ef83e95E81d77f05/daf8e3b1c81e3c98.png'
  },
  {
    id: 2,
    text: '目标',
    //icon: 'https://img12.360buyimg.com/imagetools/jfs/t1/119490/8/9568/1798/5ef83e95E968c69a6/dd029326f7d5042e.png'
  },
  {
    id: 3,
    text: '规则',
    //icon: 'https://img14.360buyimg.com/imagetools/jfs/t1/130725/4/3157/1704/5ef83e95Eb976644f/b36c6cfc1cc1a99d.png'
  },
]

const user = getCurrentUser()

onMounted(async () => {
  const userInfo = await getUser(user.Id)
  state.integral = userInfo.data.data.Integral
})

const playManager = Taro.getBackgroundAudioManager()

playManager.onEnded(() => {
  console.log("音乐播放结束")
  playManager.src = getMusic()
  // playManager.play()
})

const navSelected = (e) => {
  console.log("选择:", e.item)
}

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
