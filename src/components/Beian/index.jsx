import React from 'react';

import styles from './style.module.scss';

// 用户头像信息
export default function Beian() {
    return (
        <div className={styles.content}>
            <span>幽钥的网络技术探索</span>
            <span>
                <a target="_blank" rel="noopener noreferrer" href="https://beian.miit.gov.cn/">蜀ICP备18009291号</a>
            </span>
        </div>
    )
}