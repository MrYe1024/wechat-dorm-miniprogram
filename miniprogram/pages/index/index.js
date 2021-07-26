import {
  floor
} from '../../config/config.default';
const db = wx.cloud.database();
const limit = 20;
let tabsIndex = 0;
let floorIndex = 0;
var interstitialAd = null;

Page({

  data: {
    tabList: [{
      name: '当前未处理',
      status: '未处理'
    }, {
      name: '当前已处理',
      status: '已处理'
    }],
    floorList: floor,
    applyData: [],
  },

  onLoad: function (options) {
    this.getOpenid();
    this.onShareMessage();
    this.getApplyData();
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: 'adunit-40082f65d4929d84'
      })
      interstitialAd.onLoad(() => {})
      interstitialAd.onError((err) => {})
      interstitialAd.onClose(() => {})
    }
    if (options.id === 'success') {
      // 在适合的场景显示插屏广告
      if (interstitialAd) {
        interstitialAd.show().catch((err) => {
          console.error(err)
        })
      }
    }
  },

  onShareAppMessage: function () {
    return {
      title: this.data.shareData.title,
      path: this.data.shareData.path,
      imageUrl: this.data.shareData.imageUrl,
      success: res => {
        console.log(res)
      },
      fail: err => {
        console.log(err)
      }
    }
  },

  /* 触底刷新 */
  onReachBottom: function () {
    !this.data.isEndOfList && this.getApplyData();
  },

  /* 选择状态 */
  selectStatus(e) {
    const {
      index
    } = e.detail;
    tabsIndex = index;
    this.setData({
      applyData: []
    })
    this.getApplyData();
    // 在适合的场景显示插屏广告
    if (interstitialAd) {
      interstitialAd.show().catch((err) => {
        console.error(err)
      })
    }
  },

  /* 选择栋数 */
  selectFloor(e) {
    const {
      index
    } = e.detail;
    floorIndex = index;
    if (index === 0) {
      this.setData({
        applyData: []
      })
      this.getApplyData();
    } else {
      this.getApplyDataItem(floorIndex);
    }
  },

  /* 获取申报数据 */
  async getApplyData() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    const res = await db.collection('c_apply').orderBy('createTime', 'desc').where({
      status: this.data.tabList[tabsIndex].status,
      floor: floorIndex === 0 ? {} : floorIndex
    }).skip(this.data.applyData.length).get();
    this.setData({
      applyData: [...this.data.applyData, ...res.data],
      isEndOfList: res.data.length < limit ? true : false
    })
    wx.hideLoading();
  },

  /* 选择栋数获取申报数据 */
  async getApplyDataItem(floor) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    await db.collection('c_apply').orderBy('createTime', 'desc').where({
      floor: floor,
      status: this.data.tabList[tabsIndex].status
    }).get().then(res => {
      this.setData({
        applyData: res.data
      })
      wx.hideLoading();
    }).catch(err => {
      console.log(err)
    })
  },

  /* 跳转申报页 */
  toPublish() {
    wx.navigateTo({
      url: '../publish/publish'
    })
  },

  /* 跳转管理页 */
  toAdmin() {
    if (this.data.isAdmin) {
      wx.requestSubscribeMessage({
        tmplIds: ['4Lnbo47VBu7woS0m0O8UjZ-7TBozETC4Mr5tdkwJ4v4'],
      })
      wx.navigateTo({
        url: '../admin/admin'
      })
    } else {
      wx.showToast({
        title: '暂无权限',
        icon: 'error',
        duration: 1000
      })
    }
  },

  /* 获取用户的openid */
  getOpenid() {
    wx.cloud.callFunction({
      name: 'login'
    }).then(res => {
      console.log("openid:",res.result.openid);
      this.getUserRole(res.result.openid);
      this.setData({
        openid: res.result.openid
      })
    }).catch(err => {
      console.log(err);
    })
  },

  /* 获取角色列表 */
  getUserRole(openid) {
    db.collection('c_role').get().then(res => {
      const openidList = res.data.map((item) => {
        if (item.role === '超级管理员') {
          wx.setStorageSync('admin', item)
        }
        return item.openid;
      })
      const isAdmin = openidList.includes(openid);
      this.setData({
        isAdmin
      })
    })
  },

  /* 查看申报表 */
  navDetail(e) {
    const {
      id
    } = e.currentTarget.dataset
    wx.navigateTo({
      url: '../detail/detail?id=' + id
    })
  },

  /* 获取分享数据 */
  onShareMessage() {
    db.collection('c_share').get().then(res => {
      this.setData({
        shareData: res.data[0]
      })
    })
  },

})