import React, { useEffect, useState, useContext } from "react";

import { EchartBase } from 'components/echarts';
import Section from 'components/Section';
import NoData from 'components/NoData';

import { CostContext } from './../context';

// TODO:类型排行需要优化, 当有很多类型的时候会显示不下; 类型需要添加一个饼图
// 月支出类型
const ExpendType = (props) => {
	const { time, dateText, type, detailList, labels } = useContext(CostContext);
	const [value, setValue] = useState([])
	const [xData, setXData] = useState([])

	let option = {
		title: {
			text: dateText,
			subtext: `支出类型排行`
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow'
			},
			padding: 5,
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			containLabel: true
		},
		xAxis: {
			type: 'value',
			boundaryGap: [0, 0.01]
		},
		yAxis: {
			type: 'category',
			data: xData,
			inverse: true
		},
		series: [
			{
				name: '支出金额',
				type: 'bar',
				data: value,
				itemStyle: {
					color: '#b8d2c7'
				}
			},

		]
	};

	useEffect(() => {
		let tempXData = [];
		let tempValue = [];

		let result = detailList.reduce((total, currentValue) => {
			let { label, amount, type } = currentValue;
			if (type !== '0') {
				return total;
			}
			if (!total[label]) {
				total[label] = (amount * 100);
			} else {
				total[label] += (amount * 100);
			}
			return total;
		}, {})
		let temp = Object.keys(result).map((key) => {
			return { name: key, value: result[key] / 100 }
		}).sort((a, b) => {
			return b.value - a.value
		})
		temp.forEach(item => {
			tempXData[tempXData.length] = item.name
			tempValue[tempValue.length] = item.value
		})

		setXData(tempXData.length ? tempXData : labels.slice(0, 10).map(item => item.label))
		setValue(tempValue)
	}, [detailList, time, labels])

	return (
		<Section title={`${type}支出类型排行`}>
			{
				xData && xData.length ? (
					<EchartBase option={option} style={{ height: 250 }} />
				) : (
					<NoData style={{ height: 250 }} />
				)
			}
		</Section>
	);
};

ExpendType.defaultProps = {};

export default ExpendType;
