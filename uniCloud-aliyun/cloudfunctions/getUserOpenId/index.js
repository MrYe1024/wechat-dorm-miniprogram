'use strict';
var https = require('https');

let access = ''

const getUserOpenId = (code) => {
	const appid = 'wx7273f8f3dff4386d'
	const secret = 'e78d5d1eb374b5ca9526f03da8342cef'
	const js_code = code
	const grant_type = 'authorization_code'
	const query = `appid=${appid}&secret=${secret}&js_code=${js_code}&`
	return new Promise((resolve, reject) => {
		https.get({
				hostname: 'api.weixin.qq.com',
				path: '/sns/jscode2session?' + query,
				agent: false
			},
			function(res) {
				res.on('data', (d) => { //接收流数据
					access = d;
				});
				res.on('end', () => { //数据接收完毕
					resolve(access.toString())
				});
			}
		);
	})
}

exports.main = async (event, context) => {
	//返回数据给客户端
	const result = await getUserOpenId(event.code)
	return JSON.parse(result)
};
