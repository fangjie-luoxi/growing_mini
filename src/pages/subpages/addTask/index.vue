<template>
  <nut-datepicker
    v-model:visible="state.showDate"
    :min-date="today"
    :is-show-chinese="false"
    v-model="today"
    @confirm="confirm"
  ></nut-datepicker>
  <nut-form :model-value="formState" ref="ruleForm">
    <nut-form-item label="日期" required prop="date" :rules="[{ required: true, message: '请填写日期' }]">
      <view class="nut-input-text" @tap="openDate">{{ formState.date }}</view>
      <!-- <nut-cell :desc="formState.date" @click="openDate" :desc-text-align="left"></nut-cell> -->
    </nut-form-item>
    <nut-form-item label="标题" required prop="title" :rules="[{ required: true, message: '请填写标题' }]">
      <input class="nut-input-text" placeholder="请输入标题" type="text" v-model="formState.title" />
    </nut-form-item>
    <nut-form-item label="内容" prop="content">
      <nut-textarea
        type="text"
        rows="1"
        placeholder="请输入内容"
        limit-show
        autosize
        max-length="255"
        v-model="formState.content"
      />
    </nut-form-item>
    <nut-form-item
      label="计量单位"
      required
      prop="unit"
      :rules="[{ required: true, message: '请填写计量单位' }]"
    >
      <input
        class="nut-input-text"
        placeholder="任务计量单位 例如:kg,卡路里"
        type="text"
        v-model="formState.unit"
      />
    </nut-form-item>
    <nut-form-item label="计量" required prop="num" :rules="[{ required: true, message: '请填写请计量' }]">
      <nut-inputnumber v-model="formState.num" />
    </nut-form-item>
    <nut-form-item
      label="获得积分"
      required
      prop="integra"
      :rules="[{ required: true, message: '请填写获得积分' }]"
    >
      <nut-inputnumber v-model="formState.integra" />
    </nut-form-item>
    <nut-form-item label="备注" prop="rm">
      <input class="nut-input-text" placeholder="请输入备注" type="text" v-model="formState.rm" />
    </nut-form-item>
    <nut-cell>
      <view style="width: 90%"></view>
      <nut-button type="primary" size="small" @click="submit" :loading="state.isLoading">提交</nut-button>
    </nut-cell>
  </nut-form>
</template>

<script setup>
import { reactive, ref } from 'vue';
import Taro from "@tarojs/taro";
import { getCurrentUser } from '@/services/user'
import moment from 'moment'

import { create } from '@/services/api'

import "./index.scss";

const today = new Date()

const state = reactive({
  showDate: false,
  isLoading: false
})

const ruleForm = ref(null);


const formState = reactive({
  title: "",
  content: "",
  num: 0,
  unit: "",
  integra: 0,
  rm: "",
  date: moment().format("YYYY-MM-DD"),
});

const confirm = (res) => {
  formState.date = res.join('-');
}

const openDate = () => {
  state.showDate = true
}

const submit = () => {
  ruleForm.value.validate().then(({ valid, errors }) => {
    if (valid) {
      state.isLoading = true
      create("gr_task", {
        Date: moment(formState.date),
        UserId: getCurrentUser().Id,
        TkTitle: formState.title,
        TkContent: formState.content,
        TtNum: Number(formState.num),
        TtUnit: formState.unit,
        Num: Number(formState.integra),
        Rm: formState.rm,
      }).then((res) => {
        state.isLoading = false
        Taro.navigateBack()
      })
    }
  });
}

</script>
