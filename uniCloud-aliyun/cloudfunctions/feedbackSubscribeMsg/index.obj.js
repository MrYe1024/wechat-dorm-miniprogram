const wx = uniCloud.importObject('getAccessToken')

async function get_access_token() {
	const res = await wx.getAccessToken()
	return res.data
}

async function sendMessage(event) {
	const ACCESS_TOKEN = await get_access_token()
	const url = `https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=${ACCESS_TOKEN}`
	let params = {
		template_id: 'xdcaBq1COut3fsO_YvmrvQKYrgDrKmMaR-EwbmvH-VU',
		page: 'pages/index/index',
		touser: event.openid,
		data: {
			thing6: {
				value: event.dorm // 报修宿舍
			},
			thing3: {
				value: event.status // 报修状态
			},
			thing1: {
				value: event.name // 联系人
			},
			phone_number2: {
				value: event.phone // 联系方式
			},
			thing9: {
				value: event.remarks // 备注
			}
		},
		miniprogram_state: 'formal', // developer为开发版；trial为体验版；formal为正式版；默认为正式版
		lang: 'zh_CN'
	}
	const res = await uniCloud.httpclient.request(url, {
		method: 'POST',
		data: {
			...params
		},
		contentType: 'json',
		dataType: 'json'
	})
	console.log(res)
}

module.exports = {
	async sendMessage(params) {
		return await sendMessage(params)
	}
}
