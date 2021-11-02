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
	function draw(canvas, context) {
		let width = context.canvas.width;
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
			// let direction = 0
			// if (x >= 0 - rectConfig.width && x <= width && y >= 0 - rectConfig.height && y <= height) {
			// 	return
			// }
			// if (x <= 0 - rectConfig.width || x >= width || y <= 0 - rectConfig.height || y >= height) {
			// 	return;
			// }
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
			if (nextX <= 0 - rectConfig.width || nextX >= width || nextY <= 0 - rectConfig.height || nextY >= height) {
				return;
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
			radius: 5, strokeStyle: '#00bcd4', lineWidth: 2,
		};
		let drawRect = (arr, count) => {
			let create = arr.slice(0, count)
			create.map(item => {
				let [x, y] = item;
				drawCircles(context, { ...baseConfig, x, y })
			})
			count++;
			if (count > arr.length) {
				return;
			}
			setTimeout(() => {
				drawRect(arr, count)
			}, 100)
		}
		drawRect(dataSource, 1)
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
	return (
		// style={{ height: '100%', width: '100%', background: '#e1f5ff' }}
		<canvas style={{ height: '100%', width: '100%', background: '#e1f5ff' }} ref={canvasRef}></canvas>
	);
}