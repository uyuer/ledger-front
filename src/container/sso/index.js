import React, { useState, useEffect } from 'react';
import service from 'service';

export default function (props) {
    let token = window.localStorage.getItem('token');
    let [isLogin, setIsLogin] = useState(token ? true : false);
    const doLogin = async () => {
        let [, search] = window.location.search.split('?');
        let arr = search ? search.split('&') : [];
        let param = arr.reduce(function (total, item) {
            let [key, value] = item.split('=')
            total[key] = value;
            return total;
        }, {});
        let { ssoToken, ...query } = param;
        let queryString = Object.keys(query).reduce(function (total, key, index, arr) {
            return total += `${key}=${query[key]}` + (index >= arr.length - 1 ? '' : '&');
        }, '')
        let href = `${window.location.origin}${queryString && ('?' + queryString)}`;
        if (!ssoToken) {
            window.localStorage.removeItem('token');
            window.localStorage.removeItem('user');
            window.location.href = `http://sso.uyue.club:9601/login?serviceURL=${href}`;
            return;
        }
        try {
            let response = await service.sso.doLogin({
                ssoToken,
                serviceURL: href
            });
            let { token, user, redirectURL } = response;
            window.localStorage.setItem('token', token)
            window.localStorage.setItem('user', JSON.stringify(user))
            if (redirectURL) {
                window.location.href = redirectURL;
            }
            setIsLogin(true)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        if (token) {
            return
        }
        doLogin()
    }, [token])
    if (!isLogin) {
        return <div>loading...</div>
    }
    return props.children;
}