import React, { useEffect, useState, useContext } from "react";
import moment from "moment";
// import * as echarts from "echarts";

import { EchartBase } from "components/echarts";
import Section from "components/Section";

import { CostContext } from "./../context";

// 月支出详情
const ExpendDetail = (props) => {
	const { time, type, dateText, detailList } = useContext(CostContext);
	const [value, setValue] = useState([]);

	let option = {
		title: {
			text: dateText,
			subtext: `日支出详情`,
		},
		grid: {
			left: "3%",
			right: "4%",
			bottom: "40",
			containLabel: true,
		},
		toolbox: {
			feature: {
				saveAsImage: {},
			},
		},
		tooltip: {
			trigger: "axis",
			padding: 5,
			formatter: ([params]) => {
				return `
					<p style="display:flex;justify-content: space-between;"><span>${params.marker}日期：</span><span>${params.value[0]}</span></p>
					<p style="display:flex;justify-content: space-between;"><span>${params.marker}${params.seriesName}：</span><span>${params.value[1]} ¥</span></p>
				`;
			},
		},
		xAxis: {
			type: "time",
			boundaryGap: false,
			splitLine: { show: false },
		},
		yAxis: {
			type: "value",
			boundaryGap: [0, "100%"],
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
				labelFormatter: function (value) {
					return moment(value).format('YYYY-MM-DD')
				},
				brushSelect: false
			},
		],
		series: [
			{
				name: "支出金额",
				data: value,
				type: "line",
				itemStyle: {
					color: '#E91E63'
				},
				lineStyle: {
					color: '#E91E63'
				}
			},
		],
	};

	useEffect(() => {
		let result = detailList.reduce((total, currentValue) => {
			let { date } = currentValue;
			let formatDate = moment(date).format("YYYY-MM-DD");
			let value = { ...currentValue, date: formatDate };
			if (!total[formatDate]) {
				total[formatDate] = [value];
			} else {
				total[formatDate] = [...total[formatDate], value];
			}
			return total;
		}, {});
		let temp = Object.keys(result).reduce((total, key) => {
			let list = result[key];
			let statistics = list.reduce((total, currentValue) => {
				if (currentValue.type === "0") {
					total += currentValue.amount;
				}
				return total;
			}, 0);
			total[key] = statistics;
			return total;
		}, result);

		let resultArr = Object.keys(result);
		let tempStart = resultArr[resultArr.length - 1],
			tempEnd = resultArr[0];
		let start = moment(moment(tempStart).format("YYYY-MM")).format("YYYY-MM-DD");
		let end = moment(moment(tempEnd).format("YYYY-MM")).add(1, "months").subtract(1, "seconds").format("YYYY-MM-DD");

		var dateStart = moment(start);
		var dateEnd = moment(end);
		var data = [];

		while (dateEnd > dateStart || dateStart.format("M") === dateEnd.format("M")) {
			let dateStr = dateStart.format("YYYY-MM-DD");
			data.push([dateStr, temp[dateStr] ? temp[dateStr] : 0]);
			dateStart.add(1, "days");
		}
		setValue(data);
	}, [detailList, time]);

	return (
		<Section title={`${type}支出详情`}>
			<EchartBase option={option} style={{ height: 250 }} />
		</Section>
	);
};

ExpendDetail.defaultProps = {};

export default ExpendDetail;
