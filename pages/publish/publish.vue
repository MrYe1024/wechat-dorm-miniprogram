<template>
	<view class="container">
		<!-- 通告栏 -->
		<view class="header-notice-bar">
			<uni-notice-bar show-icon scrollable text="请同学们如实填写信息,方便维修人员对应进行维修。请同学们推广使用,谢谢大家。" />
		</view>
		<view class="main-form-list">
			<view class="apply-item">
				<text>申报人：</text>
				<input class="in-1" maxlength="6" v-model="formData.name"></input>
			</view>

			<view class="apply-item">
				<text>申报宿舍：</text>
				<picker @change="selectFloor" :range="pickerList">
					<view class="picker">
						<input :disabled="true" class="in-2" type="number" v-model="formData.floor"></input>
					</view>
				</picker>
				<text class="text-dorm">栋</text>
				<input class="in-3" type="number" maxlength="6" v-model="formData.dorm"></input>
			</view>

			<view class="apply-item">
				<text>联系电话：</text>
				<input class="in-4" type="number" v-model="formData.phone"></input>
			</view>

			<view class="apply-item apply-desc">
				<text>申报描述：</text>
				<textarea class="in-5" placeholder="请说明要维修的情况" placeholder-style="color:#ccc;font-size:14px;"
					type="string" maxlength="50" v-model="formData.desc"></textarea>
			</view>
		</view>

		<view class="radio-list">
			<radio-group @change="changLevel">
				<block v-for="(item, index) in levelList" :key="index">
					<label class="radio-list__item">
						<view>{{item.name}}</view>
						<view>
							<radio :value="item.value + ''" :checked="index === (Number(formData.level) - 1)" />
						</view>
					</label>
				</block>
			</radio-group>
		</view>

		<view class="apply-btn">
			<button type="primary" @click="submitApplyData">提交</button>
		</view>

		<view class="ad-banner">
			<view>
				<ad unit-id="adunit-0280bbad84c78062"></ad>
			</view>
		</view>
		<view style="height: 160px;"></view>
	</view>
</template>

<script>
	import {
		moment
	} from '../../utils/moment.js'
	const db = uniCloud.database()
	const http = uniCloud.importObject('applySubscribeMsg')
	export default {
		data() {
			return {
				levelList: [{
					value: 1,
					name: '普通维修',
					icon: 'https://mp-e93e0c5f-05cf-4713-9d34-a6449768f5b0.cdn.bspapp.com/cloudstorage/f5246692-e2fb-4b90-bfe7-4c3dd058d4b3.png'
				}, {
					value: 2,
					name: '紧急维修',
					icon: 'https://mp-e93e0c5f-05cf-4713-9d34-a6449768f5b0.cdn.bspapp.com/cloudstorage/a7e07473-e6d2-4146-b549-bf8846d5e4c3.png'
				}],
				pickerList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
					27, 28, 29, 30
				],
				formData: {
					userId: uni.getStorageSync('userId') || null,
					name: null,
					desc: null,
					dorm: null,
					floor: null,
					level: 1, // 1普通维修、2紧急维修
					levelIcon: 'https://mp-e93e0c5f-05cf-4713-9d34-a6449768f5b0.cdn.bspapp.com/cloudstorage/f5246692-e2fb-4b90-bfe7-4c3dd058d4b3.png',
					phone: null,
					openid: uni.getStorageSync('openid'),
					createTime: moment('YYYY-MM-DD hh:mm:ss'),
					status: 0 // 0 未处理，1 处理中，2 已处理
				}
			};
		},
		onLoad (options) {
			if (options.detail) {
				const data = JSON.parse(options.detail)
				this.formData.name = data.name
				this.formData.dorm = data.dorm
				this.formData.floor = data.floor
				this.formData.phone = data.phone
			}
		},
		methods: {
			// 选择楼层
			selectFloor(e) {
				this.formData.floor = this.pickerList[Number(e.detail.value)]
			},
			// 选择维修等级
			changLevel(evt) {
				for (let i = 0; i < this.levelList.length; i++) {
					if (this.levelList[i].value === Number(evt.detail.value)) {
						this.formData.level = this.levelList[i].value
						this.formData.levelIcon = this.levelList[i].icon
						break
					}
				}
			},
			// 提交申报
			submitApplyData() {
				if (this.validateForm()) {
					// 订阅报修反馈通知
					// #ifdef MP-WEIXIN
					wx.requestSubscribeMessage({
						tmplIds: ['xdcaBq1COut3fsO_YvmrvQKYrgDrKmMaR-EwbmvH-VU'],
					})
					// #endif
					uni.showLoading({
						title: '正在提交...',
						mask: true
					})
					console.log(this.formData)
					db.collection('dorm_apply').add(this.formData).then(async res => {
						await http.sendMessage(this.formData)
						wx.hideLoading()
						wx.showToast({
							title: '提交成功',
							duration: 1000
						})
						setTimeout(() => {
							uni.reLaunch({
								url: '../index/index?id=success',
							})
						}, 1200)
					})
				}
			},
			// 申报表单验证
			validateForm() {
				let cp = /[1][3,4,5,7,8][0-9]{9}$/;
				if (this.formData.name === '' || !this.formData.name) {
					wx.showToast({
						title: '请填写申报人',
						icon: 'error',
						duration: 500
					})
					return false;
				}
				if (this.formData.floor === '' || !this.formData.floor) {
					wx.showToast({
						title: '请选择栋数',
						icon: 'error',
						duration: 500
					})
					return false;
				}
				if (this.formData.dorm === '' || !this.formData.dorm) {
					wx.showToast({
						title: '请填写宿舍',
						icon: 'error',
						duration: 500
					})
					return false;
				}
				if (this.formData.phone === '' || !this.formData.phone) {
					wx.showToast({
						title: '请填写手机号码',
						icon: 'error',
						duration: 500
					})
					return false;
				}
				if (!cp.test(this.formData.phone)) {
					wx.showToast({
						title: '请填写正确手机号',
						icon: 'error',
						duration: 500
					})
					return false;
				}
				if (this.formData.desc === '' || !this.formData.desc) {
					wx.showToast({
						title: '请说明情况',
						icon: 'error',
						duration: 500
					})
					return false;
				}
				return true;
			}
		}
	}
</script>

<style lang="scss" scoped>
	input,
	textarea {
		background-color: #f6f6f6;
		padding: 10rpx;
		color: #969799;
	}

	.container {
		.header-notice-bar {
			margin-bottom: 20rpx;
		}

		.main-form-list {
			.apply-item {
				padding: 20rpx;
				margin-bottom: 20rpx;
				display: flex;
				align-items: center;
				background-color: #fff;

				.in-1,
				.in-4 {
					width: 250rpx;
					border-radius: 10rpx;
					text-align: center;
				}

				.text-dorm {
					margin: 0 20rpx;
				}

				.in-2,
				.in-3 {
					width: 120rpx;
					border-radius: 10rpx;
					text-align: center;
				}

				.in-5 {
					border-radius: 10rpx;
					height: 150rpx;
					width: 100%;
				}
			}

			.apply-desc {
				display: flex;
				flex-direction: column;
				align-items: flex-start;
				background-color: #fff;
			}

			.apply-desc>text {
				margin-bottom: 20rpx;
			}
		}

		.apply-btn {
			width: 80%;
			margin: 100rpx auto 0 auto;
		}

		.radio-list {
			background-color: #fff;
		}

		.radio-list__item {
			display: flex;
			justify-content: space-between;
			padding: 20rpx;
		}
		
		.ad-banner {
			view {
				width: 100%;
				position: fixed;
				bottom: 0;
			}
		}
	}
</style>
