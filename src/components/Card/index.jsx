import React, { useState } from 'react';
import {
    GlobalOutlined,
    SolutionOutlined,
    UserOutlined,
    LockOutlined,
    SlidersOutlined,
    TagOutlined,
    CloudUploadOutlined,
    CloudSyncOutlined
} from 'antd';
import moment from 'moment';

import styles from './style.module.scss';

export default function Button(props) {
    const [toggle, setToggle] = useState(false);

    const data = [
        {
            icon: <GlobalOutlined />,
            name: 'website',
            alias: '网站',
            value: props.website,
            render: (text, recode, index) => {
                return <a href={recode.websiteUrl}>{text}</a>
            }
        },
        {
            icon: <SolutionOutlined />,
            name: 'accountName',
            alias: '账户名',
            value: props.accountName,
        },
        {
            icon: <UserOutlined />,
            name: 'account',
            alias: '账户',
            value: props.account,
        },
        {
            icon: <LockOutlined />,
            name: 'password',
            alias: '密码',
            value: props.password,
        },
        {
            icon: <SlidersOutlined />,
            name: 'status',
            alias: '状态',
            value: props.status,
        },
        {
            icon: <TagOutlined />,
            name: 'tags',
            alias: '标签',
            value: props.tags,
        },
        {
            icon: <CloudUploadOutlined />,
            name: 'createTime',
            alias: '创建时间',
            value: props.createTime,
            render: (text, recode, index) => {
                return moment(text).format('YYYY-MM-DD HH:mm:ss')
            }
        },
        {
            icon: <CloudSyncOutlined />,
            name: 'updateTime',
            alias: '更新时间',
            value: props.updateTime,
            render: (text, recode, index) => {
                return moment(text).format('YYYY-MM-DD HH:mm:ss')
            }
        }
    ]

    const ellipsisIndex = toggle ? data.length : 4;

    const ele = data.slice(0, ellipsisIndex).map((item, index) => {
        let { icon, name, alias, value, render } = item;

        let node = render
            ? render(value, item, index)
            : value;

        return (
            <p key={name}>
                <span title={alias}>{icon}</span>
                <span>
                    {
                        node
                    }
                </span>
            </p>
        )
    })

    function doubleClickHandle(e) {
        console.log(e)
        setToggle(!toggle)
    }

    return (
        <div className={styles.card} onDoubleClick={doubleClickHandle}>
            {
                ele
            }
        </div>
    )
}