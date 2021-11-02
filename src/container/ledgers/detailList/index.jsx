import React, { useState, useContext } from "react";
import classnames from 'classnames';
import moment from 'moment';
import { DownOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { Dropdown, DatePicker, Button } from 'antd'
import styles from "./style.module.scss"

import Icon from "components/Icon";
import Section from "components/Section";
import NoData from "components/NoData";
import EditRecord from './../editRecord';
import { CostContext } from './../context';

const weeks = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

function OpeationBtn({ name, onClick }) {
	return <button
		className={styles.oper}
		title={name}
		onClick={onClick}
	>
		<Icon name={name} />
	</button>
}

// 收支列表
export default function DetailList(props) {
	const {
		detailList,
		type,
		setCurrent, // 当前时间段
		dateText, // 当前日期范围字符串
		listLoading,
		editRecordHandle,
		addRecordHandle,
		batchRecordVisible,
		setBatchRecordVisible,
	} = useContext(CostContext);

	const [dateVisible, setDateVisible] = useState(false); // 显示控制
	const [localType, setLocalType] = useState(type); // 类型
	const [editToggle, setEditToggle] = useState(false);

	const typeChange = (type) => {
		setLocalType(type);
		setDateVisible(true)
	}

	const dateChange = (date, dateString) => {
		setCurrent({ date: dateString, type: localType })
		setDateVisible(false)
	}

	// 组装数据
	let result = detailList.reduce((total, currentValue) => {
		let { date } = currentValue;
		let formatDate = moment(date).format('YYYY-MM-DD');
		let value = { ...currentValue, date: formatDate }
		if (!total[formatDate]) {
			total[formatDate] = [value]
		} else {
			total[formatDate] = [...total[formatDate], value]
		}
		return total;
	}, {})
	let statisticsList = Object.keys(result).map(key => {
		let list = result[key];
		let statistics = list.reduce((total, currentValue) => {
			switch (currentValue.type) {
				case '0': total.expend += currentValue.amount; break;
				case '1': total.income += currentValue.amount; break;
			}
			return total;
		}, { date: key, expend: 0, income: 0 })
		return {
			...statistics,
			list
		}
	})
	// 列表中删除
	function deleteRecordHandle(data) {

	}
	// 编辑开关
	function editToggleHandle() {
		setEditToggle(!editToggle)
	}
	// 批量添加
	function batchAddHandle() {
		setBatchRecordVisible(!batchRecordVisible)
	}
	return (
		<div className={styles.wrapper}>
			<div className={styles.container}>
				<Section title={'收支详情'} className={styles.sectionContainer} extra={(
					<div className={styles.extra}>
						<Dropdown trigger="click" placement="bottomRight" overlayStyle={{ padding: 0 }} overlay={(
							<ul style={{ background: '#eee' }}>
								<div><Button type="text" style={{ width: '100%' }} onClick={() => { typeChange('year') }}>按年</Button></div>
								<div><Button type="text" style={{ width: '100%' }} onClick={() => { typeChange('month') }}>按月</Button></div>
								<div><Button type="text" style={{ width: '100%' }} onClick={() => { typeChange('') }}>全部</Button></div>
							</ul>
						)}>
							<span className={styles.topText}>{dateText}<DownOutlined /></span>
						</Dropdown>
						<div className={classnames(styles.date, { [styles.active]: dateVisible })}>
							<DatePicker
								value={null}
								style={{ width: 280 }}
								onChange={dateChange}
								picker={localType}
								open={dateVisible}
							/>
						</div>
						<div className={classnames(styles.menuContent, { [styles.active]: dateVisible })} onClick={() => setDateVisible(false)}></div>
					</div>
				)} loading={listLoading}>
					<div className={classnames(styles.scrollYBar)} style={{ flex: 1 }}>
						{
							statisticsList && statisticsList.length ? statisticsList.map((item, index) => {
								let { date, expend, income, list } = item;
								return (
									<div className={styles.itemBox} key={index}>
										<div className={classnames(styles.spaceBetween, styles.itemTitle)}>
											<div>{moment(date).format('M月D日')} {weeks[moment(date).format('e')]}</div>
											<div className={classnames(styles.total)}>
												<span>支出: {expend}</span>
												<span>收入: {income}</span>
											</div>
										</div>
										<ul className={styles.content}>
											{
												list.map((data, i) => {
													let { label, remark, type, amount } = data;
													return (
														<li className={styles.spaceBetween} key={date + '-' + i}>
															<span><Icon name={label} /></span>
															<span>
																<span>{label}</span>
																<br />
																<p>{remark}</p>
															</span>
															<span className={{ '0': styles.expand, '1': styles.income }[type]}>{{ '0': '-', '1': '+' }[type]}{amount}</span>
															<span style={{ display: editToggle ? 'inline-block' : 'none' }}>
																<Button
																	type="text"
																	title="编辑"
																	icon={<EditOutlined style={{ color: '#3f51b5' }} />}
																	onClick={() => editRecordHandle(data)}
																/>
																<Button
																	type="text"
																	title="删除"
																	icon={<DeleteOutlined style={{ color: '#e91e63' }} />}
																	onClick={() => deleteRecordHandle(data)} />
															</span>
														</li>
													)
												})
											}
										</ul>
									</div>
								)
							}) : <NoData />
						}
					</div>
					<div className={styles.operation}>
						<div>
							{/* <Checkbox>全选</Checkbox> */}
						</div>
						<div className={styles.icon}>
							<OpeationBtn name="编辑" onClick={batchAddHandle} />
							<OpeationBtn name="编辑" onClick={editToggleHandle} />
							<OpeationBtn name="新增" onClick={addRecordHandle} />
						</div>
					</div>
				</Section>
			</div>

			<div className={styles.editPlane}>
				<EditRecord />
			</div>
		</div>
	);
};

DetailList.defaultProps = {};

