import React, { useState } from 'react';
import { Message } from 'antd';

import { removeToken } from 'utils/util';
import service from 'service'
import CommonContext from './context';


export { CommonContext };

export default function Common(props) {
    const loggedStr = sessionStorage.getItem('logged') || false
    const [logged, loggedChange] = useState(JSON.parse(loggedStr))
    const [globalLoading, setGlobalLoading] = useState(false);

    const setLogged = (value) => {
        sessionStorage.setItem('logged', value)
        loggedChange(value)
    }
    const logout = (cb) => {
        console.log('退出')
        service.sso.logout()
            .then(data => {
                Message.success('已退出');
            })
            .finally(() => {
                setLogged(false);
                removeToken();
                cb && cb()
            })
    }

    return {
        logged, setLogged,
        globalLoading, setGlobalLoading,
        logout,
    }
}