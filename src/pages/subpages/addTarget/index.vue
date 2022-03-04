<template>
  <view>{{ state.msg }}</view>
</template>

<script setup>
import { reactive } from 'vue';
import Taro from "@tarojs/taro";
import { getCurrentUser } from '@/services/user'

import "./index.scss";

const state = reactive({
  msg: 'demo',
});

</script>
