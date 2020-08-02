const cloud = require('wx-server-sdk')

cloud.init()

exports.main = async (event, context) => {
  let { OPENID } = cloud.getWXContext()
  let dorm = event.dorm
  let touser = OPENID
  if(event.openid){
    touser = event.openid
  }
  const template_id = 'xdcaBq1COut3fsO_YvmrvQKYrgDrKmMaR-EwbmvH-VU'
  try {
    const result = await cloud.openapi.subscribeMessage.send({
        touser: touser,
        page: '/pages/index/index',
        lang: 'zh_CN',
        data: {
          thing6: {
            value: dorm
          },
          thing3: {
            value: event.status
          },
          thing1: {
            value: event.name
          },
          phone_number2: {
            value: event.phone
          },
          thing9:{
            value:event.other
          }
        },
        templateId: template_id
      })
    return result
  } catch (err) {
    return err
  }
}