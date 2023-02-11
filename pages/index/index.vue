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
							<uni-tag size="mini" :text="applyStatus(item.status)" :type="tagType(item.status)" />
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
	</view>
</template>

<script>
	import mixin from '../../mixins/mixin.js'
	const db = uniCloud.database();
	const limit = 20;
	let tabsIndex = 0;
	let floorIndex = 0;
	var interstitialAd = null;
	let videoAd = null;
	export default {
		mixins: [mixin],
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
			// 初始化激励广告
			createRewardedVideoAd () {
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
			// 显示插屏广告
			addInterstitialAd(interstitialAd) {
				if (interstitialAd) {
					interstitialAd.show().catch((err) => {
						console.error(err)
					})
				}
			},
			// 显示激励广告
			addRewardedVideoAd () {
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
			// 获取申报数据
			async getApplyData() {
				uni.showLoading({
					title: '加载中...',
					mask: true
				})
				const res = await db.collection('dorm_apply').where({
					status: this.tabList[tabsIndex].status,
					floor: floorIndex === 0 ? {} : floorIndex,
					openid: uni.getStorageSync('openid')
				}).skip(this.applyData.length).orderBy('createTime', 'desc').get()
				this.applyData = [...this.applyData, ...res.result.data]
				this.isEndOfList = res.result.data.length < limit ? true : false
				uni.hideLoading()
			},
			// 切换tab事件
			changeTabHandle(evt) {
				tabsIndex = evt.index
				this.currentIndex = evt.index
				this.applyData = []
				this.getApplyData()
				// #ifdef MP-WEIXIN
				this.addInterstitialAd(interstitialAd)
				// #endif
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
				if (res.success) {
					const openidList = res.result.data.filter(item => item.role === '超级管理员').map(item => item.openid)
					this.isAdmin = openidList.includes(openid)
					uni.setStorageSync('isAdmin', this.isAdmin)
				}
			},
			// 获取分享数据
			async onShareMessage() {
				const res = await db.collection('dorm_share').get()
				if (res.success) {
					this.shareData = res.result.data[0]
				}
			},
			// 报修申报跳转
			navToPublishPage() {
				uni.navigateTo({
					url: '/pages/publish/publish'
				})
			},
			// 管理员跳转
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
				if (this.isAdmin) {
					// 订阅报修订单提醒
					// #ifdef MP-WEIXIN
					wx.requestSubscribeMessage({
					    tmplIds: ['4Lnbo47VBu7woS0m0O8UjZ-7TBozETC4Mr5tdkwJ4v4'],
					})
					// #endif
				}
			},
			// 复制openid
			copyOpenid () {
				uni.setClipboardData({
					data: uni.getStorageSync('openid')
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '../../styles/index.scss';
</style>
