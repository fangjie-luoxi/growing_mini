<template>
  <view>
    <nut-cell
      v-for="item in state.tasks"
      :key="item.Id"
      :title="item.TkTitle"
      :sub-title="getCellSubTitle(item)"
      :desc="getCellDesc(item)"
    >
      <template v-slot:link>
        <view class="cell-link">
          <nut-button
            type="info"
            size="small"
            :loading="item.loading"
            :disabled="isDisabled(item)"
            @click="onFinish(item)"
          >{{ isDisabled(item) ? "已完成" : "完成" }}</nut-button>

          <nut-icon @click="onJump(item.Id)" style="padding-right: 5px;" name="arrow-right"></nut-icon>
        </view>
        <!-- <nut-tag :type="getTagType(item)">{{ getTagName(item) }}</nut-tag> -->
      </template>
    </nut-cell>
  </view>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import Taro from "@tarojs/taro";
import moment from 'moment'

import { updata, getList } from '@/services/api'

import "./index.scss";

const props = defineProps({
  userId: Number
})

const emit = defineEmits(['change'])

const state = reactive({
  msg: 'demo',
  tasks: []
});

onMounted(() => {
  getData()
})

const getData = () => {
  getList("gr_task", { query: "UserId:" + props.userId + ",Date__like:" + moment().format("YYYY-MM-DD"), order_by: "Date desc" }).then(
    (res) => {
      if (res.success) {
        state.tasks = res.data
      }
    }
  )
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

const isDisabled = (item) => {
  let disabled = false
  if (item.Status === "s") {
    disabled = true
  }
  return disabled
}

const onJump = (id) => {
  Taro.navigateTo({
    url: '/pages/subpages/detailTask/index?id=' + id,
  })
}

const onFinish = (item) => {
  item.loading = true
  create("rule/task/finish/" + item.Id).then(() => {
    item.loading = false
    getData()
    emit("change", item.Num)
  })
}

</script>
