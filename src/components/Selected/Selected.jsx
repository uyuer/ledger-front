import React, { useState } from 'react';
import { Row, Col, Button, Icon } from 'antd';
import classnames from 'classnames';
import styles from './selected.less';

let subLabels1 = [
    { name: '不限', value: '不限' },
    { name: '新一代信息技术', value: '新一代信息技术' },
    { name: '新材料', value: '新材料' },
    { name: '新能源', value: '新能源' },
    { name: '新能源汽车', value: '新能源汽车' },
    { name: '节能环保', value: '节能环保' },
    { name: '高端装备制造', value: '高端装备制造' },
    { name: '生物产业', value: '生物产业' },
    { name: '消费品', value: '消费品' },
    { name: '数字经济', value: '数字经济' },
    { name: '相关服务业', value: '相关服务业' },
    { name: '其他', value: '其他' }
];
// 通过转换, 将这个转成下面的样子
let origin = [
    {
        title: '主投阶段',
        mode: 'single', // 如果multiple则自动忽略children
        defaultValue: [{ name: '不限', value: '不限' }],
        labels: [
            {
                name: '不限',
                value: '不限'
            },
            {
                name: '投资专家',
                value: '投资专家',
                mode: 'multiple', // 如果multiple则自动忽略children
                defaultValue: [{ name: '不限', value: '不限' }],
                children: {
                    '不限': { name: '不限', value: '不限' },
                    '新一代信息技术': { name: '新一代信息技术', value: '新一代信息技术' },
                    '新材料': { name: '新材料', value: '新材料' },
                    '新能源': { name: '新能源', value: '新能源' }
                }
            },
            {
                name: '投资专家',
                value: '投资专家',
                children: {
                    '不限': { name: '不限', value: '不限' },
                    '新一代信息技术': { name: '新一代信息技术', value: '新一代信息技术' },
                    '新材料': { name: '新材料', value: '新材料' },
                    '新能源': { name: '新能源', value: '新能源' }
                }
            }
        ]
    }
];
export default function Selected(props) {
    let { span = [24, 24] } = props;
    // let [selected, setSelected] = useState({
    //     test: {
    //         '投资专家': {
    //             name: '投资专家', value: '投资专家',
    //             children: {
    //                 '新材料': { name: '新材料', value: '新材料' },
    //                 '新能源': { name: '新能源', value: '新能源' },
    //             }
    //         }
    //     }
    // });
    let [selected, setSelected] = useState({});
    let [initData, setInitData] = useState({
        test: {
            title: '主投阶段',
            mode: 'multiple', // 如果multiple则自动忽略children
            labels: {
                '不限': { name: '不限', value: '不限' },
                '投资专家': {
                    name: '投资专家', value: '投资专家',
                    children: {
                        '不限': { name: '不限', value: '不限' },
                        '新一代信息技术': { name: '新一代信息技术', value: '新一代信息技术' },
                        '新材料': { name: '新材料', value: '新材料' },
                        '新能源': { name: '新能源', value: '新能源' }
                    }
                },
                '投行专家': {
                    name: '投行专家', value: '投行专家', children: {
                        '不限': { name: '不限', value: '不限' },
                        '新一代信息技术': { name: '新一代信息技术', value: '新一代信息技术' },
                        '新材料': { name: '新材料', value: '新材料' },
                        '新能源': { name: '新能源', value: '新能源' }
                    }
                },
                '行业专家': {
                    name: '行业专家', value: '行业专家', children: {
                        '不限': { name: '不限', value: '不限' },
                        '新一代信息技术': { name: '新一代信息技术', value: '新一代信息技术' },
                        '新材料': { name: '新材料', value: '新材料' },
                        '新能源': { name: '新能源', value: '新能源' }
                    }
                },
                '财税专家': { name: '财税专家', value: '财税专家' },
                '法律专家': { name: '法律专家', value: '法律专家' }
            },
            defalutSelected: [
                { name: '投资专家', value: '投资专家', children: [{ name: '新材料', value: '新材料' }] }
            ]
        }
    });

    const [expand, setExpand] = useState(false);
    console.log(selected);
    const labelOnClick = (key, value, item) => {
        let selectedTemp = { ...selected };
        selectedTemp[[key]][[value]] = item;
        setSelected(selectedTemp);
    };
    const subLabelOnClick = (item, key, data) => {
        // 已选中的
        let temp = { ...selected };
        // 初始数据的
        let tempInitData = { ...initData };
        let { name, value } = item;
        let obj = { name, value };
        // 找到它的父级
        let fatherLabels = temp[key] && temp[key].length ? temp[key].find(i => {
            return item.value === i.value;
        }) : {};
        let children = fatherLabels?.children || [];
        fatherLabels.children = [...children, obj];
    };
    const buildSelected = (p) => {
        // initData可能存在多个标签行
        let keys = Object.keys(initData);
        return keys.map(key => {
            let selectedCurrent = { ...selected }[key] || {};
            // 冲初始数据中获取当前的数据对象
            let { title, labels = {}, mode } = initData[key];

            let labelsArray = Object.keys(labels || {}).map(labelKey => {
                let item = labels[labelKey];
                let { name, value, children } = item;
                let result = selected?.[key]?.[value] ? true : false;
                // let result = (selected[key] || {})[value] ? true : false;
                console.log(result, labels[labelKey], (selected[key] || {}), (selected[key] || {})[[value]]);
                return (
                    <span className={classnames({
                        [styles.label]: true,
                        [styles.avtive]: result
                    })} onClick={() => {
                        let selectedTemp = { ...selected };
                        (selectedTemp[key] || {})[value] = item;
                        setSelected(selectedTemp);
                    }}>{name}</span>
                );
            });

            return (
                <div className={styles.selected}>
                    <div className={styles.title}>{title}</div>
                    <div className={styles.labelContent}>
                        <div className={styles.labels}>
                            {labelsArray}
                        </div>
                        {/* <div className={styles.labels}>
                            {
                                subLabels && subLabels.length && subLabels.map(item => {
                                    let children = (selectedData ? selectedData[0] : {}).children || [];
                                    let result = children.find(i => {
                                        return item.value === i.value;
                                    });
                                    console.log(result);
                                    return (
                                        <span className={classnames({
                                            [styles.label]: true,
                                            [styles.avtive]: result
                                        })} onClick={() => subLabelOnClick(item, key, data)}>{item.name}</span>
                                    );
                                })
                            }
                        </div> */}
                    </div>
                    <div className={styles.toggle}>
                        {expand ? '收起' : '展开'}{expand ? <Icon type="up" /> : <Icon type="down" />}
                    </div>
                </div>
            );
        });
    };
    return (
        <div className={styles.wrap}>
            <Row>
                <Col span={span[0]}>
                    {buildSelected()}
                    <div className={styles.selected}>
                        <div className={styles.title}>主投阶段</div>
                        <div className={styles.labelContent}>
                            <div className={styles.labels}>
                                <span className={styles.label}>不限</span>
                                <span className={styles.label}>投资专家</span>
                                <span className={styles.label}>投行专家</span>
                                <span className={styles.label}>行业专家</span>
                                <span className={styles.label}>财税专家</span>
                                <span className={styles.label}>法律专家</span>
                            </div>
                            <div className={styles.labels}>
                                <span className={styles.label}>不限</span>
                                <span className={styles.label}>投资专家</span>
                                <span className={styles.label}>投行专家</span>
                                <span className={styles.label}>行业专家</span>
                                <span className={styles.label}>财税专家</span>
                                <span className={styles.label}>法律专家</span>
                            </div>
                        </div>
                        <div className={styles.toggle}>
                            {expand ? '收起' : '展开'}{expand ? <Icon type="up" /> : <Icon type="down" />}
                        </div>
                    </div>
                    <div className={styles.selected}>
                        <div className={styles.title}>主投阶段</div>
                        <div className={styles.labels}>
                            <span className={styles.label}>标签</span>
                        </div>
                        <div className={styles.toggle}>展开</div>
                    </div>
                </Col>
                <Col span={span[1]}>
                    <Button>重置</Button>
                    <Button>查询</Button>
                </Col>
            </Row>
        </div>
    );
}