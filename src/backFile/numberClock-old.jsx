import React, { useEffect, useState } from 'react';
import moment from 'moment';
import classnames from 'classnames';

import styles from './style.module.scss';

const formatTime = 'HH:mm:ss';
export default function NumberClock(props) {
	let [time, setTime] = useState(moment().format(formatTime));
	let timeArr = time.split('');

	let clock = (callback) => {
		let timer = null;
		let updater = async (callback) => {
			await undefined;
			timer = setTimeout(() => {
				callback(new Date().getTime());
				updater(callback);
			}, 1000);
		};
		clearTimeout(timer);
		updater(callback);
	};

	useEffect(() => {
		clock((time) => {
			setTime(moment(time).format(formatTime));
		});
	}, []);
	return (
		<div className={styles.numberClock}>
			{timeArr.map((item) => {
				return <div className={item === ':' ? styles.split : styles.card}>{item}</div>;
			})}
			{/* <div className={styles.card}>1</div>
			<div className={styles.card}>2</div>
			<div className={styles.split}>:</div>
			<div className={styles.card}>0</div>
			<div className={styles.card}>9</div>
			<div className={styles.split}>:</div>
			<div className={styles.card}>4</div>
			<div className={classnames(styles.card, { [styles.active]: change })}>{time}</div> */}
		</div>
	);
}
