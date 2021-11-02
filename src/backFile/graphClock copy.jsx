import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import classnames from 'classnames';

import styles from './style.module.scss';

const formatTime = 'h:m:s';
export default function GraphClock(props) {
	// let { timestamp } = props || {};
	// let time = moment(timestamp).format(formatTime);
	// let [hour, minute, second] = time.split(':');
	let canvasRef = useRef();
	let [context, setContext] = useState();

	let drawCircles = (context, config) => {
		let {
			x, // 横坐标
			y, // 纵坐标
			radius, // 半径
			lineCap = 'round', // 线条样式
			strokeStyle = '#000', // 线条颜色
			lineWidth = 1, // 线条粗细
			startAngle = 0, // 起始角度
			endAngle = 0, // 结束角度
		} = config;
		context.beginPath();
		context.arc(x, y, radius, startAngle, endAngle);
		context.lineCap = lineCap;
		context.strokeStyle = strokeStyle;
		context.lineWidth = lineWidth;
		context.stroke();
	};
	// 计算角度
	let angle = (stand, number) => {
		let startAngle = 1.5 * Math.PI; // 起始角度 竖直位置
		let deg = (number / stand) * 2 * Math.PI - 0.5 * Math.PI; // 当前时间的角度大小
		let endAngle = deg > 0 ? deg : 2 * Math.PI + deg;
		return { startAngle, endAngle };
	};
	// 画
	let draw = () => {
		let canvas = canvasRef.current;
		let context = canvas?.getContext('2d');
		if (!context) {
			return;
		}
		let { timestamp } = props || {};
		if (!timestamp) {
			return;
		}
		let time = moment(timestamp).format(formatTime);
		let [hour, minute, second] = time.split(':').map((item) => Number(item));
		if (hour <= 0 || minute <= 0 || second <= 0) {
			context.clearRect(0, 0, canvas.width, canvas.height);
		}
		// 坐标
		let x = canvas.width / 2;
		let y = canvas.height / 2;
		let baseConfig = {
			x, // 横坐标
			y, // 纵坐标
			lineCap: 'round', // 线条样式
		};
		// 画圆
		drawCircles(context, {
			...baseConfig,
			radius: 50, // 半径
			strokeStyle: '#E91E63', // 线条颜色
			lineWidth: 10, // 线条粗细
			...angle(12, hour),
		});
		drawCircles(context, {
			...baseConfig,
			radius: 80, // 半径
			strokeStyle: '#00bcd4', // 线条颜色
			lineWidth: 12, // 线条粗细
			...angle(60, minute),
		});
		drawCircles(context, {
			...baseConfig,
			radius: 120, // 半径
			strokeStyle: '#3f51b5', // 线条颜色
			lineWidth: 8, // 线条粗细
			...angle(60, second),
		});
	};
	let initCanvas = () => {
		let canvas = canvasRef.current;
		var width = canvas.width,
			height = canvas.height;
		if (window.devicePixelRatio) {
			devicePixelRatio = window.devicePixelRatio;
			canvas.style.width = width + 'px';
			canvas.style.height = height + 'px';
			canvas.height = height * devicePixelRatio;
			canvas.width = width * devicePixelRatio;
			let context = canvas?.getContext('2d');
			if (context) {
				context.scale(devicePixelRatio, devicePixelRatio);
			}
		}
	};
	useEffect(() => {
		initCanvas();
		draw();
	});
	// console.log(.getContext('2d'))
	return (
		<div className={styles.graphClock}>
			<canvas id='myCanvas' width='300' height='300' ref={canvasRef} className={styles.graphClock}></canvas>
		</div>
	);
}
