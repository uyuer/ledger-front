import React, { useEffect, useState, useContext } from "react";

import { EchartBase } from 'components/echarts';
import Section from 'components/Section';
import NoData from 'components/NoData';

import { CostContext } from './../context';

// TODO:类型排行需要优化, 当有很多类型的时候会显示不下; 类型需要添加一个饼图
// 月支出类型
const ExpendTypePie = () => {
	const { time, dateText, type, detailList } = useContext(CostContext);
	const [value, setValue] = useState([])

	let option = {
		title: {
			text: dateText,
			subtext: `支出类型分布`
		},
		tooltip: {
			trigger: 'item',
			padding: 5,
		},
		legend: {
			top: 'bottom',
			left: 'center',
			padding: 5,
			itemGap: 10,
			itemWidth: 12,
			itemHeight: 14,
		},
		series: [
			{
				name: '支出金额',
				type: 'pie',
				radius: ['25%', '40%'],
				avoidLabelOverlap: false,
				itemStyle: {
					borderRadius: 0,
					borderColor: '#fff',
					borderWidth: 1
				},
				data: value
			}
		]
	};

	useEffect(() => {
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
		setValue(temp)
	}, [detailList, time])

	return (
		<Section title={`${type}支出类型分布`}>
			{
				value && value.length ? (
					<EchartBase option={option} style={{ height: 250 }} />
				) : (
					<NoData style={{ height: 250 }} />
				)
			}
		</Section>
	);
};

ExpendTypePie.defaultProps = {};

export default ExpendTypePie;
