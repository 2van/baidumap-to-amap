import addDataToAmap from './addDataToAmap.js';
import getFromBd from './getFromBd.js';
import transformData from './transformData.js';
import config from './config.js';

(async () => {
    let list = await getFromBd();
    // 打乱，下次重试不用从头开始
    list = shuffle(list);
    console.log(JSON.stringify(list));

    let errCnt = 0; //err计数器

    let failList = [];
    let succList = [];
    for (let v of list) {
        if(v.name == "HOME" || v.name == "家" || v.name == "公司"){
            continue;
        }

        let keyword = (v.name || "") + " | " + (v.city || "");
        let data = await transformData(encodeURIComponent(keyword));
        if (data === 0) {
            errCnt++;
            if (errCnt >= config.maxRetry) {
                console.error('被反爬虫了，请做以下处理尝试解决：\n' +
                '1.登陆网页查询一个地点，解除验证弹窗，然后配置高德更新后的cookie和token\n' +
                '2.加大请求延迟时间');
                break;
            }
            list.push({"name": v.name, "city":v.city});

            let msec= parseInt(String(Math.random()).substr(2, 4));
            console.warn(`可能被反爬虫了，本次跳过，等待 ${msec / 1e3}秒后继续...`)
            await TimeAwait(msec);
            continue;
        }
        let param = {
            // 'data[0][id]': Date.now() + Math.random().sub,
            'data[0][id]': data.point_x + data.point_y, //解决ID变化重试出现多个相同名称的地址
            'data[0][data][item_id]': Date.now() + String(Math.random()).substr(2, 4),
            'data[0][data][address]': data.address,
            'data[0][data][name]': data.name,
            'data[0][data][point_x]': data.point_x,
            'data[0][data][point_y]': data.point_y,
            'data[0][type]': '101'
        }
        let succ = data && await addDataToAmap(param);
        console.log(param);
        if (!succ) {
            failList.push(keyword);
        } else {
            succList.push(keyword);
        }

        errCnt = 0; //重置err计数器
        let msec2 = parseInt(String(Math.random()).substr(2, 4)) * 2;
        console.log('导入成功：' + keyword);
        console.log(`已成功${succList.length}个，${msec2 / 1e3}秒后导入下一个`)

        // 防反爬虫
        await TimeAwait(msec2);
        // await TimeAwait(config.delay);
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
function shuffle(arr) {
    return arr.sort(() => Math.random() - 0.5);
}