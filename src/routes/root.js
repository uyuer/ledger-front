import React, { useState, useEffect } from 'react';
import { Switch, BrowserRouter, Route, Redirect } from 'react-router-dom';

import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';

import Common, { CommonContext } from 'components/Common';
import Routes from './routes';
import SSO from '../sso';

function RenderRoute() {
    return Routes.map(o =>
        <Route key={o.path} exact={o.exact} path={`/${o.path}`} component={o.component} />
    )
}

export default function () {
    return (
        <CommonContext.Provider value={Common()}>
            <ConfigProvider locale={zhCN}>
                <SSO>
                    <BrowserRouter>
                        <Switch>
                            <RenderRoute />
                        </Switch>
                    </BrowserRouter>
                </SSO>
            </ConfigProvider>
        </CommonContext.Provider>
    );
}