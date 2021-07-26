import {
  icon
} from '../../config/config.default';
import { moment } from '../../utils/moment';
const db = wx.cloud.database();

Page({

  data: {
    level: '普通维修',
    levelIcon: icon.ordinary,
    pickerList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
  },

  onLoad: function() {
    
  },

  /* 申报人 */
  setName(e) {
    this.setData({
      name: e.detail.value
    })
  },

  /* 选择栋数 */
  selectFloor(e) {
    this.setData({
      floor: this.data.pickerList[Number(e.detail.value)]
    })
  },

  /* 设置宿舍 */
  setDormNum(e) {
    this.setData({
      dorm: e.detail.value
    })
  },

  /* 联系电话 */
  setPhone(e) {
    this.setData({
      phone: e.detail.value
    })
  },

  /* 申报描述 */
  setDesc(e) {
    this.setData({
      desc: e.detail.value
    })
  },

  /* 选择维修级别 */
  selectLevel(e) {
    if (e.detail === '紧急维修') {
      this.setData({
        levelIcon: icon.press
      })
    } else {
      this.setData({
        levelIcon: icon.ordinary
      })
    }
    this.setData({
      level: e.detail
    })
  },

  clickLevel(e) {
    if (e.currentTarget.dataset.level === '紧急维修') {
      this.setData({
        levelIcon: icon.press
      })
    } else {
      this.setData({
        levelIcon: icon.ordinary
      })
    }
    this.setData({
      level: e.currentTarget.dataset.level
    })
  },

  /* 提交申报表 */
  inApplyData() {
    wx.requestSubscribeMessage({
      tmplIds: ['xdcaBq1COut3fsO_YvmrvQKYrgDrKmMaR-EwbmvH-VU'],
    })
    if (this.validate()) {
      wx.showLoading({
        title: '正在提交...',
        mask: true
      })
      db.collection('c_apply').add({
        data: {
          name: this.data.name.trim(),
          floor: this.data.floor,
          dorm: this.data.dorm,
          phone: this.data.phone,
          desc: this.data.desc.trim(),
          level: this.data.level,
          levelIcon: this.data.levelIcon,
          status: '未处理',
          createTime: moment('YYYY-MM-DD hh:mm:ss'),
        }
      }).then(res => {
        wx.hideLoading();
        wx.showToast({
          title: '提交成功',
          duration: 1000
        })
        this.sendApplyNotice();
        wx.reLaunch({
          url: '../index/index?id=success',
        })
      }).catch(err => {
        console.log(err)
      })
    }
  },

  /* 发送报修订单提醒 */
  sendApplyNotice() {
    wx.cloud.callFunction({
      name: 'applyNotice',
      data: {
        name: this.data.name,
        dorm: this.data.floor + '栋' + this.data.dorm,
        desc: this.data.desc.substr(0, 16) + '...',
        phone: this.data.phone,
        createTime: moment('YYYY-MM-DD hh:mm:ss'),
        templateId: '4Lnbo47VBu7woS0m0O8UjZ-7TBozETC4Mr5tdkwJ4v4',
        openid: wx.getStorageSync('admin').openid
      }
    }).then(res => {
      console.log(res);
    })
  },

  /* 申报表单验证 */
  validate() {
    let cp = /[1][3,4,5,7,8][0-9]{9}$/;
    if (this.data.name === '' || !this.data.name) {
      wx.showToast({
        title: '请填写申报人',
        icon: 'error',
        duration: 500
      })
      return false;
    }
    if (this.data.floor === '' || !this.data.floor) {
      wx.showToast({
        title: '请选择栋数',
        icon: 'error',
        duration: 500
      })
      return false;
    }
    if (this.data.dorm === '' || !this.data.dorm) {
      wx.showToast({
        title: '请填写宿舍',
        icon: 'error',
        duration: 500
      })
      return false;
    }
    if (this.data.phone === '' || !this.data.phone) {
      wx.showToast({
        title: '请填写手机号码',
        icon: 'error',
        duration: 500
      })
      return false;
    }
    if (!cp.test(this.data.phone)) {
      wx.showToast({
        title: '请填写正确手机号',
        icon: 'error',
        duration: 500
      })
      return false;
    }
    if (this.data.desc === '' || !this.data.desc) {
      wx.showToast({
        title: '请说明情况',
        icon: 'error',
        duration: 500
      })
      return false;
    }
    return true;
  }

})