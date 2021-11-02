import React from 'react';
import styles from './style.module.scss';

// 个人中心导航菜单
export default function HomeMenu() {
    return (
        <div className={styles.menu}>
            <div className={styles.menuItem}>账户管理</div>
            <div className={styles.menuItem}>用户中心</div>
        </div>
    )
}
