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
							<uni-tag style="width: fit-content;" size="mini" :text="applyStatus(item.status)"
								:type="tagType(item.status)" />
							<text class="date">{{item.createTime}}</text>
						</view>
					</view>
					<view class="card__footer">
						<text style="color: #1989fa;" @click="navToDetailPage(item)">查看详情</text>
					</view>
					<view class="level-tag" :style="{backgroundColor: item.level === 1 ? '#07c160' : '#ee0a24'}">
						{{item.level === 1 ? '普通维修' : '紧急维修'}}
					</view>
				</view>
			</block>
		</view>
		<uni-all-empty-state v-if="!applyData.length" :imgUrl="emptyState[currentIndex]"></uni-all-empty-state>
		<view class="footer-view" v-if="applyData.length">
			<text @click="copyOpenid">@2019-2023 宿舍报修助手</text>
		</view>
		<view :class="{'ad-banner': applyData.length === 1}" v-if="applyData.length !== 0">
			<view>
				<ad unit-id="adunit-9b214d22ec05f226"></ad>
			</view>
		</view>
	</view>
</template>

<script>
	import mixin from '../../mixins/mixin.js'
	const db = uniCloud.database()
	const limit = 20 // 每次最多获取20条数据
	let tabsIndex = 0 // 默认tabs下标
	let floorIndex = 0 // 默认楼层下标
	var interstitialAd = null // 插屏广告对象
	let videoAd = null // 激励广告对象
	export default {
		mixins: [mixin], // 引入可复用的代码
		data() {
			return {

			}
		},
		onLoad(options) {
			// #ifdef MP-WEIXIN
			this.getUserOpenid()
			// #endif
			this.getApplyData()
			this.onShareMessage()
			// #ifdef MP-WEIXIN
			this.createInterstitialAd()
			this.createRewardedVideoAd()
			if (options.id === 'success') {
				this.addInterstitialAd(interstitialAd)
			}
			// #endif
			// APP登录状态检测
			// #ifndef MP-WEIXIN
			this.validateLogin()
			// #endif
		},
		// 触底刷新
		onReachBottom() {
			!this.isEndOfList && this.getApplyData()
		},
		// 分享小程序
		onShareAppMessage() {
			return {
				title: this.shareData.title,
				path: this.shareData.path,
				imageUrl: this.shareData.imageUrl,
				success: res => {
					uni.showToast({
						title: '分享成功',
						icon: 'success',
						duration: 1000
					})
				},
				fail: err => {
					console.log(err)
				}
			}
		},
		methods: {
			/**
			 * @description APP登录状态检测
			 */
			validateLogin() {
				const userId = uni.getStorageSync('userId')
				if (!userId) {
					uni.reLaunch({
						url: '/pages/login/login'
					})
				}
			},
			/**
			 * @description 调用云函数获取用户openid
			 * */
			async getUserOpenid() {
				uni.login({
					onlyAuthorize: true,
					provider: 'weixin',
					success: async res => {
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
			/**
			 * @description 初始化插屏广告
			 * */
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
			/**
			 * @description 初始化激励广告
			 * */
			createRewardedVideoAd() {
				if (wx.createRewardedVideoAd) {
					videoAd = wx.createRewardedVideoAd({
						adUnitId: 'adunit-cbebfbb7e560c89c'
					})
					videoAd.onLoad(() => {
						console.log('激励广告初始化成功')
					})
					videoAd.onError((err) => {})
					videoAd.onClose((res) => {
						if (res.isEnded) {
							uni.navigateTo({
								url: '/pages/admin/admin'
							})
						}
						console.log('广告已关闭')
					})
				}
			},
			/**
			 * @description 投放插屏广告
			 * */
			addInterstitialAd(interstitialAd) {
				if (interstitialAd) {
					interstitialAd.show().catch((err) => {
						console.error(err)
					})
				}
			},
			/**
			 * @description 投放激励广告
			 * */
			addRewardedVideoAd() {
				if (videoAd) {
					videoAd.show().catch(() => {
						// 失败重试
						videoAd.load()
							.then(() => videoAd.show())
							.catch(err => {
								console.log('激励视频 广告显示失败')
							})
					})
				}
			},
			/**
			 * @description 获取全部宿舍申报数据
			 * */
			async getApplyData() {
				uni.showLoading({
					title: '加载中...',
					mask: true
				})
				const res = await db.collection('dorm_apply').where({
					status: this.tabList[tabsIndex].status,
					floor: floorIndex === 0 ? {} : floorIndex,
					// #ifdef MP-WEIXIN
					openid: uni.getStorageSync('openid')
					// #endif
					// #ifndef MP-WEIXIN
					userId: uni.getStorageSync('userId')
					// #endif
				}).skip(this.applyData.length).orderBy('createTime', 'desc').get()
				console.log(res)
				this.applyData = [...this.applyData, ...res.result.data]
				this.isEndOfList = res.result.data.length < limit ? true : false
				uni.hideLoading()
			},
			/**
			 * @description 切换tab获取申报数据、投放插屏广告
			 * */
			changeTabHandle(evt) {
				tabsIndex = evt.index
				this.currentIndex = evt.index
				this.applyData = []
				this.getApplyData()
				// #ifdef MP-WEIXIN
				this.addInterstitialAd(interstitialAd)
				// #endif
			},
			/**
			 * @description 切换楼栋获取宿舍申报数据
			 * */
			async getApplyDataItem(floor) {
				uni.showLoading({
					title: '加载中...',
					mask: true
				})
				const res = await db.collection('dorm_apply').where({
					floor: floor,
					status: this.tabList[tabsIndex].status,
					// #ifdef MP-WEIXIN
					openid: uni.getStorageSync('openid')
					// #endif
					// #ifndef MP-WEIXIN
					userId: uni.getStorageSync('userId')
					// #endif
				}).orderBy('createTime', 'desc').get()
				this.applyData = res.result.data
				uni.hideLoading()
			},
			/**
			 * @description 切换楼层获取申报数据
			 * */
			changePicker(evt) {
				floorIndex = evt.index
				if (floorIndex === 0) {
					this.applyData = []
					this.getApplyData()
				} else {
					this.getApplyDataItem(floorIndex)
				}
			},
			/**
			 * @description 获取角色列表
			 * */
			async getUserRole(openid) {
				const res = await db.collection('dorm_roles').get()
				if (res.success) {
					const openidList = res.result.data.filter(item => item.role === '超级管理员').map(item => item.openid)
					this.isAdmin = openidList.includes(openid)
					uni.setStorageSync('isAdmin', this.isAdmin)
				}
			},
			/**
			 * @description 获取分享数据
			 * */
			async onShareMessage() {
				const res = await db.collection('dorm_share').get()
				this.shareData = res.result.data[0]
			},
			/**
			 * @description 报修申报跳转
			 * */
			navToPublishPage() {
				uni.navigateTo({
					url: '/pages/publish/publish'
				})
			},
			/**
			 * @description 管理员跳转
			 * */
			navToAdminPage() {
				// #ifdef MP-WEIXIN
				uni.showModal({
					title: '温馨提示',
					content: '是否观看6-15秒广告进入页面',
					success: async (res) => {
						if (res.confirm) {
							this.addRewardedVideoAd()
						}
					}
				})
				// #endif
				// #ifndef MP-WEIXIN
				uni.navigateTo({
					url: '/pages/admin/admin'
				})
				// #endif
				if (this.isAdmin) {
					// 订阅报修订单提醒
					// #ifdef MP-WEIXIN
					wx.requestSubscribeMessage({
						tmplIds: ['4Lnbo47VBu7woS0m0O8UjZ-7TBozETC4Mr5tdkwJ4v4'],
					})
					// #endif
				}
			}
		}
	}
</script>

<style>
	page {
		background-color: #fff;
	}
</style>
<style lang="scss" scoped>
	@import '../../styles/index.scss';

	.ad-banner {
		view {
			width: 100%;
			position: fixed;
			bottom: 0;
		}
	}
</style>