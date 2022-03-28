var host = ''
if (process.env.NODE_ENV === 'development') {
	host = ''
}else {
	host = ''
}

export { host };