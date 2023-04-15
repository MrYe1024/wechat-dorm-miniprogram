<template>
	<page-meta :page-style="gradientStyle"></page-meta>
	<view class="page-container">
		<view class="logo-body">
			<image mode="widthFix" class="logo-img" src="https://mp-e93e0c5f-05cf-4713-9d34-a6449768f5b0.cdn.bspapp.com/cloudstorage/8ba48d08-0199-4436-8c17-bd855c5748c6.png"></image>
			<text>宿舍报修助手</text>
		</view>
		<view class="login-body">
			<view class="login login-1" v-if="loginType === '密码'">
				<view class="input-box border-bottom">
					<view class="left">
						<text>账号</text>
					</view>
					<input type="text" v-model="formData.username" placeholder-class="placeholder" placeholder="账号/手机号/邮箱" />
				</view>
				<view class="input-box border-bottom">
					<view class="left">
						<text>密码</text>
					</view>
					<input v-if="!showPassword" v-model="formData.password" type="password" placeholder-class="placeholder" placeholder="请输入密码" />
					<input v-else v-model="formData.password" type="text" placeholder-class="placeholder" placeholder="请输入密码" />
					<u-icon @click="showPassword = !showPassword" :name="showPassword ? 'eye-fill' : 'eye-off'">
					</u-icon>
				</view>
			</view>
			<view class="login login-2" v-if="loginType === '验证码'">
				<view class="input-box border-bottom">
					<view class="left">
						<text>手机号</text>
						<!-- <u-icon name="arrow-down" style="margin-left: 10rpx;"></u-icon> -->
					</view>
					<input type="number" v-model="formData.phone" placeholder-class="placeholder" placeholder="请输入手机号" />
				</view>
				<view class="input-box border-bottom">
					<view class="left">验证码</view>
					<input v-model="formData.validCode" type="number" placeholder-class="placeholder" placeholder="请输入验证码" />
					<view class="right">
						<view class="button" @click="getValidCode">{{validCodeText}}</view>
					</view>
				</view>
			</view>
			<view class="button-box" v-if="loginType === '密码' || loginType === '验证码'">
				<view class=" button login" :style="{opacity: formEmpty ? 1 : .6}" @click="loginHandle">登录</view>
				<view class=" button register" @click="navRegisterPage">注册</view>
			</view>
		</view>
		<view v-if="false" class="login-type-body" :style="{top: $windowHeight - 140 + 'px'}">
			<view class="list">
				<block v-for="(item, index) in loginList" :key="index">
					<view class="item" v-if="item.isShow" @click="changeLoginType(item)">
						<view class="icon-box">
							<u-icon :name="item.icon" size="40rpx" color="#fff"></u-icon>
						</view>
						<text>{{item.name}}</text>
					</view>
				</block>
			</view>
		</view>
		<view class="privacy-body" :style="{top: $windowHeight - 40 + 'px'}">
			<view class="radio" @click="isAgree = !isAgree">
				<view v-if="isAgree" class="dot"></view>
			</view>
			<text>
				我已阅读并同意<text class="service treaty">服务协议</text>和
				<text class="privacy treaty">隐私政策</text>
			</text>
		</view>
	</view>
</template>

<script>
	const db = uniCloud.database()
	export default {
		data() {
			return {
				showPassword: false,
				loginList: [{
					name: '密码',
					icon: 'lock',
					isShow: true
				}, {
					name: '验证码',
					icon: '',
					isShow: false
				}],
				loginType: '密码',
				formData: {
					phone: '',
					password: '',
					validCode: '',
					username: ''
				},
				validCodeText: '获取验证码',
				validCode: '',
				isAgree: false
			};
		},
		computed: {
			gradientStyle() {
				const gStyle =
					`background: ${this.gradient.gradientType}-gradient(${this.gradient.colorRotation}deg, 
					${this.gradient.colorA} ${this.gradient.colorWidthOne}%, ${this.gradient.colorB} ${this.gradient.colorWidthTow}%);
					background-attachment:fixed;min-height:100vh;`
				return gStyle;
			},
			/* 登录 */
			formEmpty() {
				return (this.formData.phone && this.formData.validCode) || (this.formData.username && this.formData.password)
			}
		},
		onLoad() {
			// // #ifdef APP-PLUS
			// this.univerifyLogin()
			// this.loginList.push({
			// 	name: '一键登录',
			// 	icon: 'phone',
			// 	isShow: true
			// })
			// // #endif
		},
		methods: {
			/* 登录 */
			loginHandle() {
				if (this.loginType === '验证码') {
					this.loginByCode()
				} else {
					this.loginByPassword()
				}
			},
			/* 验证码登录 */
			loginByCode() {
				if (this.validCode === this.formData.validCode && this.formEmpty) {
					if(!this.isAgree) {
						this.$utils.showToast('请先阅读并同意协议')
						return false
					}
					userService.loginPhone({
						phone: this.formData.phone
					}).then(res => {
						if(res.data.code === 0) {
							this.loginSuccess(res)
						}else {
							this.$utils.showToast('登录失败', 1000, 'error')
						}
					})
				} else {
					this.$utils.showToast('验证码错误', 1000)
				}
			},
			/**
			 * @description 账号密码登录
			 */
			async loginByPassword() {
				if(this.formEmpty) {
					if(!this.isAgree) {
						uni.showToast({
							title: '请先阅读并同意协议',
							icon: 'none'
						})
						return false
					}
					const res = await db.collection('dorm_users').where({
						username: this.formData.username
					}).get()
					if (res.result.data.length === 0) {
						uni.showToast({
							title: '账号不存在请先注册',
							icon: 'none'
						})
					} else {
						const result = res.result.data
						const index = result.findIndex(item => item.password === this.formData.password)
						if (index !== -1) {
							uni.setStorageSync('userId', result[index]._id)
							uni.reLaunch({
								url: '/pages/index/index'
							})
						} else {
							uni.showToast({
								title: '密码错误',
								icon: 'error'
							})
						}
					}
				}
			},
			/**
			 * @description 跳转去注册
			 */
			navRegisterPage() {
				uni.navigateTo({
					url: '/pages/login/register'
				})
			},
			/* 一键登录 */
			univerifyLogin() {
				univerify().then(res => {
					userService.loginPhone({
						phone: res.phoneNumber
					}).then(res => {
						if(res.data.code === 0) {
							uni.closeAuthView()
							this.loginSuccess(res)
						}else {
							this.$utils.showToast('登录失败', 1000, 'error')
						}
					})
				}).catch(err => {
					console.log(err)
				})
			},
			/* 登录成功 */
			loginSuccess(res) {
				uni.$emit('loginSuccess', res.data.data)
				uni.setStorageSync('userInfo', res.data.data.userInfo)
				uni.setStorageSync('token', res.data.data.token)
				uni.switchTab({
					url: '../index/index'
				})
				console.log(res.data.data.userInfo)
			},
			/* 切换登录方式 */
			changeLoginType(type) {
				const validIndex = this.loginList.findIndex((item) => item.name === '验证码')
				const pwdIndex = this.loginList.findIndex((item) => item.name === '密码')
				if (type.name === '验证码') {
					this.loginType = type.name
					this.loginList[validIndex].isShow = false
					this.loginList[pwdIndex].isShow = true
				}
				if (type.name === '密码') {
					this.loginType = type.name
					this.loginList[validIndex].isShow = true
					this.loginList[pwdIndex].isShow = false
				}
				if (type.name === '一键登录') {
					this.univerifyLogin()
				}
			},
			/* 获取验证码 */
			getValidCode() {
				if (this.validateForm()) {
					if (this.validCodeText === '获取验证码' || this.validCodeText === '重新获取') {
						let seconds = 60
						this.validCodeText = `${seconds}s`
						const timer = setInterval(() => {
							seconds--
							this.validCodeText = `${seconds}s`
							if (seconds === 0) {
								clearInterval(timer)
								this.validCodeText = '重新获取'
							}
						}, 1000)
						this.getValidCodeHttp()
					}
				}
			},
			/* 获取验证码请求 */
			getValidCodeHttp() {
				uniCloud.callFunction({
					name: 'sendSms',
					data: {
						phone: this.formData.phone
					}
				}).then(res => {
					console.log(res)
					if (res.result.success) {
						this.validCode = res.result.code
					} else {
						uni.showToast({
							title: '获取验证码失败',
							icon: 'error',
							duration: 500
						})
					}
				})
			},
			/* 表单验证 */
			validateForm() {
				let cp = /(^1[3|4|5|6|7|8|9]\d{9}$)|(^(^0\d{2,3}-?)?[2-9]\d{6,7}$)/
				if (this.formData.phone.trim() === '' || !this.formData.phone) {
					uni.showToast({
						title: '请填写手机号码',
						icon: 'error',
						duration: 500
					})
					return false
				}
				if (!cp.test(this.formData.phone)) {
					uni.showToast({
						title: '请填写正确手机号',
						icon: 'error',
						duration: 500
					})
					return false
				}
				return true
			}
		}
	}
</script>
<style lang="scss" scoped>
	.flex-box {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.flex-box-column {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	
	.placeholder {
		color: rgba($color: #000, $alpha: 0.2);
	}
	
	.page-container {
		.logo-body {
			padding-top: 160rpx;
			@extend .flex-box-column;
			.logo-img {
				width: 150rpx;
			}
			text {
				font-size: 50rpx;
				padding: 10rpx 0;
				margin-bottom:0px;
				cursor:pointer;
				background: #12c2e9;  /* fallback for old browsers */
				background: -webkit-linear-gradient(to right, #c471ed, #12c2e9);  /* Chrome 10-25, Safari 5.1-6 */
				background: linear-gradient(to right, #c471ed, #12c2e9); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
				-webkit-background-clip:text; 
				-webkit-text-fill-color:transparent;

			}
		}

		.login-body {
			padding: 80rpx 100rpx;
			color: $color-white;
			.login {
				.input-box {
					position: relative;
					display: flex;
					align-items: center;
					font-size: 32rpx;

					.left {
						padding-right: 30rpx;
					}

					input {
						flex: 1;
						padding: 30rpx 0;
					}
					
					.right {
						.button {
							font-size: 24rpx;
							background: rgba($color: #000, $alpha: 0.1);
							border-radius: 999px;
							padding: 10rpx 20rpx;
						}
					}
				}
			}

			.button-box {
				padding-top: 80rpx;

				.button {
					padding: 20rpx 0;
					@extend .flex-box;
					font-size: 32rpx;
					border-radius: 999rpx;
					margin-bottom: 30rpx;
					cursor: pointer;
					color: $color-white;
				}

				.login {
					background-color: $color-primary;
				}

				.register {
					background-color: #2d8ce1;
				}
			}
		}

		.login-type-body {
			position: fixed;
			bottom: 140rpx;
			width: 100%;

			.list {
				@extend .flex-box;

				.item {
					@extend .flex-box-column;
					padding: 0 60rpx;
					min-width: 150rpx;

					.icon-box {
						background: rgba($color: #000, $alpha: 0.1);
						padding: 30rpx;
						border-radius: 50%;
						margin-bottom: 10rpx;
					}
				}
			}
		}

		.privacy-body {
			width: 100%;
			position: fixed;
			left: 0;
			@extend .flex-box;

			.treaty {
				color: #338cc2;
				padding: 0 5rpx;
			}

			.radio {
				width: 32rpx;
				height: 32rpx;
				border: 1rpx solid rgba($color: #000, $alpha: 0.1);
				border-radius: 50%;
				padding: 5rpx;
				background-color: #fff;
				@extend .flex-box;
				margin-right: 10rpx;

				.dot {
					background: $color-primary;
					width: 20rpx;
					height: 20rpx;
					border-radius: 50%;
				}
			}
		}
	}
</style>
