import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import classnames from 'classnames';

import styles from './style.module.scss';

const formatTime = 'h:m:s';
// let arr = [
// 	{ type: 'hour', frameTime: 12 * 60 * 60, frameRate: 60, initTime: hour * 60 * 60 },
// 	{ type: 'hour', frameTime: 60 * 60, frameRate: 60, initTime: minute * 60 },
// 	{ type: 'second', frameTime: 60, frameRate: 60, initTime: second },
// ];

export default function GraphClock(props) {
	let canvasRef = useRef();

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
		context.save();
		context.beginPath();
		context.arc(x, y, radius, startAngle, endAngle);
		context.lineCap = lineCap;
		context.strokeStyle = strokeStyle;
		context.lineWidth = lineWidth;
		context.stroke();
		context.restore();
	};
	useEffect(() => {
		let canvas = canvasRef.current;
		let context = canvas.getContext('2d');
		let centerX = canvas.width / 2;
		let centerY = canvas.height / 2;
		console.log('123123');

		let baseConfig = {
			x: centerX, // 横坐标
			y: centerY, // 纵坐标
			lineCap: 'round', // 线条样式
		};

		if (!window.requestAnimationFrame) {
			window.requestAnimationFrame =
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				window.oRequestAnimationFrame ||
				window.msRequestAnimationFrame ||
				function (callback) {
					return window.setTimeout(callback, 1000 / 60);
				};
		}
		let count = 0;
		let hourRad = (Math.PI * 2) / 60 / 60 / 60;
		let hourSpeed = 1 / 60; // 分 minuteSpeed不停加加, 每次加1 / 60 / 60, 每帧执行60次, minuteSpeed>=60即为一小时
		let minuteRad = (Math.PI * 2) / 60 / 60;
		let minuteSpeed = 1 / 60; // 分 minuteSpeed不停加加, 每次加1 / 60 / 60, 每帧执行60次, minuteSpeed>=60即为一小时
		let secondRad = (Math.PI * 2) / 60;
		let secondSpeed = 1 / 60; // 秒 secondSpeed不停加加每次加1/60, 每帧执行60次 , secondSpeed>=60即为一分钟
		let time = moment().format(formatTime);
		console.log(time)
		let [hour, minute, second] = time.split(':').map((item) => Number(item));
		console.log(hour, minute, second);
		let drawFrame = () => {
			window.requestAnimationFrame(drawFrame, canvas);
			context.clearRect(0, 0, canvas.width, canvas.height);
			if (!count) {
				count++;
			}
			drawCircles(context, {
				...baseConfig,
				radius: 50, // 半径
				strokeStyle: '#E91E63', // 线条颜色
				lineWidth: 10, // 线条粗细
				startAngle: -Math.PI / 2, // 起始角度
				endAngle: -Math.PI / 2 + (hour * 60 * 60 + hourSpeed) * hourRad, // 结束角度
			});
			if (hourSpeed >= 60 * 60 * 60) {
				hourSpeed = 0;
			}
			// console.log(minuteSpeed);
			// console.log(minuteSpeed, minuteRad, minuteSpeed * minuteRad);
			drawCircles(context, {
				...baseConfig,
				radius: 80, // 半径
				strokeStyle: '#00bcd4', // 线条颜色
				lineWidth: 12, // 线条粗细
				startAngle: -Math.PI / 2, // 起始角度
				endAngle: -Math.PI / 2 + (minute * 60 + minuteSpeed) * minuteRad, // 结束角度
			});
			if (minuteSpeed >= 60 * 60) {
				minuteSpeed = 0;
			}
			minuteSpeed += 1 / 60;
			drawCircles(context, {
				...baseConfig,
				radius: 120, // 半径
				strokeStyle: '#3f51b5', // 线条颜色
				lineWidth: 8, // 线条粗细
				startAngle: -Math.PI / 2, // 起始角度
				endAngle: -Math.PI / 2 + (second + secondSpeed) * secondRad, // 结束角度
			});
			if (secondSpeed >= 60) {
				secondSpeed = 0;
			}
			secondSpeed += 1 / 60;
		};
		drawFrame();
	}, []);
	// console.log(.getContext('2d'))
	return (
		<div className={styles.graphClock}>
			<canvas id='myCanvas' width='300' height='300' ref={canvasRef} className={styles.graphClock}></canvas>
			<div className={styles.scaleContent}>
				<div className={styles.scale}></div>
				<div className={styles.scale}></div>
				<div className={styles.scale}></div>
				<div className={styles.scale}></div>
				<div className={styles.scale}></div>
				<div className={styles.scale}></div>
				<div className={styles.scale}></div>
				<div className={styles.scale}></div>
				<div className={styles.scale}></div>
				<div className={styles.scale}></div>
				<div className={styles.scale}></div>
				<div className={styles.scale}></div>
				<div className={styles.scale}></div>
				<div className={styles.scale}></div>
				<div className={styles.scale}></div>
			</div>
		</div>
	);
}
