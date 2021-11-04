import axios from "axios";
import qs from "qs";
import { Message } from "antd";

const http = axios.create({
    paramsSerializer: params => qs.stringify(params),
});

http.interceptors.request.use(
    function (config) {
        if (config.method === "get") {
            config.params = config.data;
        }
        if (!config.headers["content-type"]) {
            config.headers["content-type"] = "application/json;charset=UTF-8";
        }
        const token = localStorage.getItem('token');
        config.headers.common['Authorization'] = 'Bearer ' + token;
        // 在发起请求请做一些业务处理
        return config;
    },
    function (error) {
        // 对请求失败做处理
        return Promise.reject(error);
    }
);
http.interceptors.response.use(
    function (response) {
        let { data: resData, status } = response;
        let { code, data, message } = resData;
        if (status !== 200) {
            const errorMsg = message || `code:${code} 系统错误`;
            return Promise.reject(errorMsg);
        }
        return data;
    },
    function (error) {
        // 用于主动取消axios请求的情况
        if (axios.isCancel(error)) {
            return Promise.reject(error);
        }
        // 对响应错误做处理
        if (error.response) {
            let { data, status, statusText } = error.response;
            let { message } = data || {};
            if (status === 401) {
                Message.error('用户未登录, 请先登录')
                window.localStorage.removeItem('token')
                if (window.location.href.indexOf("login") === -1) {
                    setTimeout(() => {
                        window.location.href = `${window.location.hash ? '#' : ''}/login`;
                    }, 500)
                }
            } else {
                Message.error(status + ' ' + (message || statusText))
            }
        }
        return Promise.reject(error);
    }
);

http.uploadFile = function (url, data, options) {
    let form = new FormData();

    for (const dataKey in data) {
        if (Object.prototype.hasOwnProperty.call(data, dataKey)) {
            form.set(dataKey, data[dataKey]);
        }
    }

    return http({
        method: "POST",
        data: form,
        ...options
    });
};

export default http;
