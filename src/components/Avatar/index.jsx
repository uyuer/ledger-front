import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Message } from 'antd';
import moment from 'moment';

import styles from './style.module.scss';

import Navigate from 'components/Navigate';

import service from 'service';
import avatar from 'images/avatar.jpg';
const format = 'YYYY-MM-DD HH:mm:ss'

// 用户头像信息
export default function Avatar() {
    const [userInfo, setUserInfo] = useState({})
    useEffect(() => {
        getUserInfo();
    }, [])
    async function getUserInfo(value) {
        let userStr = localStorage.getItem('user')
        let user = JSON.parse(userStr || '{}');
        let params = { id: user.id };
        service.user.findOne(params)
            .then(data => {
                // console.log(data)
                console.log(moment(data.createTime).format(format))
                console.log(moment(data.updateTime).format(format))
                setUserInfo(data)
            })
            .finally(() => {
                console.log('获取用户信息')
            })
    };
    return (
        <div className={styles.avatar}>
            <div className={styles.avatarImg}>
                {/* TODO: 头像路径问题: 后端返回根路径,前端获取地址拼接; 或者后端直接返回完整路径 */}
                <img src={window.location.protocol + '//' + userInfo.avatarFullPath || avatar} alt='' />
            </div>
            <div className={styles.accountInfo}>
                <p>
                    <span>{userInfo.username || '--'}</span>
                </p>
                <p>
                    <span>{userInfo.email || '--'}</span>
                </p>
                {/* <p className={styles.description}>
                    <span>邮箱已激活</span>
                </p> */}
                <p className={styles.description}>
                    <span>账户状态{userInfo.status === '1' ? '正常' : '冻结'}</span>
                </p>
                {/* <p className={styles.description}>
                    <span>创建时间：{moment(userInfo.createTime).format(format) || '--'}</span>&nbsp;<span>更新时间：{moment(userInfo.updateTime).format(format) || '--'}</span>
                </p> */}
                <p className={styles.description}>
                    <span>创建时间：{moment(userInfo.createTime).format(format) || '--'}</span>
                </p>
                {/* <p className={styles.description}>
                    <span>更新时间：{moment(userInfo.updateTime).format(format) || '--'}</span>
                </p> */}
                <Navigate title={false} direction={'vertical'} split={''} size={0} />
                {/* <p className={styles.navigator}>
                    <Link to={'/home'}><span>首页</span></Link>
                </p>
                <p className={styles.navigator}>
                    <Link to={'/accounts'}><span>账户管理</span></Link>
                </p>
                <p className={styles.navigator}>
                    <Link to={'/users'}><span>个人中心</span></Link>
                </p>
                <p className={styles.navigator}>
                    <Link to={'/home'}><span>退出</span></Link>
                </p> */}

            </div>
        </div>
    )
}