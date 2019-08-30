const debug = process.env.NODE_ENV === 'development' ? true : false;
// 测试环境地址
if (debug) {
    var host = 'http://127.0.0.1:8490/operator-data'
    var webUrl = 'http://localhost:9998/#/'
} else {
    var host = 'http://52.195.3.163/operator-data'; // 测试服务器
    var webUrl = 'http://52.195.3.163/panda_operate_data/#/'
    //正式环境地址
	// var host = 'https://api.pinganzhiyuan.com/panda_loan_backend_server';
    // var host = 'http://119.23.12.36:8081/panda_loan_backend_server';
}
console.warn('当前resource: ', host);

let resources = {
    // 登录页面
    webUrl: webUrl,
    loginWeb: `${webUrl}login`,
    homeWeb: `${webUrl}`,

    host: host,
    // graphQL查询Api
    graphQlApi: `${host}\/graphql`,
    // 登录校验
    auth() {
        return `${host}\/auth`
    },
    // 重置密码
    resetPass() {
        return  `${host}\/reset\/password`
    },
    // 刷新
    refresh() {
        return  `${host}\/refresh`
    },
    resetEnabled() {
        return  `${host}\/system\/user\/reset\/enabled`
    },



    // 上传图片
    uploadImage() {
        return `${host}\/uploadImage`
    },
    uploadPackage() {
        return `${host}\/uploadFile`
    },
    //登录
    requestLogin() {
        return `${host}/tokens`
    },
    //更新产品详情的相关接口
    products(id) {
        return typeof (id) == 'undefined' ? `${host}/products` : `${host}/products\/${id}`
    },
    //更新产品详情的相关接口v2
    productsV2(id) {
        return typeof (id) == 'undefined' ? `${host}/v2\/product` : `${host}/v2\/product\/${id}`
    },
	// 筛选产品
    selectProducts() {
        return `${host}\/products\/query`
	},
	// 产品排序
	sortProducts() {
		return `${host}\/products\/sort`
	},
	// 获取栏位
    selectColumns() {
        return `${host}\/columns`
    },
    //获取app跟渠道
    appClients() {
        return `${host}\/appClients`
    },
    // 获取渠道列表
    appChannels() {
        return `${host}\/channels`
    },
    //更新clientVersion
    clientVersions(id) {
        return typeof (id) == 'undefined' ? `${host}/clientVersions` : `${host}/clientVersions\/${id}`
    },
    //clientVersion的cascade  graphql
    cascade() {
        return `${host}\/cascade`
    },
    //clientVersion的cascade  restful
    searchCondition() {
        return `${host}\/searchCondition`
    },
    // 编辑tabModuleMapping
    tabModule(id) {
        return typeof (id) == 'undefined' ? `${host}/tabModule` : `${host}/tabModule\/${id}`
    },
    // 获取模版配置信息
    template() {
        return `${host}\/template\/clientVersions`
    },
    mudule() {
        return `${host}\/acquire\/module`
    },
    templateModule(id) {
        return `${host}\/template\/tabModules\/${id}`
    },
    updateTabModule(id) {
        return `${host}\/updateTabModule\/${id}`
    },
    // 配置挡板
    addTemplate() {
        return `${host}\/redis\/template\/add`
    },
    // 删除挡板
    delTemplate(key) {
        return `${host}\/redis\/template\/del\/${key}/`
    },
    // 查询日志信息
    getDeviceLog(templateId) {
        return `${host}\/deviceLog\/checkout\/${templateId}`
    }
};

export default resources;
