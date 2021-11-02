import http from 'utils/http'
import sso from './sso';
import book from './book';
import detail from './detail';
import label from './label';

const service = {
    sso,
    book,
    detail,
    label,
};

const gen = (params, key) => {
    let [method, url] = params.split(' ');
    let defaultOptions = {};
    method = method.toLowerCase();
    return (data, options = {}) => {
        return http({ url, data, method, ...defaultOptions, ...options })
    }
};


for (const key in service) {
    for (const item in service[key]) {
        service[key][item] = gen(service[key][item], key)
    }
}

export default service;



