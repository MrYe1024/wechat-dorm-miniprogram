export default {
	props: {
		list: { 
			type: Array
		},
		bgColor: { // 背景颜色
			type: String,
			default: 'white'
		},
		textColor: { // 文字颜色
			type: String,
			default: 'black'
		},
		activeColor: { // 选中颜色
			type: String,
			default: '#d24e51'
		},
		fontSize: { // 字体大小
			type: String,
			default: '28rpx',
		},
		textAlign: { // 对齐方式
			type: String,
			default: 'center',
		},
		padding: { // tab-item 左右padding
			type: String,
			default: '25rpx 40rpx',
		},
		justifyContent: {
			type: String
		},
		fontWeight: { // 文字加粗
			type: String,
			default: 'bold'
		},
		activeLineHeight: { // 底部活动线高度
			type: String,
			default: '10rpx'
		},
		activeLineWidth: { // 底部活动线宽度
		    type: String,
		    default: '25rpx'
		},
		activeStyle: { // 自定义样式
			type: Object
		}
	}
}