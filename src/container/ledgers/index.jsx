import React, { useEffect, useRef, useState, useContext } from 'react';
import classnames from 'classnames';
import { Row, Col } from 'antd';

import styles from './style.module.scss';

import WebsiteName from 'components/WebsiteName';
import Navigate from 'components/Navigate';
import Beian from 'components/Beian';

import BookList from './bookList';
// import OperationBar from './operationBar';
import DetailList from './detailList';
import ExpendDetail from './expendDetail';
import ExpendType from './expendType';
import ExpendTypePie from './expendTypePie';
import IncomeAndExpendStatistics from './incomeAndExpendStatistics';
import AddData from './addData';

import Cost, { CostContext } from './context';

const SpaceEle = ({ children, ...prop }) => {
    return (
        <div className={classnames(styles.space, styles.scrollYBar)} {...prop}>
            {children}
        </div>
    )
}

export default () => {
    const value = Cost();
    const headerRef = useRef();
    const contentRef = useRef();

    useEffect(() => {
        let header = headerRef.current;
        let content = contentRef.current;
        if (!content) {
            return;
        }
        content.style.height = (document.body.offsetHeight - header.offsetHeight) + 'px';
        window.onresize = () => {
            content.style.height = (document.body.offsetHeight - header.offsetHeight) + 'px';
        }
    }, [contentRef.current])

    return (
        <CostContext.Provider value={value}>
            <div className={styles.wrapper}>
                <div ref={headerRef} className={styles.header}>
                    <div className={styles.spaceBetween}>
                        <div>
                            <WebsiteName className={styles.title} />
                        </div>
                        <div className={styles.extra}>
                            <Navigate theme={'write'} />
                        </div>
                    </div>
                </div>
                <div ref={contentRef} className={styles.content}>
                    <SpaceEle>
                        <BookList />
                    </SpaceEle>
                    <SpaceEle>
                        <DetailList />
                    </SpaceEle>
                    <SpaceEle style={{ flex: 1 }}>
                        <ExpendDetail />
                        <Row>
                            <Col span={14}><ExpendType /></Col>
                            <Col span={10}><ExpendTypePie /></Col>
                        </Row>
                        <IncomeAndExpendStatistics />
                    </SpaceEle>
                    <AddData />
                </div>
                <div className={styles.footer}>
                    <Beian />
                </div>
            </div >
        </CostContext.Provider >
    )
}