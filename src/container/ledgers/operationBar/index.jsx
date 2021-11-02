import React, { useState, useContext } from "react";
import { DatePicker, Button } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons'
import styles from "./style.module.scss";

import ScrollBar from './scrollbar';
import { CostContext } from './../context';

// 操作条
export default function OperationBar(props) {
	const {
		initYear, initMonth,
		dateText,
		setDate,
		type, setType,
		visible, setVisible,
	} = useContext(CostContext);

	const [localType, setLocalType] = useState(type)
	const [year, setYear] = useState(initYear); // 当前选中年份
	const [month, setMonth] = useState(initMonth); // 当前选中月份
	const [showType, setShowType] = useState(true);

	let lists = {
		'年': {
			buttonText: '按年',
			timeText: `${year}`,
			TypeEle: <ScrollBar {...{ start: 1949, end: 2100, unit: '年', initValue: initYear, onChange: setYear }} />
		},
		'月': {
			buttonText: '按月',
			timeText: `${year}-${month < 10 ? '0' + month : month}`,
			TypeEle: <>
				<ScrollBar {...{ start: 1949, end: 2100, unit: '年', initValue: initYear, onChange: setYear }} />
				<ScrollBar {...{ start: 1, end: 12, unit: '月', initValue: initMonth, onChange: setMonth }} />
			</>,
		},
		'至今': {
			buttonText: '全部',
			timeText: '',
			TypeEle: <div className={styles.all}>至今</div>
		}
	};
	let buttons = Object.keys(lists).map(key => ({ name: lists[key].buttonText, value: key }));
	let { timeText, TypeEle } = lists[localType];

	const typeOk = () => {
		setType(localType)
		setDate(timeText) // 例:2021-06
		setShowType(!showType)
	}

	return (
		<div className={styles.wrapper}>
			<div className={styles.top}>
				<span onClick={() => { setShowType(!showType) }}>{dateText}<CaretDownOutlined /></span>
			</div>
			<div>
				<Button onClick={() => setVisible(!visible)}>批量添加</Button>
				{/* <DatePicker placeholder={'请选择'} style={{ width: 150, zIndex: 1 }} format={'YYYY-MM-DD'} open={true} className={styles.picker} /> */}
			</div>
			<div className={styles.timer} style={{ display: showType ? 'block' : 'none' }}>
				<div className={styles.timerBar}>
					<span>取消</span>
					<span>
						{
							buttons.map(item => {
								return <span key={item.value} className={item.value === localType ? styles.avtive : null} onClick={() => setLocalType(item.value)}>{item.name}</span>
							})
						}
					</span>
					<span onClick={() => typeOk()}>确定</span>
				</div>
				<div className={styles.timerContent}>
					<div className={styles.topTime}>{timeText}</div>
					<div className={styles.content}>
						{
							showType ? TypeEle : ''
						}
					</div>
				</div>
			</div>
		</div>
	);
};

OperationBar.defaultProps = {};

