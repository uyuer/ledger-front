import React from 'react';
import styles from './style.module.scss';

export default function Button(props) {
    let {
        animation = 'draw', // [draw,meet,center,circle]
        size = 'normal', // [small,normal,large]
        ghost = false, // 默认幽灵模式
        className,
        type = props.type || 'button',
        children,
        onClick
    } = props;

    let classNames = [
        styles[animation],
        styles[size],
    ];

    !ghost ? classNames.push(styles.ghost) : classNames.push(styles.noGhost);

    className && classNames.push(className);

    let str = classNames.join(' ');
    return (
        <button className={str} type={type} onClick={onClick}>{children}</button>
    )
}