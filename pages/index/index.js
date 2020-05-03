//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    imgSrc: ''
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: 'Happy Beauty',
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  chooseImg() {
    let that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths[0];
        that.setData({
          imgSrc: tempFilePaths
        });
        that.getBeauty();
      }
    })
  },
  getBeauty() {
    let tempFilePath = this.data.imgSrc;
    let imgbase = wx.getFileSystemManager().readFileSync(tempFilePath, 'base64');
    let that = this;
    wx.request({
      url: 'https://aip.baidubce.com/rest/2.0/face/v3/detect',
      method: 'POST',
      data: {
        image: imgbase,
        image_type: "BASE64",
        access_token: '24.36c8a3f0a078a371b8fa272e0896413d.2592000.1591110050.282335-19709957',
        face_field: "age,beauty"
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success(res) {

      }
    })
  }
})