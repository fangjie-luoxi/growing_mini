<template>
  <nut-datepicker
    v-model:visible="state.showDate"
    :min-date="today"
    :is-show-chinese="false"
    v-model="today"
    @confirm="confirm"
  ></nut-datepicker>
  <nut-form :model-value="state.task" ref="ruleForm">
    <nut-form-item label="日期" required prop="Date" :rules="[{ required: true, message: '请填写日期' }]">
      <view
        class="nut-input-text"
        @tap="openDate"
      >{{ moment(state.task.Date).format("YYYY-MM-DD") }}</view>
      <!-- <nut-cell :desc="formState.date" @click="openDate" :desc-text-align="left"></nut-cell> -->
    </nut-form-item>
    <nut-form-item
      label="标题"
      required
      prop="TkTitle"
      :rules="[{ required: true, message: '请填写标题' }]"
    >
      <input
        :disabled="state.readonly"
        class="nut-input-text"
        placeholder="请输入标题"
        type="text"
        v-model="state.task.TkTitle"
      />
    </nut-form-item>
    <nut-form-item label="内容" prop="TkContent">
      <nut-textarea
        :disabled="state.readonly"
        type="text"
        rows="1"
        limit-show
        autosize
        max-length="255"
        v-model="state.task.TkContent"
      />
    </nut-form-item>
    <nut-form-item
      label="计量单位"
      required
      prop="TtUnit"
      :rules="[{ required: true, message: '请填写计量单位' }]"
    >
      <input
        :disabled="state.readonly"
        class="nut-input-text"
        placeholder="任务计量单位 例如:kg,卡路里"
        type="text"
        v-model="state.task.TtUnit"
      />
    </nut-form-item>
    <nut-form-item
      label="计量"
      required
      prop="TtNum"
      :rules="[{ required: true, message: '请填写请计量' }]"
    >
      <nut-inputnumber :disabled="state.readonly" v-model="state.task.TtNum" />
    </nut-form-item>
    <nut-form-item
      label="获得积分"
      required
      prop="Num"
      :rules="[{ required: true, message: '请填写获得积分' }]"
    >
      <nut-inputnumber :disabled="state.readonly" v-model="state.task.Num" />
    </nut-form-item>
    <nut-form-item label="备注" prop="Rm">
      <input :disabled="state.readonly" class="nut-input-text" type="text" v-model="state.task.Rm" />
    </nut-form-item>

    <nut-cell v-if="state.task.GrTargetId === 0">
      <view style="width: 90%"></view>
      <nut-button
        size="small"
        style="margin-right: 10px"
        v-if="state.submitType"
        @click="onCancel"
      >取消</nut-button>
      <nut-button
        type="primary"
        size="small"
        style="margin-right: 10px"
        @click="submit"
        :loading="state.isLoading"
      >{{ state.submitType ? "提交" : "修改" }}</nut-button>
    </nut-cell>
    <nut-cell title="跳转到目标" is-link v-else desc="此任务由目标产生无法修改" @click="toTarget"></nut-cell>
  </nut-form>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import Taro from "@tarojs/taro";
import { getCurrentUser } from '@/services/user'
import moment from 'moment'

import { getOne, updata } from '@/services/api'


import "./index.scss";

const id = Taro.getCurrentInstance().router.params.id

const today = new Date()

const state = reactive({
  task: {},
  readonly: true,
  showDate: false,
  submitType: false,
  isLoading: false,
});

const ruleForm = ref(null);

onMounted(() => {
  getOne("gr_task", id).then((res) => {
    if (res.success) {
      state.task = res.data
    }
  })
})

const confirm = (res) => {
  state.task.Date = moment(res.join('-'));
}

const openDate = () => {
  if (!state.readonly) {
    state.showDate = true
  }
}

const onCancel = () => {
  state.submitType = false
  state.readonly = true
}

const submit = () => {
  if (!state.submitType) {
    state.submitType = true
    state.readonly = false
  } else {
    ruleForm.value.validate().then(({ valid, errors }) => {
      if (valid) {
        state.isLoading = true
        updata("gr_task", id, {
          ...state.task
        }).then((res) => {
          state.isLoading = false
          onCancel()
        })
      }
    })
  }
}

const toTarget = () => {
  Taro.navigateTo({
    url: '/pages/subpages/detailTarget/index?id=' + state.task.GrTargetId,
  })
}
</script>
