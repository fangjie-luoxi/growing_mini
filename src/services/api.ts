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

type QueryType = {
  query?: string // 条件查询 格式: 字段1:值1,字段2:值2 eg: Id:1,Post.Id:2
  or?: string // 或查询 格式: 字段1:值1,字段2:值2 eg: Id:1,Post.Id:2
  not?: string // not条件查询 格式: 字段1:值1,字段2:值2 eg: Id:1,Post.Id:2
  select?: string // 选择的字段 格式: 字段1,字段2
  fields?: string // 返回的字段 格式: 字段1,字段2
  sortby?: string // 排序的字段 格式: 字段1,字段2
  order?: string // 排序的方式 enum:desc:降序,asc:升序
  order_by?: string // 排序 格式: 字段1 desc,字段2 asc
  load?: string // 加载关联  格式: 关联字段1,关联字段2 eg: User,Posts
  limit?: number // 返回的数据量
  page?: number // 是否返回分页数据
  offset?: number // 偏移量
  getcounts?: number // 只返回数量
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

// getDataById通过id获取数据
export async function getOne(tableName: string, id: number, param?: any) {
  const res = await request(baseUrl + '/' + tableName + '/' + id, {
    data: param,
  })
  return res.data
}

// getDataList 获取数据
export async function getList(tableName: string, param?: QueryType) {
  const res = await request(baseUrl + '/' + tableName, { data: param })
  return res.data
}

// create 创建
export async function create(tableName: string, param?: any) {
  const res = await request(baseUrl + '/' + tableName, {
    data: param,
    method: 'POST',
  })
  return res.data
}

// updata 修改
export async function updata(tableName: string, id: number, param?: any) {
  const res = await request(baseUrl + '/' + tableName + '/' + id, {
    data: param,
    method: 'PUT',
  })
  return res.data
}

// deleteById 删除
export async function deleteById(tableName: string, id: number) {
  const res = await request(baseUrl + '/' + tableName + '/' + id, {
    method: 'DELETE',
  })
  return res.data
}

// deletes 删除多个
export async function deletes(tableName: string, ids: number[]) {
  const res = await request(baseUrl + '/' + tableName, {
    data: { Ids: ids },
    method: 'POST',
  })
  return res.data
}
