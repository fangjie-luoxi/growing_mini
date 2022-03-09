<template>
  <nut-datepicker
    v-model:visible="state.showDate"
    :min-date="today"
    :is-show-chinese="false"
    v-model="today"
    @confirm="confirm"
  ></nut-datepicker>
  <nut-form :model-value="state.target" ref="ruleForm">
    <nut-form-item
      label="开始日期"
      required
      prop="Begin"
      :rules="[{ required: true, message: '请填写目标开始日期' }]"
    >
      <view
        class="nut-input-text"
        @tap="openDate('begin')"
      >{{ moment(state.target.Begin).format('YYYY-MM-DD') }}</view>
    </nut-form-item>
    <nut-form-item
      label="结束日期"
      required
      prop="End"
      :rules="[{ required: true, message: '请填写目标结束日期' }]"
    >
      <view
        class="nut-input-text"
        @tap="openDate('end')"
      >{{ moment(state.target.End).format('YYYY-MM-DD') }}</view>
    </nut-form-item>
    <nut-form-item label="生成任务" prop="GenTask">
      <nut-radiogroup v-model="state.target.GenTask" direction="horizontal">
        <nut-radio :disabled="state.readonly" label="y">生成</nut-radio>
        <nut-radio :disabled="state.readonly" label="n">不生成</nut-radio>
      </nut-radiogroup>
    </nut-form-item>
    <nut-form-item
      label="标题"
      required
      prop="TtTitle"
      :rules="[{ required: true, message: '请填写标题' }]"
    >
      <input
        :disabled="state.readonly"
        class="nut-input-text"
        type="text"
        v-model="state.target.TtTitle"
      />
    </nut-form-item>
    <nut-form-item label="内容" prop="TtContent">
      <nut-textarea
        :disabled="state.readonly"
        type="text"
        rows="1"
        limit-show
        autosize
        max-length="255"
        v-model="state.target.TtContent"
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
        type="text"
        v-model="state.target.TtUnit"
      />
    </nut-form-item>
    <nut-form-item
      label="计量"
      required
      prop="TtNum"
      :rules="[{ required: true, message: '请填写请计量' }]"
    >
      <nut-inputnumber :disabled="state.readonly" v-model="state.target.TtNum" />
    </nut-form-item>
    <nut-form-item label="预计日任务量" prop="taskNum" v-if="state.target.GenTask === 'y'">
      <view class="nut-input-text">{{ getPredict() }}</view>
    </nut-form-item>
    <nut-form-item
      label="获得积分"
      required
      prop="Num"
      :rules="[{ required: true, message: '请填写获得积分' }]"
    >
      <nut-inputnumber :disabled="state.readonly" v-model="state.target.Num" />
    </nut-form-item>
    <nut-form-item label="备注" prop="Rm">
      <input
        :disabled="state.readonly"
        class="nut-input-text"
        type="text"
        v-model="state.target.Rm"
      />
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

  <nut-cell-group title="任务记录">
    <scroll-view style="height: 500px;" :scroll-y="true" scroll-top="50px" @scrolltolower="lower">
      <nut-cell
        v-for="item in state.tasks"
        :key="item.Id"
        :title="item.TkTitle"
        :sub-title="getCellSubTitle(item)"
        :desc="getCellDesc(item)"
        @click="onClick(item.Id)"
      >
        <template v-slot:link>
          <view class="cell-link">
            <nut-tag :type="getTagType(item)">{{ getTagName(item) }}</nut-tag>
          </view>
        </template>
      </nut-cell>
    </scroll-view>
  </nut-cell-group>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import Taro from "@tarojs/taro";
import { getCurrentUser } from '@/services/user'
import moment from 'moment'

import { getOne, updata, getList } from '@/services/api'

import "./index.scss";

const id = Taro.getCurrentInstance().router.params.id

const today = new Date()

const state = reactive({
  tasks: [],
  target: {},
  taskNum: 0,

  showDate: false,
  dateTp: "begin",

  readonly: true,
  submitType: false,
  isLoading: false,
})

const pageState = reactive({
  total: 0,
  current: 0,
  hasMore: false,
  load: false,
});

const ruleForm = ref(null);

onMounted(() => {
  getOne("gr_target", id).then((res) => {
    if (res.success) {
      state.target = res.data
    }
  })
  getData(0)
})

const getPredict = () => {
  return moment(state.target.End).diff(moment(state.target.Begin), "days") / state.target.TtNum
}

const getData = (offset) => {
  pageState.load = true
  getList("gr_task", { query: "GrTargetId:" + id, order_by: "Date desc", offset: offset }).then(
    (res) => {
      pageState.load = false
      if (res.success) {
        state.tasks.push(...res.data)
        pageState.total = res.total
        pageState.current = res.current * res.pageSize
        if (pageState.current >= pageState.total) {
          pageState.hasMore = false
        }
      }
    }
  )
}

const getTagType = (item) => {
  let tagName = "primary"
  if (item.Status === "s") {
    tagName = "success"
  }
  if (item.Status === "r") {
    tagName = "warning"
  }
  if (item.Status === "n") {
    tagName = "danger"
  }
  return tagName
}

const getTagName = (item) => {
  let tagName = "未开始"
  if (item.Status === "s") {
    tagName = "已完成"
  }
  if (item.Status === "r") {
    tagName = "进行中"
  }
  if (item.Status === "n") {
    tagName = "未完成"
  }

  return tagName
}

const getCellSubTitle = (item) => {
  return moment(item.Date).format("YYYY-MM-DD")
}

const getCellDesc = (item) => {
  let content = item.TkContent
  if (content.length > 10) {
    content = content.slice(0, 10) + "..."
  }
  return content
}

const confirm = (res) => {
  if (state.dateTp === "begin") {
    state.target.Begin = moment(res.join('-'));
  } else {
    state.target.End = moment(res.join('-'));
  }
}

const openDate = (dateTp) => {
  state.dateTp = dateTp
  state.showDate = true
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
          ...state.target
        }).then((res) => {
          state.isLoading = false
          onCancel()
        })
      }
    })
  }
}

const onClick = (taskId) => {
  Taro.navigateTo({
    url: '/pages/subpages/detailTask/index?id=' + taskId,
  })
}

</script>
