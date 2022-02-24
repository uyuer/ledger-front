import React from 'react';
import { Switch, BrowserRouter, Route } from 'react-router-dom';

import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';

import Common, { CommonContext } from 'components/Common';
import Routes from './routes';

function RenderRoute() {
    return Routes.map(o =>
        <Route key={o.path} exact={o.exact} path={o.path} component={o.component} />
    )
}

export default function () {
    return (
        <CommonContext.Provider value={Common()}>
            <ConfigProvider locale={zhCN}>
                <BrowserRouter>
                    <Switch>
                        <RenderRoute />
                    </Switch>
                </BrowserRouter>
            </ConfigProvider>
        </CommonContext.Provider>
    );
}