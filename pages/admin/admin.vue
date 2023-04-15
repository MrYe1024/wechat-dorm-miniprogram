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
							<uni-tag style="width: fit-content;" size="mini" :text="applyStatus(item.status)" :type="tagType(item.status)" />
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
		<uni-all-empty-state v-if="!applyData.length" :imgUrl="emptyState[currentIndex]"></uni-all-empty-state>
		<view class="footer-view" v-if="applyData.length">
			<text @click="copyOpenid">@2019-2023 宿舍报修助手</text>
		</view>
	</view>
</template>

<script>
	import mixin from '../../mixins/mixin.js'
	const db = uniCloud.database()
	const http = uniCloud.importObject('feedbackSubscribeMsg')
	const limit = 20
	let tabsIndex = 0
	let floorIndex = 0
	export default {
		mixins: [mixin],
		data() {
			return {
				isAdminPage: true
			}
		},
		onLoad(options) {
			this.getApplyData()
		},
		// 触底刷新
		onReachBottom() {
			!this.isEndOfList && this.getApplyData()
		},
		methods: {
			/**
			 * @description 根据申报状态、楼层、获取申报数据
			 * */
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
			/**
			 * @description 切换tab获取申报数据、投放插屏广告
			 * */
			changeTabHandle(evt) {
				tabsIndex = evt.index
				this.currentIndex = evt.index
				this.applyData = []
				this.getApplyData()
			},
			/**
			 * @description 选择楼栋、根据申报状态、楼层、获取申报数据
			 * */
			async getApplyDataItem(floor) {
				uni.showLoading({
					title: '加载中...',
					mask: true
				})
				const res = await db.collection('dorm_apply').where({
					floor: floor,
					status: this.tabList[tabsIndex].status
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
					this.getApplyDataItem(floorIndex);
				}
			},
			/**
			 * @description 接收订单
			 * */
			async confirmOrder (event) {
				if (!this.isAdminValidate()) return
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
			/**
			 * @description 完成订单
			 * */
			completeOrder (event) {
				if (!this.isAdminValidate()) return
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
			/**
			 * @description 删除订单
			 * */
			deleteOrder (event) {
				if (!this.isAdminValidate()) return
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
			/**
			 * @description 管理员验证
			 * */
			isAdminValidate () {
				const isAdmin = uni.getStorageSync('isAdmin')
				if (!isAdmin) {
					uni.showToast({
						title: '暂无权限',
						icon: 'error'
					})
				}
				return isAdmin
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
</style>
