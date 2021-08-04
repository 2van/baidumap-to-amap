import request from 'request';
import config from './config.js';

export default function transformData(keywords) {
    return new Promise(rs => {
        let options = {
            'method': 'GET',
            'url': 'https://www.amap.com/service/poiInfo?query_type=TQUERY&keywords=' + keywords,
            'headers': {
                'Cookie': config.amap,
                'Referer': 'https://www.amap.com/',
                'x-csrf-token': config.amapToken
            }
        };
        request(options, function (error, response) {
            if (error) throw new Error(error);
            let d = JSON.parse(response.body);
            if (!d.data || !d.data.poi_list) {
                console.log("query by keywords fail");
                rs(0);
                return;
            }
            let pos = d.data.poi_list[0];

            let options2 = {
                'method': 'GET',
                'url': 'https://www.amap.com/detail/get/detail?id=' + pos.id,
                'headers': {
                    'Cookie': config.amap,
                    'Referer': 'https://www.amap.com/',
                    'x-csrf-token': config.amapToken
                }
            };
            request(options2, function (error, response) {
                if (error) throw new Error(error);
                let d = JSON.parse(response.body);
                if (!d.data) {
                    console.log("get detail fail:" + response.body);
                    rs(0);
                    return;
                }
                let data = {
                    name: d.data.base.name,
                    address: d.data.base.address,
                    point_x: d.data.base.pixelx,
                    point_y: d.data.base.pixely
                }
                rs(data);
            });

        });
    })
}