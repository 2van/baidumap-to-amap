import addDataToAmap from './addDataToAmap.js';
import getFromBd from './getFromBd.js';
import transformData from './transformData.js';

(async () => {
    let list = await getFromBd();
    let failList = [];
    let succList = [];
    for (let v of list) {
        let keyword = (v.name || "") + " | " + (v.city || "");
        let data = await transformData(encodeURIComponent(keyword));
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
            await TimeAwait(5e3);
        }
    }
    console.log(failList);
    console.log(succList.length, failList.length);
})();
async function TimeAwait(ms) {
    return new Promise(rs => {
        setTimeout(() => {
            rs();
        }, ms)
    })
}