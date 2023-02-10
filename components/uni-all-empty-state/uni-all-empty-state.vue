<template>
	<view class="uni-all-empty-state">
		<view class="image-view" :style="[imgViewStyle]">
			<image :src="imgUrl" :style="[imgStyle]" mode="heightFix"></image>
		</view>
	</view>
</template>

<script>
	/** 
	 * empty-state 空状态组件
	 * @description 用于无数据、请求错误等提示
	 * @property {String} imgUrl 图片src
	 * @property {String} imgWidth 图片宽度
	 * @property {String} imgHeight 图片高度
	 * @property {String} paddingTB 上下内边距
	 * 
	 * */
	export default {
		props: {
			imgUrl: {
				type: String,
				default: 'https://picsum.photos/300/300'
			},
			imgWidth: {
				type: String,
				default: '400rpx'
			},
			imgHeight: {
				type: String,
				default: '400rpx'
			},
			paddingTB: {
				type: String,
				default: '100rpx'
			}
		},
		name:"uni-all-empty-state",
		data() {
			return {
				
			};
		},
		computed: {
			imgStyle () {
				return {
					width: this.imgWidth,
					height: this.imgHeight
				}
			},
			imgViewStyle () {
				return {
					paddingTop: this.paddingTB,
					paddingBottom: this.paddingTB
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
.uni-all-empty-state {
	.image-view {
		text-align: center;
		image {
			vertical-align: middle;
		}
	}
}
</style>