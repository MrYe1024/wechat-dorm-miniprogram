import { testService } from '@/service/modules/test.js'

// 全局挂载请求
const http = {
	...testService
}

export { http }