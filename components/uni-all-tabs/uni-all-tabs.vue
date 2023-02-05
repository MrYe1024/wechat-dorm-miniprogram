<template>
	<view class="tabs">
		<slot name="left"></slot>
		<view class="tabs__content">
			<scroll-view :enable-flex="true" class="scroll-view" :style="[scrollViewStyle]" scroll-with-animation
				scroll-x="true" :scroll-left="scrollLeft">
				<view class="scroll-view__list" :style="[flexStyle]">
					<block v-for="(item, index) in list" :key="index">
						<view class="item" :style="[itemStyle(index)]" @click="selectTab(index, item)">
							<view class="title">{{item.name}}</view>
							<view class="line" :style="[lineStyle]" v-if="currentIndex == index"></view>
						</view>
					</block>
				</view>
			</scroll-view>
		</view>
		<slot name="right"></slot>
	</view>
</template>

<script>
	import props from './props.js'
	/**
	 * customTabs 自定义tabs
	 * @description 用于切换选项
	 * @property {Array} list tabs数据 [{name:''}] 
	 * @property {String} bgColor 背景颜色 
	 * @property {String} textColor 未激活文字颜色
	 * @property {String} activeColor 激活文字颜色
	 * @property {String} fontSize 字体大小
	 * @property {String} textAlign 字体大小 默认28rpx
	 * @property {String} padding 内边距 25rpx 40rpx
	 * @property {String} fontWeight 文字加粗
	 * @property {String} activeLineHeight active线高度 默认10rpx
	 * @property {String} activeLineWidth  active线宽度 默认25rpx
	 * @property {String} justifyContent 平均分布
	 * @property {Object} activeStyle  自定义激活样式 { fontSize: '' }
	 * @event {Function()} change 选项改变事件
	 * */
	export default {
		mixins: [props],
		data() {
			return {
				scrollLeft: 0,
				currentIndex: 0,
			}
		},
		computed: {
			scrollViewStyle() {
				return {
					background: this.bgColor,
					fontSize: this.fontSize,
					textAlign: this.textAlign,
					fontWeight: this.fontWeight,
					color: this.textColor
				}
			},
			lineStyle() {
				return {
					width: this.activeLineWidth,
					height: this.activeLineHeight,
					background: this.activeColor
				}
			},
			itemStyle() {
				return (index) => {
					const activeStyle = this.currentIndex == index ? this.activeStyle : {};
					return {
						padding: this.padding,
						color: this.currentIndex == index ? this.activeColor : '',
						...activeStyle
					}
				}
			},
			flexStyle() {
				return {
					justifyContent: this.justifyContent
				}
			}
		},
		methods: {
			selectTab(index, item) {
				this.currentIndex = index
				this.scrollLeft = (index - 1) * 60
				this.$emit('change', {
					...item,
					index: index
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	.tabs {
		display: flex;

		&__content {
			overflow: auto;
			
			.scroll-view {
				&__list {
					white-space: nowrap;
					min-width: 100vw;
					display: flex;
					align-items: center;
					
					.item {
						box-sizing: border-box;
						display: inline-block;
						position: relative;
						padding: 25rpx;
					
						.line {
							position: absolute;
							bottom: 10rpx;
							border-radius: 999px;
							left: 50%;
							transform: translate(-50%, 0);
						}
					}
				}
			}
		}
	}
</style>
