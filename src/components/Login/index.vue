<template>
    <view></view>
</template>

<script setup>
import { reactive } from 'vue';
import Taro from "@tarojs/taro";

import { login } from './service'

import { upCurrentUser } from '@/services/user'

const emit = defineEmits(['login'])

Taro.showLoading({
    title: '加载中',
})

Taro.login({
    success: function (res) {
        if (res.code) {
            login({
                LoginCode: res.code,
                LoginType: 'mini',
            }).then((res) => {
                Taro.hideLoading()
                upCurrentUser()
                emit("login")
            })
        }
    },
})

</script>