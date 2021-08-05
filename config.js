const config = {
    "baiduLimit": 300,//收藏数量上限
    "baidu": "ditu.baidu.com-request-header-cookie",
    "amap": "amap.com-request-header-cookie",
    "amapToken": "amap.com-request-header-x-csrf-token",
    "maxRetry": 15, //高德最大重试次数
    "delay": 10e3 // 高德请求延迟时间（毫秒）
}
export default config;