<template>
	<view class="container">
		<view class="header-view">
			<view class="navbar-view">
				<text @click="navToPublishPage">报修申报</text>
				<text @click="navToAdminPage">宿舍管理员</text>
			</view>
			<view class="picker-view">
				<!-- 
				下面三个属性为本人自定义添加的属性、uView官方picker组件暂不提供
				 overlay-是否显示遮罩层 true/false
				 isFixed-是否开启固定定位 true/false
				 duration-遮罩打开或收起的动画过渡时间、默认300
				 -->
				<u-picker :visibleItemCount="3" :show="true" :overlay="false" :isFixed="false" :duration="0"
					:showToolbar="false" :columns="floorList" @change="changePicker"></u-picker>
			</view>
			<uni-all-tabs :list="tabList" :justifyContent="'space-around'" @change="changeTabHandle"></uni-all-tabs>
		</view>
		<view class="card-list-view">
			<block v-for="(item, index) in applyData" :key="index">
				<view class="card-list-view__item">
					<view class="content border-bottom">
						<view class="content__left">
							<image :src="item.levelIcon" mode="aspectFill"></image>
						</view>
						<view class="content__right">
							<text class="floor">{{item.floor}}栋{{item.dorm}}</text>
							<text class="desc">{{item.desc}}</text>
							<uni-tag size="mini" :text="item.status === 0 ? '未处理' : '已处理'" type="warning" />
							<text class="date">{{item.createTime}}</text>
						</view>
					</view>
					<view class="footer">
						<text @click="navToDetailPage(item)">查看详情</text>
					</view>
					<view class="level-tag" :style="{backgroundColor: item.level === 1 ? '#07c160' : '#ee0a24'}">
						{{item.level === 1 ? '普通维修' : '紧急维修'}}
					</view>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
	import {
		floor
	} from '../../config/config.default';
	const db = uniCloud.database();
	const limit = 20;
	let tabsIndex = 0;
	let floorIndex = 0;
	var interstitialAd = null;
	export default {
		data() {
			return {
				tabList: [{
					name: '当前未处理',
					status: 0
				}, {
					name: '当前已处理',
					status: 1
				}],
				floorList: [floor],
				applyData: [],
				isEndOfList: null
			}
		},
		onLoad(options) {
			// #ifdef MP-WEIXIN
			this.getUserOpenid()
			// #endif
			this.getApplyData()
			this.onShareMessage()
			this.createInterstitialAd()
			if (options.id === 'success') {
				this.addInterstitialAd(interstitialAd)
			}
		},
		// 触底刷新
		onReachBottom() {
			!this.isEndOfList && this.getApplyData()
		},
		onShareAppMessage() {
			return {
				title: this.shareData.title,
				path: this.shareData.path,
				imageUrl: this.shareData.imageUrl,
				success: res => {
					console.log(res)
				},
				fail: err => {
					console.log(err)
				}
			}
		},
		methods: {
			// 获取用户openid
			async getUserOpenid() {
				uni.login({
					onlyAuthorize: true,
					provider: 'weixin',
					success: async res => {
						console.log(res)
						const {
							result
						} = await uniCloud.callFunction({
							name: 'getUserOpenId',
							data: {
								code: res.code
							}
						})
						this.openid = result.openid
						uni.setStorageSync('openid', result.openid)
						this.getUserRole(result.openid)
					}
				})
			},
			// 初始化广告
			createInterstitialAd() {
				if (wx.createInterstitialAd) {
					interstitialAd = wx.createInterstitialAd({
						adUnitId: 'adunit-40082f65d4929d84'
					})
					interstitialAd.onLoad(() => {})
					interstitialAd.onError((err) => {})
					interstitialAd.onClose(() => {})
				}
			},
			// 显示插屏广告
			addInterstitialAd(interstitialAd) {
				if (interstitialAd) {
					interstitialAd.show().catch((err) => {
						console.error(err)
					})
				}
			},
			// 获取申报数据
			async getApplyData() {
				uni.showLoading({
					title: '加载中...',
					mask: true
				})
				const res = await db.collection('dorm_apply').where({
					status: this.tabList[tabsIndex].status,
					floor: floorIndex === 0 ? {} : floorIndex
				}).skip(this.applyData.length).orderBy('createTime', 'desc').get()
				this.applyData = [...this.applyData, ...res.result.data]
				this.isEndOfList = res.result.data.length < limit ? true : false
				uni.hideLoading()
			},
			// 切换tab事件
			changeTabHandle(evt) {
				tabsIndex = evt.index
				this.applyData = []
				this.getApplyData()
				this.addInterstitialAd(interstitialAd)
			},
			// 选择栋数获取申报数据
			async getApplyDataItem(floor) {
				uni.showLoading({
					title: '加载中...',
					mask: true
				})
				const res = await db.collection('dorm_apply').where({
					floor: floor,
					status: this.tabList[tabsIndex].status
				}).orderBy('createTime', 'desc').get()
				if (res.success) {
					this.applyData = res.result.data
				}
				uni.hideLoading()
			},
			// 切换楼层事件
			changePicker(evt) {
				floorIndex = evt.index
				if (floorIndex === 0) {
					this.applyData = []
					this.getApplyData()
				} else {
					this.getApplyDataItem(floorIndex);
				}
			},
			// 获取角色列表
			async getUserRole(openid) {
				const res = await db.collection('dorm_roles').get()
				console.log(res)
				if (res.success) {
					const openidList = res.result.data.filter(item => item.role === '超级管理员').map(item => item.openid)
					this.isAdmin = openidList.includes(openid)
					console.log(this.isAdmin)
				}
			},
			// 获取分享数据
			async onShareMessage() {
				const res = await db.collection('dorm_share').get()
				if (res.success) {
					this.shareData = res.result.data[0]
				}
			},
			// 查看详情
			navToDetailPage(item) {
				uni.navigateTo({
					url: '/pages/detail/detail?detail=' + JSON.stringify(item)
				})
			},
			// 报修申报跳转
			navToPublishPage() {
				uni.navigateTo({
					url: '/pages/publish/publish'
				})
			},
			// 管理员跳转
			navToAdminPage() {
				uni.navigateTo({
					url: '/pages/admin/admin'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		.header-view {
			.navbar-view {
				padding: 20rpx;
				background-color: #fff;
				color: #1989fa;
				display: flex;
				justify-content: space-between;
				font-size: 32rpx;
			}

			.picker-view {
				.u-popup ::v-deep view {
					position: none !important;
				}
			}
		}

		.card-list-view {
			&__item {
				background-color: #fff;
				margin: 20rpx;
				border-radius: 10rpx;
				position: relative;

				.content {
					display: flex;
					padding: 20rpx;
					position: relative;

					&__left>image {
						width: 200rpx;
						height: 200rpx;
						border-radius: 10rpx;
					}

					&__right {
						display: flex;
						flex: 1;
						flex-direction: column;
						justify-content: space-between;
						margin-left: 20rpx;

						.floor {
							font-weight: bold;
						}

						.desc {
							font-size: 28rpx;
							margin: 5rpx 0;
							overflow: hidden;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-line-clamp: 2;
							-webkit-box-orient: vertical;
						}

						.date {
							font-size: 28rpx;
							color: #969799;
							margin-top: 5rpx;
						}
					}
				}

				.footer {
					font-size: 28rpx;
					padding: 20rpx;
					text-align: right;
					color: #1989fa;
				}

				.level-tag {
					font-size: 20rpx;
					color: #fff;
					padding: 5rpx 10rpx;
					border-radius: 0 999px 999px 0;
					display: inline-block;
					background-color: #ee0a24;
					position: absolute;
					top: 20rpx;
					left: 0;
				}
			}
		}
	}
</style>
