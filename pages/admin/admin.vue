<template>
	<view class="container">
		<view class="header-view">
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
						<text v-if="item.status === 0" style="color: #f3a73f;" @click="confirmOrder(item)">接收订单</text>
						<text v-if="item.status === 1" style="color: #18bc37;" @click="completeOrder(item)">处理完成</text>
						<text v-if="item.status === 2" style="color: #e43d33;" @click="deleteOrder(item)">删除</text>
					</view>
					<view class="level-tag" :style="{backgroundColor: item.level === 1 ? '#07c160' : '#ee0a24'}">
						{{item.level === 1 ? '普通维修' : '紧急维修'}}
					</view>
				</view>
			</block>
		</view>
		<view class="footer-view" v-if="applyData.length">
			<text @click="copyOpenid">@2019-2023 宿舍报修助手</text>
		</view>
	</view>
</template>

<script>
	import {
		floor
	} from '../../config/config.default';
	const db = uniCloud.database();
	const http = uniCloud.importObject('feedbackSubscribeMsg')
	const limit = 20;
	let tabsIndex = 0;
	let floorIndex = 0;
	var interstitialAd = null;
	export default {
		data() {
			return {
				tabList: [{
					name: '未处理',
					status: 0
				}, {
					name: '处理中',
					status: 1
				}, {
					name: '已完成',
					status: 2
				}],
				floorList: [floor],
				applyData: [],
				isEndOfList: null
			}
		},
		onLoad(options) {
			this.getApplyData()
		},
		// 触底刷新
		onReachBottom() {
			!this.isEndOfList && this.getApplyData()
		},
		computed: {
			applyStatus () {
				return (status) => {
					return Number(status) === 0 ? '未处理' 
					: Number(status) === 1 ? '处理中' : '已完成'
				}
			},
			tagType () {
				return (status) => {
					return Number(status) === 0 ? 'error' 
					: Number(status) === 1 ? 'warning' : 'success'
				}
			}
		},
		methods: {
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
			// 接收订单
			async confirmOrder (event) {
				uni.showModal({
				    title: '温馨提示',
				    content: '是否接收处理该订单?',
				    success: async (res) => {
						if (res.confirm) {
							const result = await db.collection('dorm_apply').where({
								_id: event._id
							}).update({
								status: 1
							})
							if (result.success) {
								this.applyData = []
								this.getApplyData()
								// #ifdef MP-WEIXIN
								http.sendMessage({
									openid: event.openid,
									dorm: event.dorm,
									status: '管理员已接单',
									name: '叶志远',
									phone: '15113624649',
									remarks: '管理员已接单，请留意订单状态，谢谢您!'
								})
								// #endif
							}
						}
					}
				})
			},
			// 处理完成
			completeOrder (event) {
				uni.showModal({
				    title: '温馨提示',
				    content: '是否处理完成该订单?',
				    success: async (res) => {
						if (res.confirm) {
							const result = await db.collection('dorm_apply').where({
								_id: event._id
							}).update({
								status: 2
							})
							if (result.success) {
								this.applyData = []
								this.getApplyData()
								// #ifdef MP-WEIXIN
								http.sendMessage({
									openid: event.openid,
									dorm: event.dorm,
									status: '订单已完成',
									name: '叶志远',
									phone: '15113624649',
									remarks: '如有疑问，请联系管理员，祝您生活愉快!'
								})
								// #endif
							}
						}
					}
				})
			},
			// 删除订单
			deleteOrder (event) {
				uni.showModal({
				    title: '温馨提示',
				    content: '是否删除该订单?',
				    success: async (res) => {
						if (res.confirm) {
							const result = await db.collection('dorm_apply').where({
								_id: event._id
							}).remove({
								status: 2
							})
							if (result.success) {
								this.applyData = []
								this.getApplyData()
							}
						}
					}
				})
			},
			// 查看详情
			navToDetailPage(item) {
				uni.navigateTo({
					url: '/pages/detail/detail?detail=' + JSON.stringify(item)+'&isAdmin=true'
				})
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

				.card__footer {
					text-align: right;
					font-size: 28rpx;
					padding: 20rpx;
					text {
						margin-left: 20rpx;
					}
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
		.footer-view {
			text-align: center;
			padding: 30rpx 0;
			font-size: 26rpx;
			color: #999;
		}
	}
</style>
