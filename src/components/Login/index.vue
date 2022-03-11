<template>
    <view></view>
</template>

<script setup>
import { reactive } from 'vue';
import Taro from "@tarojs/taro";

import { login } from './service'

import { request } from '@/services/api'

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
                request('/login_user', {
                    method: 'GET',
                    data: { resp: 'antd' },
                }).then((userInfo) => {
                    if (userInfo.data.success) {
                        Taro.setStorageSync('userInfo', userInfo.data.data)
                        emit("login")
                        Taro.hideLoading()
                    }
                })

            })
        }
    },
})

</script>