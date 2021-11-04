import React from 'react';
import classnames from 'classnames';

import styles from './style.module.scss';

// 用户头像信息
export default function WebsiteName(props) {
    let { children, className, style, display = 'block', ...other } = props;
    let displayStyle = {
        'block': { display: 'block' },
        'inlineBlock': { display: 'inline-block' },
        'inline': { display: 'inline' },
    }[display];
    return (
        <h1 className={classnames(styles.title, className)} style={{ ...displayStyle, ...style }} {...other}>
            幽钥的小破站
        </h1>
    )
}