
import config from './config.js';
import https from 'https';

let query = {
    newmap: 1,
    reqflag: "pcmap",
    biz: 1,
    from: "webmap",
    da_par: "direct",
    qt: "fav",
    mode: "get",
    type: "favdata",
    limit: config.baiduLimit,
    lastver: 0,
}
let getUrl = "https://ditu.baidu.com/?" + Object.entries(query).map(v => v.join("=")).join("&");


export default async function getFromBd() {
    return new Promise(rs => {
        https.get(getUrl, {
            headers: {
                Cookie: config.baidu
            }
        }, (resp) => {
            let data = '';

            // A chunk of data has been received.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                let list = JSON.parse(data).sync.newdata.filter(v => v.detail?.data?.sourcedata);
                rs(list.map(v => ({
                    name: v.detail.data.extdata.name,
                    city: v.detail.data.tags && v.detail.data.tags.find(v => v.type == 2)?.name
                })))
            });

        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
    })
}