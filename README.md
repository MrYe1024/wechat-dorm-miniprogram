# 宿舍报修助手

## 项目说明

本项目基于小程序云开发，简单易用，逻辑主要是云数据库的增删查改，页面大部分自写，部分使用vant weapp小程序组件库。大家可用于学习或者二次开发，有什么不懂的地方可联系wechat：MrYe1024。对了，项目里面插了点广告，不介意的话帮我点下，生活不易阿！！！！！！

## 项目部署流程

### 步骤一：修改云环境与上传云函数

1.导入源码后，打开app.js文件，找到如下代码修改云环境。

```
wx.cloud.init({
   env: '云环境ID', // 打开云控制台可获取
   traceUser: true
})
```

2.上传cloudfunctions目录下的云函数，login，applyNotice, handleNotice。注意上传时选择（上传并部署，不上传node_modules）。

### 步骤二：导入数据库

 打开云开发控制台，创建c_apply，c_role，c_share集合，然后找到源码databases目录下的数据库文件，分别导入。

### 步骤三：添加权限

一，二步骤完成之后，编译程序，控制台会输出你的openid。复制你的openid，打开云控制台c_role集合，找到openid字段替换为你的openid。

## 项目体验

![](https://646f-dorm-8svqc-1259164383.tcb.qcloud.la/gh_6d5907af00c8_258%20.jpg?sign=112d7629f8e45567b2f77b66a98c5ec3&t=1627296182)
