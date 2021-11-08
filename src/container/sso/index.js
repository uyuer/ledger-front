import React, { useState, useEffect, useContext, useCallback } from 'react';
import service from 'service';
import { CommonContext } from 'components/Common';

export default function (props) {
    let { logged, loggedChange } = useContext(CommonContext);
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
            let surl = window.localStorage.getItem('surl');
            surl && (window.location.href = `${surl}?serviceURL=${href}`);
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
            loggedChange(true)
        } catch (error) {
            console.log(error)
        }
    }
    const getServerInfo = useCallback(async () => {
        service.sso.info().then((data) => {
            window.localStorage.setItem('surl', data);
            doLogin()
        })
    }, [doLogin])
    useEffect(() => {
        if (logged) {
            return
        }
        getServerInfo()
    }, [logged])
    if (!logged) {
        return <div>loading...</div>
    }
    return props.children;
}