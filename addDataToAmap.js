import request from 'request';
import config from './config.js';

export default function addDataToAmap(formData) {
    return new Promise(rs => {
        let options = {
            'method': 'POST',
            'url': 'https://www.amap.com/service/fav/addFav?',
            'headers': {
                'Cookie': config.amap,
                'Referer': 'https://www.amap.com/',
                'x-csrf-token': config.amapToken
            },
            formData
        };
        try {
            request(options, function (error, response) {
                if (error) throw new Error(error);
                if (JSON.parse(response.body).status == 1) {
                    rs(1);
                } else {
                    rs(0);
                }
            });
        } catch (err) {
            console.error(err);
            rs(0);
        }
    })
}