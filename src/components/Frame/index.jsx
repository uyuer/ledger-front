import React from 'react';

import styles from './style.module.scss';

import Beian from 'components/Beian';

// 用户-个人中心页
export default (props) => {
	return (
		<div className={styles.container}>
			<div className={styles.content}>
				{props.children}
			</div>
			<Beian />
		</div>
	);
};
