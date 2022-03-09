<template>
  <nut-form :model-value="formState" ref="ruleForm">
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
    <nut-form-item label="积分规则" prop="inType" :rules="[{ required: true, message: '请选择积分规则' }]">
      <nut-radiogroup v-model="formState.inType" direction="horizontal">
        <nut-radio label="i">增加</nut-radio>
        <nut-radio label="o">扣除</nut-radio>
      </nut-radiogroup>
    </nut-form-item>

    <nut-form-item
      label="积分"
      required
      prop="integra"
      :rules="[{ required: true, message: '请填写积分' }]"
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

import { create } from '@/services/api'

import "./index.scss";

const state = reactive({
})

const ruleForm = ref(null);

const formState = reactive({
  title: "",
  content: "",
  inType: "i",
  integra: 0,
  rm: "",
});

const submit = () => {
  ruleForm.value.validate().then(({ valid, errors }) => {
    if (valid) {
      create("gr_rule", {
        UserId: getCurrentUser().Id,
        ReName: formState.title,
        Content: formState.content,
        InType: formState.inType,
        Num: Number(formState.integra),
        Rm: formState.rm,
      })
      Taro.navigateBack()
    }
  });
}

</script>
