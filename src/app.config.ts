export default defineAppConfig({
  pages: ['pages/index/index', 'pages/manage/index', 'pages/my/index'],
  requiredBackgroundModes: ["audio"],
  tabBar: {
    color: '#444444',
    selectedColor: '#6190E8',
    backgroundColor: '#ffffff',
    list: [
      {
        pagePath: 'pages/index/index',
        iconPath: './assets/images/tabBar/home.png',
        selectedIconPath: './assets/images/tabBar/homed.png',
        text: '首页',
      },
      {
        pagePath: 'pages/manage/index',
        iconPath: './assets/images/tabBar/manage.png',
        selectedIconPath: './assets/images/tabBar/managed.png',
        text: '管理',
      },
      {
        pagePath: 'pages/my/index',
        iconPath: './assets/images/tabBar/me.png',
        selectedIconPath: './assets/images/tabBar/med.png',
        text: '我的',
      },
    ],
  },
  window: {
    backgroundTextStyle: 'dark',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
  },

  subPackages: [
    {
      root: 'pages/subpages',
      pages: [
        'user/index',
        'addRule/index',
        'addTask/index',
        'addTarget/index',

        'detailTask/index',
        'detailTarget/index',
        'detailRule/index',
      ],
    },
  ],
})
