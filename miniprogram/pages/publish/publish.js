const app = getApp()
import { icon_url } from '../../common/api.js'
const db = wx.cloud.database()
const _ = db.command

Page({

  data: {
    radio: '普通维修',
    icon:icon_url.ordinary_icon 
  },

  onLoad: function (options) {

  },

  // 状态选择
  statusChoose(e) {
    if (e.detail === '紧急维修') {
      this.setData({
        icon: icon_url.press_icon
      })
    }else {
      this.setData({
        icon: icon_url.ordinary_icon
      })
    }
    this.setData({
      radio:e.detail
    })
  },

  // 申报表单数据
  getName(e) {
    this.setData({
      name: e.detail.value.trim()
    })
  },

  getBuilding(e) {
    this.setData({
      building: e.detail.value.replace(/\b(0+)/gi, "")
    })
  },

  getDormNum(e) {
    this.setData({
      dormNum: e.detail.value.replace(/\b(0+)/gi, "")
    })
  },

  getPhone(e) {
    this.setData({
      phone: e.detail.value
    })
  },

  getDetail(e) {
    this.setData({
      detail:e.detail.value
    })
  },

  // 提交申报表
  inApplyData() {
    this.verifyData((verify) => {
      if(verify) {
        db.collection('applyData').add({
          data: {
            name:this.data.name,
            dorm:this.data.building+'栋'+this.data.dormNum,
            phone:this.data.phone,
            detail:this.data.detail,
            tag:this.data.radio,
            status:'未处理',
            icon_url:this.data.icon,
            week:app.globalData.week,
            date:app.globalData.obj_date.date,
            month:app.globalData.obj_date.month
          }
        }).then(res => {
          wx.showToast({
            title: '提交成功',
            icon:'success',
            duration:1000,
            success:() => {
              let dorm = this.data.building+'栋'+this.data.dormNum
              wx.navigateTo({
                url: '../success/success?dorm='+dorm+'&submit'
              })
            }
          })
        }).catch(err => {
          console.log(err)
        })
      }
    })
  },

  // 申报表验证
  verifyData(callback) {
    let cp = /[1][3,4,5,7,8][0-9]{9}$/
    if (this.data.name === '' || this.data.name === undefined){
      wx.showToast({
        title: '请填写姓名',
        icon:'loading',
        duration:500
      })
      return false;
    }
    if (this.data.building === '' || this.data.building === undefined) {
      wx.showToast({
        title: '请填写栋数',
        icon: 'loading',
        duration: 500
      })
      return false;
    }
    if (this.data.dormNum === '' || this.data.dormNum === undefined) {
      wx.showToast({
        title: '请填写宿舍号',
        icon: 'loading',
        duration: 500
      })
      return false;
    }
    if (this.data.phone === '' || this.data.phone === undefined) {
      wx.showToast({
        title: '请填写手机',
        icon: 'loading',
        duration: 500
      })
      return false;
    }
    if (!cp.test(this.data.phone)){
      wx.showToast({
        title: '请填写正确手机号',
        icon: 'loading',
        duration: 500
      })
      return false;
    }
    if (this.data.detail === '' || this.data.detail === undefined) {
      wx.showToast({
        title: '请说明情况',
        icon: 'loading',
        duration: 500
      })
      return false;
    }
    callback(true)
  }

})