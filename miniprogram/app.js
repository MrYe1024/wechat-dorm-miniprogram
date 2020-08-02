App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'dorm-8svqc',
        traceUser: true
      })
    }
    this.globalData = {
      obj_date:this.getDate(),
      week:this.getWeek()
    }
  },
  getDate() {
    let date = new Date().toLocaleDateString()
    let years = new Date().getFullYear()
    let month = new Date().getMonth()+1
    let day = new Date().getDate()
    let obj_date = {
      date:years+'/' + month+'/'+day,
      month:years+'/' + month
    }
    return obj_date;
  },
  getWeek() {
    let week;
    if (new Date().getDay() == 0) week = "星期日"
    if (new Date().getDay() == 1) week = "星期一"
    if (new Date().getDay() == 2) week = "星期二"
    if (new Date().getDay() == 3) week = "星期三"
    if (new Date().getDay() == 4) week = "星期四"
    if (new Date().getDay() == 5) week = "星期五"
    if (new Date().getDay() == 6) week = "星期六"
    return week;
	}
})
