import React, { useEffect, useState } from 'react';
import moment from 'moment';

import styles from './style.module.scss';

export default function Calendar(props) {
	let { timestamp } = props || {};
	// let calendar = moment(timestamp).format('YYYY年MM月DD日')
	// let week = moment(timestamp).format('d');
	let [calendar, setCalendar] = useState();
	let [week, setWeek] = useState();
	let weekEnum = {
		'0': '日',
		'1': '一',
		'2': '二',
		'3': '三',
		'4': '四',
		'5': '五',
		'6': '六',
	};
	let weekStr = weekEnum[week];

	useEffect(() => {
		setCalendar(moment(timestamp).format('YYYY年MM月DD日'));
		setWeek(moment(timestamp).format('d'));
	}, []);
	useEffect(() => {
		let timer = null;
		let today = moment(timestamp).format('YYYY-MM-DD');
		let splitTime = moment(today + ' 23:59:59').format('x') - moment().format('x');
		timer = setTimeout(() => {
			console.log('更新时间');
			setCalendar(moment(timestamp).format('YYYY年MM月DD日'));
			setWeek(moment(timestamp).format('d'));
		}, splitTime);
		return () => {
			clearTimeout(timer);
		};
	}, []);
	return (
		<div className={styles.wrap}>
			<div className={styles.calendar}>
				<p>星期{weekStr}</p>
				<p>{calendar}</p>
			</div>
		</div>
	);
}
