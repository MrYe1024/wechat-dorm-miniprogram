const wx = uniCloud.importObject('getAccessToken')

async function get_access_token() {
	const res = await wx.getAccessToken()
	return res.data
}

async function sendMessage(event) {
	const ACCESS_TOKEN = await get_access_token()
	const url = `https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=${ACCESS_TOKEN}`
	let params = {
		template_id: '4Lnbo47VBu7woS0m0O8UjZ-7TBozETC4Mr5tdkwJ4v4',
		page: 'pages/index/index',
		touser: event.openid,
		data: {
			name1: {
				value: event.name // 报修人
			},
			thing5: {
				value: event.dorm // 报修宿舍
			},
			thing8: {
				value: event.desc // 报修内容
			},
			phone_number3: {
				value: event.phone // 联系方式
			},
			date4: {
				value: event.createTime // 报修时间
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
	async sendMessage (params) {
		return await sendMessage(params)
	}
}
