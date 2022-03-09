import { createApp } from 'vue'

import { handleLogin } from '@/services/login/api'

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
  onLaunch(options) {
    console.log('来源:', options.referrerInfo)
    // 用户登录
    handleLogin()
  },
  onShow(options) {},
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
