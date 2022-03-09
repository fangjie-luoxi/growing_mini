<template>
  <view>
    <nut-cell
      v-for="item in state.targets"
      :key="item.Id"
      :title="item.TtTitle"
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
      </template>
    </nut-cell>
  </view>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import Taro from "@tarojs/taro";
import moment from 'moment'

import { updata, getList, create } from '@/services/api'

import "./index.scss";

const props = defineProps({
  userId: Number
})

const emit = defineEmits(['change'])

const state = reactive({
  msg: 'demo',
  targets: []
});

onMounted(() => {
  getData()
})

const getData = () => {
  const tnStr = moment().format("YYYY-MM-DD")
  // "UserId:" + props.userId + ",Begin__gte:" + moment().format("YYYY-MM-DD") + ",End__lte:" + moment().format("YYYY-MM-DD"),
  getList("gr_target", { query: "UserId:" + props.userId + ",Begin__lte:" + tnStr + ",End__gte:" + tnStr, order_by: "UpdatedAt desc", limit: -1 }).then(
    (res) => {
      if (res.success) {
        state.targets = res.data
      }
    }
  )
}

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

const isDisabled = (item) => {
  let disabled = false
  if (item.Status === "s") {
    disabled = true
  }
  return disabled
}

const onJump = (id) => {
  Taro.navigateTo({
    url: '/pages/subpages/detailTarget/index?id=' + id,
  })
}

const onFinish = (item) => {
  item.loading = true
  create("rule/target/finish/" + item.Id).then(() => {
    item.loading = false
    getData()
    emit("change", item.Num)
  })
}

</script>
