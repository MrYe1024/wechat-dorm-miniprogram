// 获取小程序全局唯一后台接口调用凭据
async function getAccessTokenHttp () {
	const grant_type = 'client_credential'
	const appid = 'wx7273f8f3dff4386d'
	const secret = 'e78d5d1eb374b5ca9526f03da8342cef'
	const res = await uniCloud.httpclient.request('https://api.weixin.qq.com/cgi-bin/token', {
		method: 'GET',
		data: {
			grant_type,
			appid,
			secret
		},
		contentType: 'json', // 指定以application/json发送data内的数据
		dataType: 'json'
	})
	if (res.status === 200) {
		return {
			status: 200,
			data: res.data.access_token,
			msg: 'success',
			success: true
		}
	}
	return {
		data: {
			status: 500,
			data: res.data,
			msg: 'fail',
			success: false
		}
	}
}

module.exports = {
	getAccessToken () {
		return getAccessTokenHttp()
	}
}
