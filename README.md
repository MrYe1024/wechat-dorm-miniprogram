# 微信宿舍报修助手小程序
## 页面说明/miniprogram/pages
| 页面 | 名称 | 说明 |
|------|------------|------------|
| index  | 首页  |显示当前未处理，本月已处理的宿舍申报数据|
| detail | 详情页|显示申报表                            |
| publish| 提交页|提交申报数据                          |
| admin  | 管理页|管理申报表                           |
| success| 提示页|成功页面提示，包含服务通知功能             |

## 云函数/cloudfunctions
| 名称 | 说明 |
|------|------------|
| db_delete  | 删除申报数据  |
| login  | 获取用户openid  |
| templateMessage  | 发送模板消息  |

## 静态文件/miniprogram/
| 名称 | 说明 |
|------|------------|
| utils  | 图标url接口  |
| miniprogram_npm  | vant小程序组件库文件  |
| images  | 图片  |

## 数据库文件
| 集合名称 | 说明 |
|------|------------|
| applyData  | 申报当前未处理记录  |
| completeData  | 申报本月已处理记录  |
| building  | 宿舍楼栋数记录  |
| templateMessage  | 模板信息记录  |
| verify  | 管理员openid验证记录  |
| share  | 分享信息记录  |

# 项目部署流程
> 前提条件，注册了小程序，开通了云开发

## 步骤一：导入项目源码
`1.导入源码后，打开app.js文件，找到如下代码修改云环境：`
```javascript
wx.cloud.init({
   env: '云环境ID', // 打开云控制台可获取
   traceUser: true
})
```
## 步骤二：上传部署云函数
> 前提条件，你的电脑部署nodejs 8.9 以上环境，上传云函数时，选择上传并部署：云端安装依赖（不上传 node modules）

`找到cloudfunctions目录，鼠标右键，分别上传并部署（db_delete，login，templateMessage）云函数。`

## 步骤三：导入数据库
`1.打开云开发控制台，选择数据库，然后分别新建如下集合applyData，completeData，building，templateMessage，verify，share。`<br>
`2.找到找到源码下的databases目录，导入相应记录。`<br>
`3.verify下的openid字段值，修改为自己的openid。`

# 项目体验
![](https://images.gitee.com/uploads/images/2020/0802/162651_03c700f4_7392036.jpeg)