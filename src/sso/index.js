import React, { useState, useEffect, useCallback } from 'react';
import service from 'service';

export default function (props) {
    let [loading, setLoading] = useState(true)
    const doLogin = useCallback(async () => {
        let token = window.localStorage.getItem('token');
        if (token) {
            return setLoading(false)
        }
        let surl = await service.sso.info();
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
        try {
            let response = await service.sso.doLogin({
                ssoToken,
                serviceURL: href
            });
            let { token, user, redirectURL } = response;
            window.localStorage.setItem('token', token)
            window.localStorage.setItem('user', JSON.stringify(user))
            window.localStorage.setItem('surl', surl);
            if (redirectURL) {
                window.location.href = redirectURL;
            }
            setLoading(false)
        } catch (error) {
            console.log(error)
        }
    }, [])
    useEffect(() => {
        console.log(1)
        doLogin()
    }, [])
    if (loading) {
        return <div>loading...</div>
    }
    return props.children;
}