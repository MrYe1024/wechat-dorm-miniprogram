<template>
	<view class="container">
		<view class='apply-table'>
			<view class='apply-title'>申报表</view>
			<view class="apply-item">
				<view class="apply-item-title">申报人：</view>
				<view class="item-content">{{user.name}}</view>
			</view>
			<view class="apply-item">
				<view class="apply-item-title">申报宿舍：</view>
				<view class="item-content">{{user.floor}}栋{{user.dorm}}</view>
			</view>
			<view class="apply-item" v-if="isAdmin">
				<view class="apply-item-title">联系电话：</view>
				<view class="item-content">{{user.phone}}</view>
				<view class="contact-phone-footer">
					<text @click="callApplyPhone">一键联系</text>
					<text @click="copyApplyPhone">一键复制</text>
				</view>
			</view>
			<view class="apply-item">
				<view class="apply-item-title">申报描述：</view>
				<view class="item-content">{{user.desc}}</view>
			</view>
			<view class="apply-item">
				<view class="apply-item-title">申报级别：</view>
				<view class="item-content">{{user.level}}</view>
			</view>
			<view class="apply-item">
				<view class="apply-item-title">申报状态：</view>
				<view class="item-content">{{user.status}}</view>
			</view>
			<view class="apply-item">
				<view class="apply-item-title">申报日期：</view>
				<view class="item-content">{{user.createTime}}</view>
			</view>
			<image src='../../static/images/bi.png' class="header-icon"></image>
		</view>

		<view class="ad-banner">
			<ad unit-id="adunit-0280bbad84c78062"></ad>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				user: null,
				isAdmin: true
			}
		},
		onLoad(options) {
			if (options.detail) {
				this.user = JSON.parse(options.detail)
			}
			if (options.isAdmin) {
				this.isAdmin = options.isAdmin
			}
		},
		methods: {
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

	.apply-table {
		background-color: #fbf7ed;
		margin: 20rpx;
		border-radius: 10rpx;
		padding: 40rpx 0;
		position: relative;
		min-height: 800rpx;
	}

	.apply-title {
		font-size: 2em;
		text-align: center;
	}

	.apply-item {
		background-color: #fff;
		margin: 20rpx;
		padding: 20rpx;
		border-radius: 4rpx;
	}

	.apply-item-title {
		font-size: 32rpx;
	}

	.item-content {
		padding-top: 4rpx;
		color: #ee0a24;
	}

	.header-icon {
		width: 100rpx;
		height: 100rpx;
		position: absolute;
		right: 40rpx;
		top: 20rpx;
	}

	.contact-phone-footer {
		display: flex;
		justify-content: space-between;
		padding: 10rpx 0;
		font-size: 28rpx;
	}

	.contact-phone-footer>text {
		flex: 1;
		text-align: center;
	}

	.contact-phone-footer>text:nth-child(1) {
		color: #07c160;
	}

	.contact-phone-footer>text:nth-child(2) {
		color: #1989fa;
	}
</style>
