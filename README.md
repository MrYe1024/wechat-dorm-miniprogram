## 初始化项目
npm install
## 组件库
使用官方uni-ui、组件文档[](https://uniapp.dcloud.net.cn/component/uniui/uni-ui.html)
## 项目结构
- components自定义组件
- pages页面
- store状态管理
- service请求封装
- static静态文件
## APP打包上线注意事项
1. 频繁获取权限信息（Android平台应用启动时读写手机存储、访问设备信息(如IMEI)等权限策略及提示信息）
解决参考[](https://ask.dcloud.net.cn/article/36549)
uni-app项目在 "app-plus" -> "distribute" -> "android" 节点下添加 permissionPhoneState 节点，request值如下:
- none
应用启动时不申请
- once
应用第一次启动时申请，用户可以拒绝
- always
应用每次启动都申请，并且用户必须允许，用户拒绝时会弹出以下提示框引导用户重新允许

```
"permissionPhoneState" : {
	"request" : "none",
	"prompt" : "为保证您正常、安全地使用，需要获取设备识别码（部分手机提示为获取手机号码）使用权限，请允许"
},
"permissionExternalStorage" : {
	"request" : "none",
	"prompt" : "应用保存运行状态等信息，需要获取读写手机存储（系统提示为访问设备上的照片、媒体内容和文件）权限，请允许。"
}
```