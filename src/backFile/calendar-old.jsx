import React, { useEffect, useState } from 'react';
import moment from 'moment';

import styles from './style.module.scss';

export default function Calendar(props) {
	let [calendar, setCalendar] = useState();
	let [week, setWeek] = useState();
	let weekStr = '';
	switch (week) {
		case '0':
			weekStr = '日';
			break;
		case '1':
			weekStr = '一';
			break;
		case '2':
			weekStr = '二';
			break;
		case '3':
			weekStr = '三';
			break;
		case '4':
			weekStr = '四';
			break;
		case '5':
			weekStr = '五';
			break;
		case '6':
			weekStr = '六';
			break;
	}
	useEffect(() => {
		setCalendar(moment().format('YYYY年MM月DD日'));
		setWeek(moment().format('d'));
	});
	useEffect(() => {
		let timer = null;
		let today = moment().format('YYYY-MM-DD');
		let splitTime = moment(today + ' 23:59:59').format('x') - moment().format('x');
		timer = setTimeout(() => {
			console.log('更新时间');
			setCalendar(moment().format('YYYY年MM月DD日'));
			setWeek(moment().format('d'));
		}, splitTime);
		return () => {
			clearTimeout(timer);
		};
	}, []);
	return (
		<div className={styles.calendar}>
			<p>星期{weekStr}</p>
			<p>{calendar}</p>
		</div>
	);
}
