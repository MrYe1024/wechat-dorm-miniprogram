<template>
	<view class="uni-status-bar" :style="style"></view>
</template>

<script>
	import props from './props.js'
	/**
	 * statusBar 状态栏
	 * @description 用于自定义导航栏的时候固定状态栏或者改变状态栏样式
	 * @property {String} backgroundColor 背景颜色 
	 * */
	export default {
		mixins: [props],
		computed: {
			style() {
				return {
					background: this.backgroundColor,
					height: uni.getSystemInfoSync().statusBarHeight + 'px'
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.uni-status-bar {
		position: fixed;
		width: 100vw;
		top: 0;
		z-index: 1000;
	}
</style>
