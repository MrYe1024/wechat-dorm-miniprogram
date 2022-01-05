import { host } from '../url';
import { httpRequest } from '../request';

const testService = {
	/* 请求方法 */
	test: (params) => {
		return httpRequest(host, '/login', 'post', params);
	}

}

export { testService };