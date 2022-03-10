import { createApp } from 'vue'
import Taro from '@tarojs/taro'

import '@nutui/nutui-taro/dist/style.css'
import './app.scss'

import {
  Button,
  Toast,
  Swipe,
  Cell,
  Avatar,
  Icon,
  Layout,
  Row,
  Col,
  Dialog,
  Popup,
  OverLay,
  NoticeBar,
  Tabs,
  TabPane,
  FixedNav,
  Navbar,
  Form,
  FormItem,
  CellGroup,
  Input,
  InputNumber,
  TextArea,
  DatePicker,
  Picker,
  Switch,
  Tag,
  Radio,
  RadioGroup,
} from '@nutui/nutui-taro'

const App = createApp({
  onShow(options) {
    setTimeout(() => {
      const updateManager = Taro.getUpdateManager()
      updateManager.onCheckForUpdate((res) => {
        if (res.hasUpdate) {
          updateManager.onUpdateReady(() => {
            Taro.showModal({
              title: '更新提示',
              content: '检测到新版本, 是否下载新版本并重启小程序?',
              success: (res) => {
                if (res.confirm) {
                  updateManager.applyUpdate()
                }
              },
            })
          })
          updateManager.onUpdateFailed(() => {
            Taro.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
            })
          })
        }
      })
    }, 3000)
  },
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
})

App.use(Button)
  .use(Toast)
  .use(Swipe)
  .use(Cell)
  .use(Avatar)
  .use(Icon)
  .use(Layout)
  .use(Row)
  .use(Col)
  .use(Dialog)
  .use(Popup)
  .use(OverLay)
  .use(NoticeBar)
  .use(Tabs)
  .use(TabPane)
  .use(FixedNav)
  .use(Navbar)
  .use(Form)
  .use(FormItem)
  .use(CellGroup)
  .use(Input)
  .use(InputNumber)
  .use(TextArea)
  .use(DatePicker)
  .use(Picker)
  .use(Switch)
  .use(Tag)
  .use(Radio)
  .use(RadioGroup)

export default App
