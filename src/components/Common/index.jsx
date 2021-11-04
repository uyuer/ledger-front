import { useState } from 'react';
import { Message } from 'antd';

import { getToken, removeToken } from 'utils/util';
import service from 'service'
import CommonContext from './context';

export { CommonContext };

export default function Common(props) {
    const status = getToken() ? true : false;
    const [logged, loggedChange] = useState(status);
    const [globalLoading, setGlobalLoading] = useState(false);

    const logout = (cb) => {
        console.log('退出')
        service.sso.logout().then(data => {
            Message.success('已退出');
        }).finally(() => {
            loggedChange(false);
            removeToken();
            cb && cb()
        })
    }

    return {
        logged, loggedChange,
        globalLoading, setGlobalLoading,
        logout,
    }
}