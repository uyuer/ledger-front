import React, { useEffect, useRef } from 'react';
import moment from 'moment';

import styles from './style.module.scss';

const formatTime = 'h:m:s:SSS';

export default function GraphClock(props) {
	let canvasRef = useRef();
	let { scale = false } = props;

	// 画指针
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
	// 画分隔线
	let drawScale = (context, config) => {
		let {
			x, // 横坐标
			y, // 纵坐标
			radius, // 半径
			lineCap = 'round', // 线条样式
			strokeStyle = '#000', // 线条颜色
			lineWidth = 1, // 线条粗细
			// startAngle = 0, // 起始角度
			// endAngle = 0, // 结束角度
		} = config;
		context.save();
		for (let i = 0; i <= 360; i += 6) {
			let startAngle = Math.PI * 2 * ((i - (i % 30 === 0 ? 0.5 : 0.1)) / 360);
			let endAngle = Math.PI * 2 * ((i + (i % 30 === 0 ? 0.5 : 0.1)) / 360)
			context.beginPath();
			context.arc(x, y, radius, startAngle, endAngle);
			context.lineCap = i % 90 === 0 ? 'square' : 'butt';
			context.strokeStyle = strokeStyle;
			context.lineWidth = lineWidth;
			context.stroke();
		}
		context.restore();
	}
	// 画中心原点
	let drawCenter = (context, config) => {
		let {
			x, // 横坐标
			y, // 纵坐标
			radius, // 半径
			fillStyle, // 填充颜色
			startAngle = 0, // 起始角度
			endAngle = 2 * Math.PI, // 结束角度
		} = config;
		context.save();
		context.beginPath();
		context.arc(x, y, radius, startAngle, endAngle);
		context.stroke();
		context.fillStyle = fillStyle;
		context.fill();
		context.restore();
	}
	useEffect(() => {
		let canvas = canvasRef.current;
		let context = canvas.getContext('2d');
		let centerX = canvas.width / 2;
		let centerY = canvas.height / 2;

		let baseConfig = {
			x: centerX, // 横坐标
			y: centerY, // 纵坐标
			lineCap: 'round', // 线条样式
			startAngle: -Math.PI / 2, // 起始角度
			endAngle: Math.PI * 2 - Math.PI / 2
		};

		let secondRad = (Math.PI * 2) / 60; // 秒针每秒需要旋转角度
		let minuteRad = (Math.PI * 2) / 60 / 60; // 分针每秒需要旋转角度
		let hourRad = (Math.PI * 2) / 12 / 60 / 60; // 时针每秒需要旋转角度

		// 匹配分辨率防止锯齿
		if (window.devicePixelRatio) {
			let devicePixelRatio = window.devicePixelRatio;
			// canvasRef.current.style.width = width + 'px';
			// canvasRef.current.style.height = height + 'px';
			canvas.height = canvas.height * devicePixelRatio;
			canvas.width = canvas.width * devicePixelRatio;
			if (context) {
				context.scale(devicePixelRatio, devicePixelRatio);
			}
		}
		// 兼容requestAnimationFrame
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

		(function drawFrame() {
			let currentTime = moment().format(formatTime);
			let [hour, minute, second, milliscond] = currentTime.split(':').map((item) => Number(item));

			context.clearRect(0, 0, canvas.width, canvas.height);
			scale && drawScale(context, {
				...baseConfig,
				lineCap: 'square',
				radius: 120, // 半径
				strokeStyle: 'rgba(153, 191, 209, 0.5)', // 线条颜色
				lineWidth: 5, // 线条粗细
			})
			// let circle2 = [
			// 	{ ...baseConfig, radius: 120, strokeStyle: 'rgba(63, 81, 181, 0.01)', lineWidth: 8 },
			// 	{ ...baseConfig, radius: 85, strokeStyle: 'rgba(0, 188, 212, 0.01)', lineWidth: 20 },
			// 	{ ...baseConfig, radius: 40, strokeStyle: 'rgba(233, 30, 99, 0.01)', lineWidth: 12 },
			// ]
			// circle2.map(item => {
			// 	drawCircles(context, item);
			// })
			// scattered 零散时间
			// time 当前项时间[秒,分,时]
			let circle = [
				{ ...baseConfig, radius: 120, strokeStyle: 'rgba(63, 81, 181, 1)', lineWidth: 8, time: second, rad: secondRad, coupute: (scattered, time) => (time + milliscond / 1000 + scattered) },
				{ ...baseConfig, radius: 85, strokeStyle: 'rgba(0, 188, 212, 1)', lineWidth: 20, time: minute, rad: minuteRad, coupute: (scattered, time) => (time * 60 + scattered) },
				{ ...baseConfig, radius: 40, strokeStyle: 'rgba(233, 30, 99, 1)', lineWidth: 12, time: hour, rad: hourRad, coupute: (scattered, time) => (time * 60 * 60 + scattered) },
			]
			// 将上一个项的时间计算后交给下一个
			circle.reduce((scattered, currentValue) => {
				let { time, rad, coupute, ...config } = currentValue;
				let startAngle = config.startAngle;
				let full = coupute(scattered, time);
				drawCircles(context, { ...config, endAngle: startAngle + full * rad });
				return full;
			}, 0)

			drawCenter(context, {
				...baseConfig,
				radius: 10, // 半径
				fillStyle: '#673ab7'
			})
			window.requestAnimationFrame(drawFrame) // requestAnimationFrame每秒运行60次
		})()
	}, []);
	return (
		<div className={styles.wrap}>
			<div className={styles.graphClock}>
				<div className={styles.clock}>
					<canvas id='myCanvas' width='300' height='300' ref={canvasRef}></canvas>
				</div>
			</div>
		</div>
	);
}
