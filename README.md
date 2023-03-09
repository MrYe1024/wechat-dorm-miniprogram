## 前言
本项目基于 `uniapp uniCloud` 云开发，简单易用，逻辑主要是云数据库的增删查改，页面大部分自写，部分使用`uniUI`, `uView` 组件库。大家可用于学习或者二次开发，有什么不懂的地方可联系 `wechat：MrYe443`。用于其他用途请注明一下原作者，谢谢大家。对了，项目里面插了点广告，不介意的话帮我点下，生活不易阿！！！！！！

## 项目地址
gitee开源  `https://gitee.com/aYuan-git/wechat-dorm-miniprogram.git`，共两个分支，`master` 分支为原生小程序云开发，`uniapp` 分支为 `uniCloud` 云开发，请拉取 `uniapp` 分支代码。
## 项目体验

![ssbx.jpg](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/404ad362a69146d991514276a13cd6c0~tplv-k3u1fbpfcp-watermark.image?)
## 注册 DCloud
注册地址 `https://unicloud.dcloud.net.cn/pages/login/login`
## 新建服务空间
学习与测试使用可以开个免费的服务空间，有效期一个月，建议使用阿里云的，为什么呢？`便宜啊！`，具体根据自身情况而定。


![-uniCloud.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/920914b92c00474aada31a4d2635451d~tplv-k3u1fbpfcp-watermark.image?)
初始化服务空间需要10分钟左右时间，需手动刷新状态。

## 关联服务空间
![Snipaste_2023-03-09_15-59-10.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/867b3dd1ff934fe585f10ccfa235ee99~tplv-k3u1fbpfcp-watermark.image?)

## 上传 DB Schema
`/uniCloud/database/` 数据库 schema 文件：
- dorm_apply.schema.json
- dorm_roles.schema.json
- dorm_share.schema.json

![Snipaste_2023-03-09_15-59-55.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c6d3c99a48c549a590f435ea7280817d~tplv-k3u1fbpfcp-watermark.image?)

![Snipaste_2023-03-09_16-00-55.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8dcca229cab44cab899a314ffdd6e4a2~tplv-k3u1fbpfcp-watermark.image?)
集合不存在提示，点击确定创建。
## 上传云对象，云函数
`/uniCloud/cloudfunctions/` 云对象与云函数文件夹：

- applySubscribeMsg 云对象 `订阅消息报修订单提醒`
- feedbackSubscribeMsg 云对象 `订阅消息报修反馈通知`
- getAccessToken 云对象 `获取小程序 accessToken`
- getUserOpenId 云函数 `获取用户 openid`

> 1. getAccessToken 云对象  `index.obj.js` 里面的 `secret` 秘钥与 `appid` 要换成自己的。
> 2. getUserOpenId 云函数 `index.js` 里面的 `secret` 秘钥与 `appid` 要换成自己的。
> 3. applySubscribeMsg 与 feedbackSubscribeMsg 云对象 `index.obj.js` 里面的 `template_id` 要换成自己的。


订阅消息的模板可以在小程序后台申请。

![微信截图_20230309163824.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/194de293816440e9be3e8de43429e367~tplv-k3u1fbpfcp-watermark.image?)

上传云对象与云函数。

![Snipaste_2023-03-09_16-01-42.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eb20c8c57b9a4acb8107170cbf474d0d~tplv-k3u1fbpfcp-watermark.image?)

## 配置 request 合法域名

小程序开发者后台，开发管理，开发设置，添加服务器域名 `https://api.next.bspapp.com`。


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9e882097ce8545ca9922e1b642f08e90~tplv-k3u1fbpfcp-watermark.image?)

## 运行效果

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/edfe45a99de9489ca67b06c888202ca2~tplv-k3u1fbpfcp-watermark.image?)
