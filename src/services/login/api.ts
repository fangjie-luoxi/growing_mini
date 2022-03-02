// @ts-ignore
/* eslint-disable */
import Taro from '@tarojs/taro'

import { request } from '../api'

import { upCurrentUser } from '../user/index'

// handleLogin 处理登录
export const handleLogin = () => {
  Taro.login({
    success: function (res) {
      if (res.code) {
        login({
          LoginCode: res.code,
          Password: '',
          LoginType: 'mini',
        }).then(() => {
          upCurrentUser()
        })
      }
    },
  })
}

/** 登录接口 POST /api/login */
export async function login(body: LoginAPI.LoginParams) {
  return request('/login', {
    method: 'POST',
    data: body,
  })
}

/** 注册接口 POST /api/register */
export async function register(body: LoginAPI.RegisterParams) {
  return request('/register', {
    method: 'POST',
    data: body,
  })
}

/** 退出登录接口 POST /api/logout*/
export async function outLogin() {
  return request('/logout')
}
