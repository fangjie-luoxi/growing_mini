import { request } from '@/services/api'

import { baseUrl } from '@/src/config'

// 获取音乐
export function getMusic(): string {
  return baseUrl + '/static/music/我的答案.mp3'
}

// 获取用户积分
export async function getUser(userId: number) {
  return request('/user/' + userId)
}
