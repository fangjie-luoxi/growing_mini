// @ts-ignore
/* eslint-disable */

declare namespace LoginAPI {
  // 用户信息
  type User = {
    Id?: number; //
    CreatedAt?: string; //
    UpdatedAt?: string; //
    SysOrgId?: number; //
    LoginCode?: string; //
    UserCode?: string; //
    UserName?: string; // 用户名
    Phone?: string; //
    Avatar?: string; //
    Email?: string; //
    UserType?: string; //
    Status?: string; //
    LastLoginTime?: string; // 最后登录时间
    Address?: string; // 地址
    Profile?: string; // 个人简介
    Sex?: string; // 性别 enum:b:男,g:女,s:保密#
    CardNo?: string; // 身份证
    Birth?: string; // 生日
  };
  // 登录参数
  type LoginParams = {
    LoginCode: string; // 登录账号
    Password?: string; // 密码
    LoginType?: string; // 登录类型 enum:psw:密码登录,qw:企业微信扫码登录,wc:微信扫码登录,mini:小程序扫码登录# 默认psw
  };

  // 注册参数
  type RegisterParams = {
    LoginCode?: string; // 登录账号
    Password?: string; // 密码
    UserName?: string; // 密码
    Phone?: string; // 手机号码
    Email?: string; // 邮箱
  };

  // 登录返回
  type LoginResult = {
    code?: number;
    token?: string;
    expire?: string;
    user?: User;
  };
}
