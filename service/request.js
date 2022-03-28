const httpRequest = (host, path, method, params) => {
	return new Promise((resolve, reject) => {
		uni.request({
			method: method,
			url: `${host}${path}`,
			data: params,
			header: {
				"content-type": "application/json",
				"Authorization": uni.getStorageSync('token'),
			},
			success: (res) => {
				resolve(res);
			},
			fail: (err) => {
				uni.showToast({
					title: '请求服务器出错',
					icon: 'error',
					duration: 1500
				})
				console.log(err);
				reject('请求失败');
			}
		})
	})
}

export {
	httpRequest
}
