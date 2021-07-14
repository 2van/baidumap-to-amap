import addDataToAmap from './addDataToAmap.js';
import getFromBd from './getFromBd.js';
import transformData from './transformData.js';
import config from './config.js';

(async () => {
    let list = await getFromBd();
    let failList = [];
    let succList = [];
    for (let v of list) {
        let keyword = (v.name || "") + " | " + (v.city || "");
        let data = await transformData(encodeURIComponent(keyword));
        if (data === 0) {
            console.log('被反爬虫了，请做以下处理尝试解决：\n' +
                '1.登陆网页查询一个地点，解除验证弹窗，然后配置高德更新后的cookie和token\n' +
                '2.加大请求延迟时间');
            break;
        }
        let succ = data && await addDataToAmap({
            'data[0][id]': Date.now() + Math.random().sub,
            'data[0][data][item_id]': Date.now() + String(Math.random()).substr(2, 4),
            'data[0][data][address]': data.address,
            'data[0][data][name]': data.name,
            'data[0][data][point_x]': data.point_x,
            'data[0][data][point_y]': data.point_y,
            'data[0][type]': '101'
        });
        if (!succ) {
            failList.push(keyword);
        } else {
            succList.push(keyword);
        }
        console.log('导入成功：' + keyword);
        console.log(`已成功${succList.length}个，${config.delay / 1e3}秒后导入下一个`)
        // 防反爬虫
        await TimeAwait(config.delay);
    }
    failList.length && console.log(`失败的地点（${failList.length}个）：\n` + failList.join('\n'));
})();
async function TimeAwait(ms) {
    return new Promise(rs => {
        setTimeout(() => {
            rs();
        }, ms)
    })
}