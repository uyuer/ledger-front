import React, { useState, useEffect, useContext } from 'react';
import classnames from 'classnames';
import { Card } from 'antd';
import styles from "./style.module.scss";

// 自定义card
export default function Section({ children, className, flex, ...params }) {
    return (
        <div className={classnames(styles.customCard, className)}>
            <Card {...params} >
                {children}
            </Card>
        </div>
    )
}

Section.defaultProps = {
    title: null,
    bordered: false,
    bodyStyle: { padding: 5 }
}