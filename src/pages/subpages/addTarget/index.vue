<template>
  <nut-datepicker
    v-model:visible="state.showDate"
    :min-date="today"
    :is-show-chinese="false"
    v-model="today"
    @confirm="confirm"
  ></nut-datepicker>
  <nut-form :model-value="formState" ref="ruleForm">
    <nut-form-item
      label="开始日期"
      required
      prop="begin"
      :rules="[{ required: true, message: '请填写目标开始日期' }]"
    >
      <view class="nut-input-text" @tap="openDate('begin')">{{ formState.begin }}</view>
    </nut-form-item>
    <nut-form-item
      label="结束日期"
      required
      prop="end"
      :rules="[{ required: true, message: '请填写目标结束日期' }]"
    >
      <view class="nut-input-text" @tap="openDate('end')">{{ formState.end }}</view>
    </nut-form-item>
    <nut-form-item label="生成任务" prop="gen">
      <nut-radiogroup v-model="formState.gen" direction="horizontal">
        <nut-radio label="y">生成</nut-radio>
        <nut-radio label="n">不生成</nut-radio>
      </nut-radiogroup>
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
  </nut-form>
  <view class="submit">
    <nut-button type="primary" size="small" @click="submit">提交</nut-button>
  </view>
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
  dateTp: "begin"
})

const ruleForm = ref(null);


const formState = reactive({
  begin: moment().format("YYYY-MM-DD"),
  end: moment().format("YYYY-MM-DD"),

  title: "",
  content: "",
  num: 0,
  unit: "",
  integra: 0,
  rm: "",
  gen: "y"
});

const confirm = (res) => {
  if (state.dateTp === "begin") {
    formState.begin = res.join('-');
  } else {
    formState.end = res.join('-');
  }
}

const openDate = (dateTp) => {
  state.dateTp = dateTp
  state.showDate = true
}

const submit = () => {
  ruleForm.value.validate().then(({ valid, errors }) => {
    if (valid) {
      create("gr_target", {
        Begin: moment(formState.begin),
        End: moment(formState.end),
        UserId: getCurrentUser().Id,
        TtTitle: formState.title,
        TtContent: formState.content,
        TtNum: Number(formState.num),
        TtUnit: formState.unit,
        Num: Number(formState.integra),
        Rm: formState.rm,
        GenTask: formState.gen,
      })
      Taro.navigateBack()
    }
  });
}

</script>
