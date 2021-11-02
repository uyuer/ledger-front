import React, { useState, useEffect } from 'react';
import doLogin from './doLogin';

export default function (props) {
    let token = window.localStorage.getItem('token');
    let [isLogin, setIsLogin] = useState(token ? true : false);
    async function doLoginHandle() {
        let response = await doLogin();
        let { token, user, redirectURL } = response;
        setIsLogin(true)
    }
    useEffect(() => {
        !token && doLoginHandle()
    }, [])
    if (!isLogin) {
        return <div>loading...</div>
    }
    return props.children;
}