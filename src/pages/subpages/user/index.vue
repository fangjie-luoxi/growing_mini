<template>
  <nut-cell title="绑定的手机号" :desc="getPhone()" @click="bindPhone"></nut-cell>
  <nut-dialog content="是否更换绑定的手机号码" v-model:visible="visiblePhone" @ok="onOk" />
  <nut-cell title="绑定的邮箱" :desc="stateUser.Email ? stateUser.Email : '未绑定'"></nut-cell>
  <!-- <button
    :onGetPhoneNumber="getPhoneNumber"
    openType="getPhoneNumber"
    :plain="true"
    type="primary"
  >按钮</button>-->
</template>

<script setup>
import { reactive, ref } from 'vue';
import Taro from "@tarojs/taro";

import { getCurrentUser } from "@/services/user"

// import { Button } from '@tarojs/components'

const visiblePhone = ref(false);

const userInfo = getCurrentUser('userInfo')
const stateUser = reactive(userInfo)

const getPhone = () => {
  return stateUser.Phone ? stateUser.Phone.slice(0, 4) + "****" + stateUser.Phone.slice(-4) : "未绑定"
}

const bindPhone = () => {
  visiblePhone.value = true;
}

const onOk = () => {
  console.log('event ok');
};

// const getPhoneNumber = () => {
//   console.log('onGetPhoneNumber');
// }

</script>
