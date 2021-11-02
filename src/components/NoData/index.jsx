import React from 'react';
import { Empty } from 'antd';
import styles from './style.module.scss';

// 无数据状态
export default function NoData({ children, ...other }) {
    return (
        <Empty className={styles.empty} imageStyle={{ padding: '24px 24px 0' }} {...other} />
    )
}