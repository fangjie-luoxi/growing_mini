import Taro from '@tarojs/taro'

import { request } from '../api'

export type userType = {
  Id?: number //
  CreatedAt?: string //
  UpdatedAt?: string //
  SysOrgId?: number //
  LoginCode?: string //
  UserCode?: string //
  UserName?: string // 用户名
  Phone?: string //
  Avatar?: string //
  Email?: string //
  UserType?: string //
  Status?: string //
  LastLoginTime?: string // 最后登录时间
  Address?: string // 地址
  Profile?: string // 个人简介
  Sex?: string // 性别 enum:b:男,g:女,s:保密#
  CardNo?: string // 身份证
  Birth?: string // 生日
}

// 更新当前用户信息
export async function upCurrentUser() {
  getUser().then((userInfo) => {
    if (userInfo.data.success) {
      Taro.setStorageSync('userInfo', userInfo.data.data)
    }
  })
}

export function getCurrentUser(): userType {
  return Taro.getStorageSync('userInfo')
}

export async function getUserInfo() {
  request('/login_user', {
    method: 'GET',
    data: { resp: 'antd' },
  })
}

/** 获取当前的用户 GET /api/currentUser */
function getUser() {
  return request('/login_user', {
    method: 'GET',
    data: { resp: 'antd' },
  })
}
