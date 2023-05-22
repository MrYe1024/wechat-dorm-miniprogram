<template>
	<view class="container">
		<view class="header-status-card">
			<text class="dot" :style="[{background: applyStatusColor}]"></text>
			<text>您的申报的报修信息<text v-if="applyStatusText">{{applyStatusText}}</text></text>
		</view>
		<view class="main-detail-list">
			<view class="content-view border-bottom">
				<view class="label-item">
					<text class="title">申报人：</text>
					<text>{{user.name}}</text>
				</view>
				<view class="label-item">
					<text class="title">申报宿舍：</text>
					<text>{{user.floor}}栋{{user.dorm}}</text>
				</view>
				<view class="label-item">
					<text class="title">申报描述：</text>
					<text>{{user.desc}}</text>
				</view>
				<view class="label-item">
					<text class="title">申报级别：</text>
					<text>{{user.level === 1 ? '普通维修' : '紧急维修'}}</text>
				</view>
				<view class="label-item">
					<text class="title">联系电话：</text>
					<text>{{user.phone}}</text>
					<text class="copy-btn" @click="copyApplyPhone">复制</text>
				</view>
				<view class="label-item">
					<text class="title">申报日期：</text>
					<text>{{user.createTime}}</text>
				</view>
			</view>
			<view class="footer-view">
				<view v-if="isAdmin" class="actions-item item-1" @click="callApplyPhone">
					<text>一键联系</text>
				</view>
				<view v-if="(!isAdmin && user.status === 0)" class="actions-item item-2" @click="cancelApply">
					<text>撤销申请</text>
				</view>
				<view v-if="(!isAdmin && user.status === 1)" class="actions-item item-3">
					<text style="color: #999;">处理中无法撤销申请</text>
				</view>
				<view v-if="(!isAdmin && user.status === 2)" class="actions-item item-4">
					<text style="color: #07c160;" @click="againApply">再次申报</text>
				</view>
			</view>
		</view>
		<view class="ad-banner">
			<view>
				<ad unit-id="adunit-b9a4247f4e2f2672"></ad>
			</view>
		</view>
	</view>
</template>

<script>
	const db = uniCloud.database()
	export default {
		data() {
			return {
				user: null,
				isAdmin: false,
				applyStatusText: null,
				applyStatusColor: '#e43d33'
			}
		},
		onLoad(options) {
			if (options.detail) {
				this.user = JSON.parse(options.detail)
				this.applyStatus(this.user.status)
			}
			if (options.isAdmin) {
				this.isAdmin = JSON.parse(options.isAdmin)
			}
		},
		methods: {
			applyStatus(status) {
				this.applyStatusText = Number(status) === 0 ? '正在等待处理' :
					Number(status) === 1 ? '正在处理中' : '已完成'
				this.applyStatusColor = Number(status) === 0 ? '#e43d33' :
					Number(status) === 1 ? '#f3a73f' : '#18bc37'
			},
			// 撤销申请
			cancelApply () {
				uni.showModal({
				    title: '温馨提示',
				    content: '是否撤销申请该订单?',
				    success: async (res) => {
						if (res.confirm) {
							const result = await db.collection('dorm_apply').where({
								_id: this.user._id
							}).update({
								status: 3
							})
							if (result.success) {
								uni.showToast({
									title: '撤销成功',
									icon: 'success',
									duration: 1000
								})
								setTimeout(() => {
									uni.reLaunch({
										url: '/pages/index/index'
									})
								}, 1100)
							}
						}
					}
				})
			},
			// 再次申报
			againApply () {
				uni.navigateTo({
					url: '/pages/publish/publish?detail='+JSON.stringify(this.user)
				})
			},
			// 一键联系
			callApplyPhone() {
				uni.makePhoneCall({
					phoneNumber: this.user.phone
				})
			},
			// 一键复制
			copyApplyPhone() {
				uni.setClipboardData({
					data: this.user.phone,
				})
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
	.container {
		padding: 30rpx;

		.header-status-card {
			height: 80rpx;
			line-height: 80rpx;
			background-color: #fff;
			box-shadow: 0px 0px 3px 1px rgba(0, 0, 0, 0.08);
			padding: 0 30rpx;

			.dot {
				display: inline-block;
				width: 20rpx;
				height: 20rpx;
				border-radius: 50%;
				margin-right: 10rpx;
			}
		}

		.main-detail-list {
			background-color: #fff;
			box-shadow: 0px 0px 3px 1px rgba(0, 0, 0, 0.08);
			
			.content-view {
				padding: 30rpx;
				position: relative;
				.label-item {
					padding: 10rpx 0;
				
					.title {
						color: #999;
					}
					
					.copy-btn {
						font-size: 26rpx;
						color: #1989fa;
						padding: 0 20rpx;
					}
				}
			}
			
			.footer-view {
				display: flex;
				font-size: 28rpx;
				padding: 30rpx 0;
				.actions-item {
					display: flex;
					flex: 1;
					align-items: center;
					justify-content: center;
				}
				.item-1 {
					color: #07c160;
				}
				.item-2 {
					color: #e43d33;
				}
			}
		}
		
		.ad-banner {
			margin: -30rpx;
			view {
				width: 100%;
				position: fixed;
				bottom: 0;
			}
		}
	}
</style>
