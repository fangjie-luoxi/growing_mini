<template>
  <view>
    <scroll-view style="height: 600px;" :scroll-y="true" scroll-top="50px" @scrolltolower="lower">
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
  </view>
</template>

<script setup>
import { reactive, onMounted, ref } from 'vue';
import Taro from "@tarojs/taro";
import moment from 'moment'

import { ScrollView } from '@tarojs/components'

import { getList } from '@/services/api'

import "./index.scss";

const props = defineProps({
  userId: Number
})

const state = reactive({
  tasks: []
});

const pageState = reactive({
  total: 0,
  current: 0,
  hasMore: true,
  load: false,
});

onMounted(() => {
  getData(0)
})


const getData = (offset) => {
  pageState.load = true
  getList("gr_task", { query: "UserId:" + props.userId, order_by: "Date desc", offset: offset }).then(
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

const lower = (e) => {
  if (pageState.hasMore) {
    getData(pageState.current)
  }
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

const onClick = (taskId) => {
  Taro.navigateTo({
    url: '/pages/subpages/detailTask/index?id=' + taskId,
  })
}

</script>
