<template>
  <view>
    <nut-cell
      v-for="item in state.rules"
      :key="item.Id"
      :title="item.ReName"
      :desc="getCellDesc(item)"
    >
      <template v-slot:link>
        <view class="cell-link">
          <nut-button
            :type="item.InType === 'i' ? 'info' : 'danger'"
            size="small"
            :loading="item.loading"
            @click="onFinish(item)"
          >{{ item.InType === 'i' ? '+ ' + item.Num : '- ' + item.Num }}</nut-button>
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

import { create, getList, updata } from '@/services/api'

import "./index.scss";

const props = defineProps({
  userId: Number
})

const emit = defineEmits(['change'])

const state = reactive({
  msg: 'demo',
  rules: []
});

onMounted(() => {
  getData()
})

const getData = () => {
  getList("gr_rule", { query: "UserId:" + props.userId, order_by: "UpdatedAt desc", limit: -1 }).then(
    (res) => {
      if (res.success) {
        state.rules = res.data
      }
    }
  )
}

const getCellDesc = (item) => {
  let content = item.Content
  if (content.length > 10) {
    content = content.slice(0, 10) + "..."
  }
  return content
}

const onJump = (id) => {
  Taro.navigateTo({
    url: '/pages/subpages/detailRule/index?id=' + id,
  })
}

const onFinish = (item) => {
  item.loading = true
  create("rule/rule/finish/" + item.Id).then(() => {
    item.loading = false
    getData()
    const num = item.InType === "i" ? item.Num : item.Num * -1
    emit("change", num)
  })
}

</script>
