<template>
  <view>
    <nut-cell
      v-for="item in state.rules"
      :key="item.Id"
      :title="item.ReName"
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

import { getList } from '@/services/api'

import "./index.scss";

const props = defineProps({
  userId: Number
})

const state = reactive({
  msg: 'demo',
  rules: []
});

onMounted(() => {
  getList("gr_rule", { query: "UserId:" + props.userId, order_by: "UpdatedAt desc", limit: -1 }).then(
    (res) => {
      if (res.success) {
        state.rules = res.data
      }
    }
  )
})

const getCellDesc = (item) => {
  let content = item.Content
  if (content.length > 10) {
    content = content.slice(0, 10) + "..."
  }
  return content
}

const getTagType = (item) => {
  let tagName = "primary"
  if (item.InType === "i") {
    tagName = "success"
  }
  if (item.InType === "r") {
    tagName = "warning"
  }
  if (item.InType === "o") {
    tagName = "danger"
  }
  return tagName
}

const getTagName = (item) => {
  let tagName = "增加"
  if (item.InType === "i") {
    tagName = "增加"
  }
  if (item.InType === "o") {
    tagName = "扣除"
  }
  if (item.InType === "n") {
    tagName = "未完成"
  }

  return tagName
}

const onClick = (id) => {
  Taro.navigateTo({
    url: '/pages/subpages/detailRule/index?id=' + id
  })
}

</script>
