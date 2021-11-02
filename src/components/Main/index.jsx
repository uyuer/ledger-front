import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import styles from './style.module.scss';

import WebsiteName from 'components/WebsiteName';
import Navigate from 'components/Navigate';

// 用户头像信息
export default function Main(props) {
    return (
        <div className={styles.des}>
            {/* <p className={styles.title}>幽钥的个人网站</p> */}
            <div className={styles.subDescription}><WebsiteName /></div>
            <p className={styles.subDescription}>随着互联网的广泛普及，个人用户持有的网站账户也越来越多，部分不常用网站非常容易忘记或遗失，本系统为用户提供网站账户的管理功能，用户可以在本网站保存网站地址、账号、密码等信息。</p>
            <p className={styles.subDescription}>为了确保用户的网站账户密码不被泄露，网站账户密码使用AES加密方式，由用户输入的六位数字作为加密密钥，由用户本人保存密钥</p>
            <p className={styles.subDescription}>欢迎体验</p>
            {/* <div className={styles.subDescription}><Navigate /></div> */}
        </div>
    )
}