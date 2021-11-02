import React, { useState, useEffect, useRef } from 'react';

import styles from './style.module.scss';

export default function BackgroundImage(props) {
	const canvasRef = useRef();
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
	function drawRect(context, config) {
		let {
			x, // 横坐标
			y, // 纵坐标
			width,
			height,
			lineCap = 'round', // 线条样式
			strokeStyle = '#000', // 线条颜色
			lineWidth = 1, // 线条粗细
			centerX = 0,
			centerY = 0,
		} = config;
		context.save();
		context.beginPath();
		// context.translate(centerX, centerY);
		// context.rotate(45 * Math.PI / 180);
		context.fillStyle = strokeStyle;
		context.fillRect(x, y, width, height);
		context.setTransform(1, 0, 0, 1, 0, 0);
		// context.lineCap = lineCap;
		// context.strokeStyle = strokeStyle;
		// context.lineWidth = lineWidth;
		// context.stroke();
		context.restore();
	};

	function draw(canvas, context) {
		let width = context.canvas.width;
		console.log(width);
		let height = context.canvas.height;
		let centerX = context.canvas.width / 2;
		let centerY = context.canvas.height / 2;
		let rectConfig = { width: 50, height: 50 }
		let colorConfig = ['rgb(0 150 136)', 'rgb(139 195 74)', 'rgb(76 175 80)', 'rgb(205 220 57)']
		let x = Math.floor(centerX), y = Math.floor(centerY);
		let dataSource = [
			[x, y], [x - rectConfig.width, y], [x - rectConfig.width, y - rectConfig.height]
		]

		function createPoint(x, y) {
			// 获取这个坐标点的周围点
			let checkPoint = [
				[x - rectConfig.width, y],
				[x + rectConfig.width, y],
				[x, y - rectConfig.height],
				[x, y + rectConfig.height],
			]
			// 检查并剔除不合格坐标点
			let validPoint = checkPoint.reduce((total, currentValue, currentIndex, arr) => {
				// 如果当前检查的点已经存在于dataSource中, 则需要剔除
				let index = dataSource.findIndex((item) => {
					return item.toString() === currentValue.toString()
				})
				if (index >= 0) {
					return total;
				}
				let [checkX, checkY] = currentValue
				if ((checkX >= 0 - rectConfig.width && checkX <= width) && (checkY >= 0 && checkY <= height + rectConfig.height)) {
					total.push(currentValue)
				}
				return total;
			}, [])
			// 计算合格坐标点距离原点距离
			let distance = validPoint.map(item => {
				let [x1, y1] = item;
				let z1 = Math.sqrt(Math.pow(x1 - centerX, 2) + Math.pow(y1 - centerY, 2))
				return [x1, y1, z1]
			})
			// 找出最小值, 然后过滤出来
			let min = Math.min(...distance.map(item => item[2]))
			let closest = distance.filter((item) => item[2] === min)
			let [nextX, nextY] = closest[0]
			// if (nextX < 0 - rectConfig.width || nextX >= width || nextY < 0 - rectConfig.height || nextY >= height) {
			// 	return;
			// }
			if (!(nextX > 0 - rectConfig.width && nextX <= width && nextY > 0 - rectConfig.height && nextY <= height)) {
				return
			}
			dataSource.push([nextX, nextY])
			createPoint(nextX, nextY);
		}
		createPoint(...dataSource[dataSource.length - 1])
		let baseConfig = {
			x: centerX, // 横坐标
			y: centerY, // 纵坐标
			lineCap: 'round', // 线条样式
			startAngle: 0, // 起始角度
			endAngle: Math.PI * 2,
			radius: 5, strokeStyle: '#00bcd4', lineWidth: 5,
			...rectConfig
		};

		let rects = dataSource.map((item, index) => {
			let [x, y] = item;
			let colorConfig = [
				'rgb(244 67 54)',
				'rgb(233 30 99)',
				'rgb(156 39 176)',
				'rgb(103 58 183)',
				'rgb(63 81 181)',
				'rgb(33 150 243)',
				'rgb(3 169 244)',
				'rgb(0 188 212)',
				'rgb(0 150 136)',
				'rgb(76 175 80)',
				'rgb(139 195 74)',
				'rgb(205 220 57)',
				'rgb(255 235 59)',
				'rgb(255 193 7)',
				'rgb(255 152 0)',
				'rgb(255 87 34)',
				'rgb(121 85 72)',
				'rgb(158 158 158)',
				'rgb(96 125 139)',
			]
			let colorIndex = index % (colorConfig.length);
			let strokeStyle = colorConfig[colorIndex];
			let offsetX = Math.floor(Math.random() * rectConfig.width * 0.25);
			let roundX = Math.random() >= 0.5 ? x - offsetX : x + offsetX;
			let roundY = Math.random() >= 0.5 ? y - offsetX : y + offsetX;
			return {
				...baseConfig, // width height
				// x: roundX,
				// y: roundY,
				x,
				y,
				// width: 80,
				// height: 80,
				centerX,
				centerY,
				strokeStyle
			}
		})
		let speed = 1;
		let count = 1;

		(function drawRectHandle() {
			let create = rects.slice(0, count)
			create.map(item => drawRect(context, item))
			count++;
			if (count > rects.length) {
				return;
			}

			// setTimeout(() => {
			// 	drawRectHandle(arr, count)
			// }, 100)
			window.requestAnimationFrame(drawRectHandle) // requestAnimationFrame每秒运行60次
		})()
		// drawRectHandle(rects, 1)
		// context.fillStyle = 'rgb(0 150 136)';
		// context.fillRect(centerX, centerY, rectConfig.width, rectConfig.height);
	}
	useEffect(() => {
		let canvas = canvasRef.current;
		let context = canvas.getContext('2d');
		/* 
		element.getBoundingClientRect() // { bottom: 581.390625, height: 581.390625, left: 0, right: 666, top: 0, width: 666, x: 0, y: 0 }
		window.getComputedStyle(element, null).getPropertyValue('width') // 581.39px
		window.getComputedStyle(element, null).getPropertyValue('height') // 666px
		*/
		let width = canvas.getBoundingClientRect().width;
		let height = canvas.getBoundingClientRect().height;
		// 匹配分辨率防止锯齿
		if (window.devicePixelRatio) {
			let devicePixelRatio = window.devicePixelRatio;
			// canvas.style.width = width + 'px';
			// canvas.style.height = height + 'px';
			canvas.height = height * devicePixelRatio;
			canvas.width = width * devicePixelRatio;
			if (context) {
				context.scale(devicePixelRatio, devicePixelRatio);
			}
		} else {
			canvas.height = height;
			canvas.width = width;
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
		draw(canvas, context)
	}, [])
	// style={{ height: '100%', width: '100%', background: '#e1f5ff' }}
	// style={{ height: '300px', width: '300px', background: '#e1f5ff' }}
	return (
		<canvas style={{ height: '300px', width: '300px', background: '#e1f5ff' }} ref={canvasRef}></canvas>
	);
}