<template>
  <nut-form :model-value="state.rule" ref="ruleForm">
    <nut-form-item
      label="标题"
      required
      prop="ReName"
      :rules="[{ required: true, message: '请填写标题' }]"
    >
      <input
        :disabled="state.readonly"
        class="nut-input-text"
        type="text"
        v-model="state.rule.ReName"
      />
    </nut-form-item>
    <nut-form-item label="内容" prop="Content">
      <nut-textarea
        type="text"
        rows="1"
        limit-show
        autosize
        max-length="255"
        v-model="state.rule.Content"
        :disabled="state.readonly"
      />
    </nut-form-item>
    <nut-form-item label="积分规则" prop="InType" :rules="[{ required: true, message: '请选择积分规则' }]">
      <nut-radiogroup v-model="state.rule.InType" direction="horizontal">
        <nut-radio :disabled="state.readonly" label="i">增加</nut-radio>
        <nut-radio :disabled="state.readonly" label="o">扣除</nut-radio>
      </nut-radiogroup>
    </nut-form-item>

    <nut-form-item label="积分" required prop="Num" :rules="[{ required: true, message: '请填写积分' }]">
      <nut-inputnumber :disabled="state.readonly" v-model="state.rule.Num" />
    </nut-form-item>
    <nut-form-item label="备注" prop="Rm">
      <input :disabled="state.readonly" class="nut-input-text" type="text" v-model="state.rule.Rm" />
    </nut-form-item>

    <nut-cell>
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
  </nut-form>
  <nut-cell-group title="触发记录">
    <scroll-view style="height: 500px;" :scroll-y="true" scroll-top="50px" @scrolltolower="lower">
      <nut-cell v-for="item in state.rules" :key="item.Id" :desc="getCellDesc(item)"></nut-cell>
    </scroll-view>
  </nut-cell-group>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import Taro from "@tarojs/taro";
import moment from 'moment'

import { getCurrentUser } from '@/services/user'
import { getOne, updata, getList } from '@/services/api'

import "./index.scss";

const id = Taro.getCurrentInstance().router.params.id

const state = reactive({
  rule: {},
  rules: [],

  readonly: true,
  submitType: false,
  isLoading: false,
})

const pageState = reactive({
  total: 0,
  current: 0,
  hasMore: true,
  load: false,
});

const ruleForm = ref(null);

onMounted(() => {
  getOne("gr_rule", id).then((res) => {
    if (res.success) {
      state.rule = res.data
    }
  })
  getData(0)
})

const getCellDesc = (item) => {
  return moment(item.Date).format("YYYY-MM-DD hh:mm:ss")
}

const getData = (offset) => {
  pageState.load = true
  getList("gr_rule_record", { query: "GrRuleId:" + id, order_by: "Date desc", offset: offset }).then(
    (res) => {
      pageState.load = false
      if (res.success) {
        state.rules.push(...res.data)
        pageState.total = res.total
        pageState.current = res.current * res.pageSize
        if (pageState.current >= pageState.total) {
          pageState.hasMore = false
        }
      }
    }
  )
}

const lower = (e) => {
  if (pageState.hasMore) {
    getData(pageState.current)
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
        updata("gr_rule", id, {
          ...state.rule
        }).then((res) => {
          state.isLoading = false
          onCancel()
        })
      }
    })
  }
}


</script>
