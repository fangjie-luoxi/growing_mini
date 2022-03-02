import Taro from '@tarojs/taro'

import { baseUrl } from '@/src/config/index'

type dataType = {
  data?: object
  contentType?: string
  method?: string
}

type OptionType = {
  url: string
  data?: object | string
  method?: any
  header: object
  mode?: any
  credentials?: any
  success: any
  error: any
  xhrFields: object
}

// request 简单封装
export function request(url: string, params?: dataType) {
  const setCookie = (res: {
    cookies: Array<{
      name: string
      value: string
      expires: string
      path: string
    }>
    header: {
      'Set-Cookie': string
    }
  }) => {
    if (res.cookies && res.cookies.length > 0) {
      // console.info("res ===>", res)
      let cookies = ''
      res.cookies.forEach((cookie, index) => {
        // windows的微信开发者工具返回的是cookie格式是有name和value的,在mac上是只是字符串的
        if (cookie.name && cookie.value) {
          cookies +=
            index === res.cookies.length - 1
              ? `${cookie.name}=${cookie.value};expires=${cookie.expires};path=${cookie.path}`
              : `${cookie.name}=${cookie.value};`
        } else {
          cookies += `${cookie}`
        }
      })
      Taro.setStorageSync('cookies', cookies)
    }
  }

  const option: OptionType = {
    url: url.indexOf('http') !== -1 ? url : baseUrl + url,
    data: params?.data,
    method: params?.method,
    header: {
      'content-type': params?.contentType,
      cookie: Taro.getStorageSync('cookies'),
    },
    credentials: 'same-origin',
    mode: 'cors',
    xhrFields: { withCredentials: true },
    success(res) {
      setCookie(res)
      if (res.statusCode === 400) {
        return console.log('api', '请求资源不存在')
      } else if (res.statusCode === 500) {
        return console.log('api', '服务端出现了问题')
      } else if (res.statusCode === 401) {
        return console.log('api', '没有权限访问')
      } else if (res.statusCode === 301) {
        Taro.clearStorage()
        Taro.navigateTo({
          url: '/pages/packageA/pages/login/index',
        })
        return console.log('api', '请先登录')
      } else if (res.statusCode >= 200 && res.statusCode < 300) {
        return res.data
      }
    },
    error(e) {
      console.log('api', '请求接口出现问题', e)
    },
  }
  // eslint-disable-next-line
  return Taro.request(option)
}
