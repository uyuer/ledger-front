import React, { useState } from 'react';
import moment from 'moment';
import {
    Skeleton, Avatar,
    Card,
    Button, Row, Col
} from 'antd';
import { DeleteOutlined, EditOutlined, EllipsisOutlined, SettingOutlined, GlobalOutlined, UnlockOutlined, LockOutlined, PlusOutlined } from '@ant-design/icons';

import styles from './style.module.scss';

const format = 'YYYY-MM-DD HH:mm:ss'

// 添加卡片 
function AddCard(props) {
    let { onClick } = props;
    return (
        <Card
            style={{ width: 280, margin: 8, display: 'inline-block', verticalAlign: 'top' }}
            bodyStyle={{ padding: '12px 10px' }}
        >
            <div className={styles.blank} onClick={onClick}>

                <Row gutters={8} style={{ width: '100%' }}>
                    <Col span={12} style={{ textAlign: 'center' }}><PlusOutlined /></Col>
                    <Col span={12} style={{ textAlign: 'center' }}><PlusOutlined /></Col>
                </Row>
                <Row gutters={8} style={{ width: '100%' }}>
                    <Col span={12} style={{ textAlign: 'center' }}><PlusOutlined /></Col>
                    <Col span={12} style={{ textAlign: 'center' }}><PlusOutlined /></Col>
                </Row>
            </div>
        </Card>
    )
}
AddCard.defaultProps = {
    onClick: () => { console.log('添加点击') },
}
export { AddCard };

function CardInfomation(props) {
    let { data, onDelete, onViewPass, onEdit, onViewMore, } = props;
    let {
        id,
        userId,
        createTime,
        updateTime,
        site, // 网站名称
        website, // 网站地址
        introduction, // 网站简介, 可以添加一些说明文字
        account, // 注册账户(在网站注册的时候使用的账户)
        password, // 加密密码(使用AES加密, 需要密钥来解密)
        associates, // 绑定或关联的账户(注册账户关联或绑定的账户)可能有多个关联(字符串数组形式)
        nickname, // 账户昵称
        status, // 状态(0:正常,1:停用,2:注销)
        remark, // 备注
        tags, // 标签(对网站功能用途进行分类时使用,例如:娱乐,工作等)
    } = data;
    // console.log(props)
    return (
        <Card
            style={{ width: 280, margin: 8, display: 'inline-block' }}
            bodyStyle={{ padding: '12px 10px' }}
            actions={[
                <UnlockOutlined key="unlock" title="查看密码" onClick={onViewPass} />,
                <EditOutlined key="edit" title="编辑" onClick={onEdit} />,
                <DeleteOutlined key="delete" title="删除" onClick={onDelete} />,
                <EllipsisOutlined key="ellipsis" title="查看详情" onClick={onViewMore} />,
            ]}
        >
            <Skeleton loading={false} avatar active>
                <Card.Meta
                    avatar={
                        <Avatar className={styles.img} shape="square" size={45} icon={website ? <img src={`${website}/favicon.ico`} /> : <GlobalOutlined />} />
                    }
                    title={
                        website
                            ? <div className={styles.title}>{site}<p className={styles.urlStr}><a target="_blank" href={website} title={website}>{website}</a></p></div>
                            : <Skeleton title={{ width: 100 }} paragraph={false} />
                    }
                    description={website ? (
                        <div className={styles.description}>
                            <p><span>注册账号：</span><span>{account}</span></p>
                            <p><span>账号昵称：</span><span>{nickname}</span></p>
                            <p><span>账户状态：</span><span>{{ '0': '正常', '1': '停用', '2': '注销' }[status]}</span></p>
                        </div>
                    ) : (
                        <Skeleton title={false} paragraph={{ rows: 3 }} />
                    )}
                />
            </Skeleton>
        </Card>
    )
}
CardInfomation.defaultProps = {
    data: {},
    onDelete: () => { },
    onViewPass: () => { },
    onEdit: () => { },
    onViewMore: () => { },
}

// CardInfomation.propTypes = {
//     name: PropType.string
// }
export default CardInfomation;
{/* <div className={styles.card2}>
            <div className={styles.cardContent}>
                <div className={styles.header}>
                    <img src={'https://www.baidu.com/favicon.ico'} alt="" />
                    <div className={styles.content2}>
                        <p className={styles.item}>
                            <span>网&#8194;&#8194;&#8194;&#8194;站:</span>
                            <span>{props.website}</span>
                        </p>
                        <p className={styles.item}>
                            <span>网&#8194;&#8194;&#8194;&#8194;址:</span>
                            <span>{props.websiteUrl}</span>
                        </p>
                    </div>
                </div>
                <div className={styles.content}>

                    <p className={styles.item}>
                        <span>账&#8194;&#8194;&#8194;&#8194;户:</span>
                        <span>{props.account}</span>
                    </p>
                    <p className={styles.item}>
                        <span>账&#8194;户&#8194;名:</span>
                        <span>{props.accountName}</span>
                    </p>
                    <p className={styles.item}>
                        <span>密&#8194;&#8194;&#8194;&#8194;码:</span>
                        <span>{props.password}</span>
                    </p>
                    <p className={styles.item}>
                        <span>创建时间:</span>
                        <span>{props.createTime ? moment(props.createTime).format('YYYY-MM-DD HH:mm:ss') : '--'}</span>
                    </p>
                    <p className={styles.item}>
                        <span>更新时间:</span>
                        <span>{props.updateTime ? moment(props.updateTime).format('YYYY-MM-DD HH:mm:ss') : '--'}</span>
                    </p>
                </div>
            </div>
        </div> */}
{/* <div className={styles.card2}>
<div className={styles.header}>
    <img src={'https://www.baidu.com/favicon.ico'} alt="" />
</div>
<div className={styles.content}>
    <p className={styles.item}>
        <span>网&#8194;&#8194;&#8194;&#8194;站:</span>
        <span>{props.website}</span>
    </p>
    <p className={styles.item}>
        <span>网&#8194;&#8194;&#8194;&#8194;址:</span>
        <span>{props.websiteUrl}</span>
    </p>
    <p className={styles.item}>
        <span>账&#8194;&#8194;&#8194;&#8194;户:</span>
        <span>{props.account}</span>
    </p>
    <p className={styles.item}>
        <span>账&#8194;户&#8194;名:</span>
        <span>{props.accountName}</span>
    </p>
    <p className={styles.item}>
        <span>密&#8194;&#8194;&#8194;&#8194;码:</span>
        <span>{props.password}</span>
    </p>
    <p className={styles.item}>
        <span>创建时间:</span>
        <span>{props.createTime}</span>
    </p>
    <p className={styles.item}>
        <span>更新时间:</span>
        <span>{props.updateTime}</span>
    </p>
</div>
</div> */}