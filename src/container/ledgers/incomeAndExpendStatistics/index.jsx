import React, { useEffect, useState, useContext } from "react";
import moment from "moment";

import { EchartBase } from "components/echarts";
import Section from "components/Section";
import NoData from 'components/NoData';

import { CostContext } from "../context";

// 年支出统计
const IncomeAndExpendStatistics = (props) => {
	const { time, dateText, type, detailList } = useContext(CostContext);
	const [xData, setXData] = useState([]);
	const [expends, setExpends] = useState([]);
	const [incomes, setIncomes] = useState([]);
	const [balance, setBalance] = useState([]);

	useEffect(() => {
		if (!time) {
			return;
		}
		// 将所有数据转化成月份的形式
		let result = detailList.reduce((total, currentValue) => {
			let { date, type, amount } = currentValue;
			let formatDate = moment(date).format("YYYY-MM");
			let value = total[formatDate];
			if (typeof value === 'undefined') {
				value = { name: formatDate, date: formatDate, expend: 0, income: 0 };
			}
			switch (type) {
				case "0": value.expend += amount; break;
				case "1": value.income += amount; break;
			}
			total[formatDate] = value;
			return total;
		}, {});
		// 组装成数组并按日期排序
		let temp = Object.keys(result).map(key => {
			return result[key];
		}).sort((a, b) => {
			return Date.parse(a.date) - Date.parse(b.date);
		})

		let [start, end] = time;
		var dateEnd = moment(end);
		var dateStart = moment(start)
		if (type === '年' || type === '月') {
			// 当前这年12月的数据
			let currentYear = moment(start).format('YYYY');
			dateStart = moment(moment(currentYear).format('YYYY-MM'));
			dateEnd = moment(moment(currentYear).add(1, 'y').subtract(1, 'months').format('YYYY-MM'));
		}
		if (type === '至今') {
			// 数据中最开始的那个月-当前这个月
			dateStart = moment(temp[0].date)
			dateStart = moment(dateStart).add(12, 'months') > dateEnd ? moment(dateEnd).subtract(11, 'months') : dateStart
		}
		var data = [];
		while (dateEnd > dateStart || dateStart.format("M") === dateEnd.format("M")) {
			let formatDate = dateStart.format("YYYY-MM");
			data.push(result[formatDate] ? result[formatDate] : { name: formatDate, date: formatDate, expend: 0, income: 0 });
			dateStart.add(1, "months");
		}

		let tempXData = [];
		let tempExpends = [];
		let tempIncomes = [];
		let tempBalance = [];
		data.map((item) => {
			tempXData.push(item.date);
			tempExpends.push(item.expend);
			tempIncomes.push(item.income);
			tempBalance.push(item.income - item.expend);
		});
		setXData(tempXData);
		setExpends(tempExpends);
		setIncomes(tempIncomes);
		setBalance(tempBalance);

	}, [detailList]);

	var emphasisStyle = {
		itemStyle: {
			shadowBlur: 10,
			shadowColor: "rgba(0,0,0,0.3)",
		},
	};
	let option = {
		title: {
			text: dateText,
			subtext: `收入支出详情`,
		},
		grid: {
			left: "3%",
			right: "4%",
			bottom: "45",
			containLabel: true,
		},
		legend: {
			data: ["收入", "支出", "结余"],
			left: "150",
		},
		tooltip: {
			padding: 5,
			formatter: function (params) {
				return `${params.name}<br />${params.marker}&nbsp;${params.seriesName}&nbsp;&nbsp;&nbsp;${params.value} ¥`
			}
		},
		xAxis: {
			data: xData,
			// name: "月",
			axisLine: { onZero: true },
			splitLine: { show: false },
			splitArea: { show: false },
		},
		yAxis: {
			name: "",
		},
		toolbox: {
			feature: {
				magicType: {
					type: ["line", "bar", "stack", "tiled"],
					title: {
						line: "切换为折线图",
						bar: "切换为柱状图",
						stack: "堆叠",
						tiled: "平铺",
					},
				},
			},
		},

		dataZoom: [
			{
				type: "inside",
				start: 0,
				end: 100,
			},
			{
				start: 0,
				end: 100,
				backgroundColor: "rgba(255,255,255,0)",
				dataBackground: {
					areaStyle: {
						color: "red",
					},
				},
				labelFormatter: function (value) {
					return moment(value).format('YYYY-MM')
				},
				backgroundColor: '#fff',
				brushSelect: false
			},
		],
		series: [
			{
				name: "支出",
				type: "bar",
				stack: "one",
				emphasis: emphasisStyle,
				data: expends,
				itemStyle: {
					color: '#E91E63'
				},
				barMinHeight: 1,
			},
			{
				name: "收入",
				type: "bar",
				stack: "two",
				data: incomes,
				itemStyle: {
					color: '#001852'
				},
				barMinHeight: 1,
			},
			{
				name: "结余",
				type: "line",
				data: balance,
				itemStyle: {
					color: '#6699ff'
				}
			},
		],
	};

	return (
		<Section title={`${type}收入支出统计`}>
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

IncomeAndExpendStatistics.defaultProps = {};

export default IncomeAndExpendStatistics;
