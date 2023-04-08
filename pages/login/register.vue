<template>
	<view class="register-container">
		<view class="banner-view">
			<text>设置账号信息</text>
		</view>
		<view class="form-card-view">
			<view class="form-item">
				<text class="title">账号：</text>
				<input type="text" v-model="formData.username" @blur="getUserInfoByUsername('blur')" @input="getUserInfoByUsername('input')" placeholder="名字/手机号/邮箱">
				<text class="tips" v-if="isExistUser">账号已注册</text>
			</view>
			<view class="form-item">
				<text class="title">设置密码：</text>
				<input type="password" v-model="formData.password" placeholder="请输入密码">
			</view>
			<view class="form-item">
				<text class="title">确认密码：</text>
				<input type="password" v-model="confirmPwd" @blur="checkPassword('blur')" @input="checkPassword('input')" placeholder="请再次输入密码">
				<text class="tips" v-if="!isPwdPass">密码错误</text>
			</view>
		</view>
		<view class="submit-btn-view">
			<button class="format-button" @click="registerHandle">注册</button>
		</view>
	</view>
</template>

<script>
	const db = uniCloud.database()
	export default {
		data() {
			return {
				formData: {
					username: '15113624648',
					password: 'a123456',
					nickname: 'aYuan',
					avatar: 'https://picsum.photos/100/100',
					age: '1997',
					status: 1,
					sex: 0,
					createTime: this.$moment('YYYY-MM-DD hh:mm:ss')
				},
				isExistUser: false, // 用户是否已存在
				isPwdPass: true, // 确认密码校验
				confirmPwd: null // 确认密码
			};
		},
		onLoad() {
			// console.log(this.getUserInfoByUsername())
		},
		methods: {
			/** 
			 * @description 注册用户
		     * */
			async registerHandle() {
				if (this.validateForm() && !this.isExistUser && this.checkPassword()) {
					uni.showLoading({
						title: '注册中...',
						mask: true
					})
					const res = await db.collection('dorm_users').add(this.formData)
					uni.hideLoading()
					if (res.success) {
						uni.showToast({
							title: '注册成功',
							icon: 'success',
							duration: 1500
						})
						setTimeout(() => {
							uni.reLaunch({
								url: '/pages/login/login'
							})
						}, 1500)
					}
				}
			},
			/**
			 * @description 根据用户名查询用户信息
			 */
			async getUserInfoByUsername(evt) {
				if (evt === 'input') {
					this.isExistUser = false
				}
				if (evt === 'blur' && this.formData.username) {
					const res = await db.collection('dorm_users').where({
						username: this.formData.username
					}).get()
					Number(res.result.data.length) === 0 ? this.isExistUser = false : this.isExistUser = true
				}
			},
			/**
			 * @description 确认密码对比检查
			 * @return {boolean}
			 */
			checkPassword(evt) {
				if (evt === 'input') {
					this.isPwdPass = true
				}
				if (evt === 'blur' && this.confirmPwd) {
					this.formData.password === this.confirmPwd ? this.isPwdPass = true : this.isPwdPass = false
				}
				return this.formData.password === this.confirmPwd
			},
			/**
			 * @description 表单验证
			 */
			validateForm() {
				let isValidate = true
				const tip = [{
					key: 'username',
					title: '请设置账号'
				}, {
					key: 'password',
					title: '请设置密码',
					RegExp: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/,
					RegExpTitle: '密码需要包含字母，数字，长度6位以上'
				}, {
					key: 'nickname',
					title: '请设置昵称'
				}, {
					key: 'avatar',
					title: '请上传头像'
				}, {
					key: 'age',
					title: '请设置年龄'
				}]
				try {
					Object.keys(this.formData).forEach(item => {
						const tipIndex = tip.findIndex(tipItem => tipItem.key === item)
						if(this.formData[item] === '' || !this.formData[item]) {
							if (tipIndex >= 0) {
								uni.showToast({
									title: tip[tipIndex].title,
									icon: 'error',
									duration: 1000
								})
								throw new Error
							}
						}
						if (tip[tipIndex]?.RegExp) {
							const isRegExp = tip[tipIndex].RegExp.test(this.formData[item])
							if(!isRegExp) {
								uni.showToast({
									title: tip[tipIndex].RegExpTitle,
									icon: 'error',
									duration: 1000
								})
								throw new Error
							}
						}
					})
				} catch(e) {
					isValidate = false
					console.log(e)
				}
				return isValidate
			}
		}
	}
</script>

<style lang="scss" scoped>
.register-container {
	.banner-view {
		background-color: #00b7ff;
		height: 200rpx;
		font-size: 50rpx;
		color: #fff;
		position: relative;
		text {
			position: absolute;
			left: 30rpx;
			bottom: 30rpx;
		}
	}
	.form-card-view {
		background-color: #fff;
		padding: 30rpx;
		.form-item {
			margin-bottom: 30rpx;
			.title {
				font-size: 32rpx;
				display: inline-block;
				margin-bottom: 10rpx;
			}
			input {
				padding: 20rpx 20rpx;
				background: #e0e7ec;
			}
			.tips {
				font-size: 24rpx;
				color: #dd524d;
			}
		}
	}
	.submit-btn-view {
		padding: 30rpx;
		button {
			background-color: #00b7ff;
			padding: 20rpx;
			font-size: 32rpx;
			color: #fff;
		}
	}
}
</style>
