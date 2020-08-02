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

## 静态文件/miniprogram
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

## 步骤一：导入源码

## 步骤二：导入数据库