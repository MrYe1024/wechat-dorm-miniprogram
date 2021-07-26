const db = wx.cloud.database()

Page({

  onLoad: function (options) {
    const {
      id,
      admin
    } = options;
    this.getApplyDataItem(id)
    if (admin) {
      this.setData({
        admin
      })
    }
  },

  /* 申报详情 */
  getApplyDataItem(id) {
    db.collection('c_apply').where({
      _id: id
    }).get().then(res => {
      this.setData({
        data: res.data[0]
      })
    }).catch(err => {
      console.log(err)
    })
  },

  /* 一键联系 */
  callApplyPhone(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },

   /* 一键复制 */
   copyApplyPhone(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.phone,
    })
  },

})