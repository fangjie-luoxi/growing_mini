<template>
  <view>
    <nut-cell
      v-for="item in state.targets"
      :key="item.Id"
      :title="item.TtTitle"
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
  </view>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import Taro from "@tarojs/taro";
import moment from 'moment'

import { getList } from '@/services/api'

import "./index.scss";

const props = defineProps({
  userId: Number
})

const state = reactive({
  msg: 'demo',
  targets: []
});

onMounted(() => {
  getList("gr_target", { query: "UserId:" + props.userId, limit: -1, order_by: "UpdatedAt desc" }).then(
    (res) => {
      if (res.success) {
        state.targets = res.data
      }
    }
  )
})

const getCellSubTitle = (item) => {
  return moment(item.Begin).format("MM-DD") + "~" + moment(item.End).format("MM-DD")
}

const getCellDesc = (item) => {
  let content = item.TtContent
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

const onClick = (id) => {
  Taro.navigateTo({
    url: '/pages/subpages/detailTarget/index?id=' + id
  })
}

</script>
