<template>
	<view>
		<button @click="registerHandle">注册</button>
		<button @click="getUserInfoByUsername">查询用户</button>
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
					nickname: '',
					avatar: '',
					age: '',
					sex: 0,
					createTime: this.$moment('YYYY-MM-DD hh:mm:ss')
				}
			};
		},
		onLoad() {
			console.log(this.validateForm())
		},
		methods: {
			/** 
			 * @description 注册用户
		     * */
			async registerHandle() {
				if (this.validateForm()) {
					const res = await db.collection('dorm_users').add(this.formData)
					console.log(res)
				}
			},
			/**
			 * @description 根据用户名查询用户信息
			 * @return {number}
			 */
			async getUserInfoByUsername() {
				const res = await db.collection('dorm_users').where({
					username: this.formData.username
				}).get()
				return Number(res.result.data.length)
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

<style lang="scss">

</style>
