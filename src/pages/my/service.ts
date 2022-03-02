import { request } from '@/services/api'

/** 更新用户信息 */
export async function upUserInfo(
  id: number,
  userName: string,
  avatar: string,
) {
  return request('/system/user/' + id, {
    method: 'PUT',
    data: { UserName: userName, Avatar: avatar },
  })
}
