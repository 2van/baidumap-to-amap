# baidumap-to-amap
百度地图收藏点转移到高德地图快速方案

# 环境
Nodejs v12+；

# 使用
- `npm i`
- 配置config.js下的cookie，token，转移的数量规模
- node index.js

# 注意事项
- 配置更大的延迟时间来避免高德反爬虫，经测试10秒是顺利的。
- 被反爬虫后去高德网页解除验证码验证，然后更新cookie和token，并适当加大延迟。