import React from 'react';
import styles from './style.module.scss';

import GraphClock from './graphClock';
import NunberClock from './numberClock';
import Calendar from './calendar';

export default function Clock(props) {
	return (
		<div className={styles.container}>
			<GraphClock />
			<Calendar />
			<NunberClock />
		</div>
	);
}
