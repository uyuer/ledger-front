import React, { useState, useEffect } from 'react';
import { Switch, HashRouter, BrowserRouter, Route, Redirect } from 'react-router-dom';

import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';

import Common, { CommonContext } from 'components/Common';
import service from 'service';
import Routes from './routes';
import SSO from '../sso';

function RenderRoute() {
    return Routes.map(o =>
        <Route key={o.path} exact={o.exact} path={`/${o.path}`} component={o.component} />
    )
}

export default function () {
    let token = window.localStorage.getItem('token');
    let [isLogin, setIsLogin] = useState(token ? true : false);
    useEffect(() => {
        if (token) {
            return;
        }
        let urlParams = new URLSearchParams(window.location.search);
        let ssoToken = urlParams.get('ssoToken');
        let [, search] = window.location.search.split('?');
        let arr = search ? search.split('&') : [];
        let param = arr.filter(function (item) {
            let [key] = item.split('=')
            return key != 'ssoToken';
        })
        let paramStr = param.join('&');
        let href = window.location.origin + (paramStr ? '?' + paramStr : '');
        console.log(href)
        if (ssoToken) {
            service.sso.doLogin({
                ssoToken,
                serviceURL: href
            }).then(response => {
                let { token, user, redirectURL } = response;
                console.log(response)
                window.localStorage.setItem('token', token)
                window.localStorage.setItem('user', JSON.stringify(user))
                if (redirectURL) {
                    console.log('重定向', redirectURL)
                    window.location.href = redirectURL;
                }
                setIsLogin(true)
            }).catch(error => {
                console.log(error)
            })
        } else {
            window.localStorage.removeItem('token');
            window.localStorage.removeItem('user');
            window.location.href = `http://sso.uyue.club:9601/login?serviceURL=${href}`
        }
    }, [])
    return (
        <CommonContext.Provider value={Common()}>
            <ConfigProvider locale={zhCN}>
                {
                    isLogin
                        ? <BrowserRouter>
                            <Switch>
                                <RenderRoute />
                            </Switch>
                        </BrowserRouter>
                        : <div>登录中...</div>
                }
            </ConfigProvider>
        </CommonContext.Provider>
    );
}