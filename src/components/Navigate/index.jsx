import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { useHistory } from "react-router-dom";
import { Space } from 'antd'
import classnames from 'classnames';

import styles from './style.module.scss';

import { CommonContext } from 'components/Common';
import { getToken, getType } from 'utils/util';

// 用户头像信息
export default function Navigate(props) {
    const history = useHistory();
    const token = getToken();
    let { logged, logout } = useContext(CommonContext);
    let {
        title = true,
        direction = 'horizontal',
        split = '/',
        size = 'small',
        theme = 'blue',
        style = {},
        className = '',
    } = props;

    let themeType = getType(theme);
    let themeStyle = {
        'blue': {
            default: { color: '#1890ff', fontWeight: 'bold' },
            active: { color: '#3b5f70', fontWeight: 'bold' },
        },
        'write': {
            default: { color: '#ffffff', fontWeight: 'bold' },
            active: { color: '#3b5f70', fontWeight: 'bold' },
        }
    };
    let navTheme = {
        'string': themeStyle[theme],
        'object': { ...themeStyle['blue'], ...theme }
    }[themeType];

    const logoutHandle = () => {
        logout(() => {
            history.push("/home");
        })
    }

    const menu = [
        { name: '首页', to: '/home' },
        { name: '个人中心', to: '/user' },
        { name: '账号管理', to: '/accounts' },
        { name: '账本管理', to: '/ledgers' },
    ]
    const nav = menu.concat(token ? [{ name: '退出' }] : [{ name: '登录', to: '/login' }, { name: '注册', to: '/register' }]);

    const splitEle = <span style={navTheme.default}>{split}</span>
    return (
        <div className={classnames(styles.link, className)} style={style}>
            {/* {title || <span>网站导航：</span>} */}
            <Space {...{ direction, split: splitEle, size }}>
                {
                    nav.map(item => {
                        if (item.to) {
                            return <NavLink style={navTheme.default} activeStyle={navTheme.active} to={item.to} key={item.name}>{item.name}</NavLink>
                        }
                        return <a style={navTheme.default} key={item.name} onClick={logoutHandle}>退出</a>
                    })
                }
                {/* <NavLink style={navTheme.default} activeStyle={navTheme.active} to="/home">首页</NavLink>
                <NavLink style={navTheme.default} activeStyle={navTheme.active} to="/home">个人主页</NavLink>
                <NavLink style={navTheme.default} activeStyle={navTheme.active} to="/accounts">账户管理</NavLink>
                <NavLink style={navTheme.default} activeStyle={navTheme.active} to="/ledgers">账本</NavLink>
                {token
                    ? <a style={navTheme.default} onClick={logoutHandle}>退出</a>
                    : <>
                        <NavLink style={navTheme.default} activeStyle={navTheme.active} to="/login">登录</NavLink>
                        <NavLink style={navTheme.default} activeStyle={navTheme.active} to="/register">注册</NavLink>
                    </>} */}
            </Space>
        </div>
    )
}