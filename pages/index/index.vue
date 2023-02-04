<template>
	<view class="container">
		<text>{{title}}</text>
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
				title: 'Hello',
				tabList: [{
					name: '当前未处理',
					status: '未处理'
				}, {
					name: '当前已处理',
					status: '已处理'
				}],
				floorList: floor,
				applyData: [],
				isEndOfList: null
			}
		},
		onLoad() {
			// #ifdef MP-WEIXIN
			this.getUserOpenid()
			// #endif
			this.getApplyData()
			this.getApplyDataItem(1)
			this.onShareMessage()
		},
		methods: {
			// 获取用户openid
			async getUserOpenid () {
				uni.login({
					onlyAuthorize: true,
					provider: 'weixin',
					success: async res => {
						console.log(res)
						const  { result } = await uniCloud.callFunction({
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
				console.log(res)
				this.applyData = [...this.applyData, ...res.result.data]
				this.isEndOfList = res.result.data.length < limit ? true : false
				uni.hideLoading()
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
				console.log(res)
				uni.hideLoading()
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
				console.log(res)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
	}
</style>
