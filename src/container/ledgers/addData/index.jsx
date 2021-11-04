import React, { useEffect, useState, useContext } from "react";
import moment from 'moment';
import 'moment/locale/zh-cn';
import { Drawer, DatePicker } from 'antd';
import { Message, Input, Button, Form, Space, Select } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'

import styles from "./style.module.scss";

import service from 'service';
import { getLocalUserInfo } from 'utils/util';
import { CostContext } from './../context';

const alias = {
	type: '类型',
	date: '日期',
	amount: '金额',
	labelId: '标签',
	remark: '备注',
}
const accountsRules = {
	type: [{ required: true, message: "类型不可为空" }, { pattern: /[01]/, message: "类型参数错误" }],
	date: [{ required: true, message: "日期不可为空" }],
	amount: [{ required: true, message: "金额不可为空" }],
	labelId: [{ required: true, message: "标签不可为空" }],
	remark: [{ required: false, message: "" }],
}
const initRecord = {
	type: '0',
	date: moment(),
	amount: '',
	labelId: '',
	remark: '',
}
const inputStyle = {
	minHight: 36, borderRadius: 3
}
const name = 'LedgersAddList';
let timer = null;

// 添加账单记录
export default function AddData(props) {
	const { batchRecordVisible, setBatchRecordVisible } = useContext(CostContext);

	const [loading, setLoading] = useState(false);
	const [labels, setLabels] = useState([]); // 标签
	const storageList = localStorage.getItem(name);
	const batchAddList = storageList ? JSON.parse(storageList).map(item => {
		item.date = moment(item.date ? item.date : undefined)
		return item;
	}) : [];
	const columns = [
		{
			field: 'type', style: { ...inputStyle, width: 80 }, render(opt) {
				let { key, style } = opt
				return (
					<Select
						placeholder={alias[key]}
						style={style}
					>
						<Select.Option value={'0'}>支出</Select.Option>
						<Select.Option value={'1'}>收入</Select.Option>
					</Select>
				)
			}
		},
		{
			field: 'date', style: { ...inputStyle, width: 120 }, initialValues: moment(), render(opt) {
				let { key, style } = opt;
				return <DatePicker placeholder={alias[key]} style={style} format={'YYYY-MM-DD'} />
			}
		},
		{
			field: 'amount', style: { ...inputStyle, width: 80 }, render(opt) {
				let { key, style } = opt;
				return <Input placeholder={alias[key]} style={style} />
			}
		},
		{
			field: 'labelId', style: { ...inputStyle, width: 80 }, render(opt) {
				let { style } = opt
				return (
					<Select
						placeholder="请选择"
						style={style}
						showSearch
						optionFilterProp="children"
					>
						{labels.map(item => (<Select.Option key={item.id} value={item.id} title={item.label}>{item.label}</Select.Option>))}
					</Select>
				)
			}
		},
		{
			field: 'remark', style: { ...inputStyle, width: 160 }, render(opt) {
				let { key, style } = opt;
				return <Input placeholder={alias[key]} style={style} />
			}
		},
	]

	function onFinish(values) {
		const user = getLocalUserInfo() || {};
		const { id: userId } = user || {}
		if (!userId) {
			return Message.error('错误! 未登录用户')
		}
		let params = values.formList.map(value => {
			value.date = moment(value.date).format('YYYY-MM-DD');
			return value;
		})
		setLoading(true)
		service.detail.addMultiple(params)
			.then(result => {
				if (result) {
					Message.success('批量添加成功!')
					localStorage.removeItem(name)
				}
			})
			.finally(() => {
				setLoading(false);
			})
	}
	function onValuesChange(changedValues, allValues) {
		clearTimeout(timer);
		timer = setTimeout(() => {
			localStorage.setItem(name, JSON.stringify(allValues.formList));
		}, 500)
	}
	function getLabels() {
		const user = getLocalUserInfo() || {};
		const { id: userId } = user || {}
		if (!userId) {
			return Message.error('错误! 未登录用户')
		}
		let params = { userId }
		service.label.findAll(params).then(result => {
			setLabels(result);
		})
	}
	useEffect(() => {
		getLabels()
	}, [])
	return (
		<Drawer
			title="添加数据"
			placement={'left'}
			closable={false}
			onClose={() => setBatchRecordVisible(false)}
			visible={batchRecordVisible}
			bodyStyle={{ padding: 12 }}
			// height={400}
			width={'auto'}
		>
			<div className={styles.container}>
				<div className={styles.table}>
					<>
						<div className={styles.header}>
							<Space className={styles.space} align="baseline" size={8}>
								{columns.map((item, index) => {
									let { field: key, style } = item;
									return (
										<span key={index} value={alias[key]} style={{ ...style }} className={styles.th} >{alias[key]}</span>
									)
								})}
							</Space>
						</div>
					</>
					<Form
						name="dynamic_form_nest_item"
						onFinish={onFinish}
						onValuesChange={onValuesChange}
						autoComplete="off"
					>
						<Form.List name="formList" initialValue={batchAddList}>
							{(fields, { add, remove, move }, errors) => {
								return (
									<>
										{fields.map((item, index) => {
											let { key, name, fieldKey, ...restField } = item;
											return (
												<Space key={key} className={styles.space} align="baseline" size={8}>
													{
														columns.map(item => {
															let { field: key, render, style } = item;
															return (
																<Form.Item
																	{...restField}
																	key={index + '' + key}
																	name={[name, key]}
																	fieldKey={[fieldKey, key]}
																	rules={accountsRules[key]}
																	className={styles.formItem}
																>
																	{render ? render({ key, style, record: batchAddList[index], index }) : <Input placeholder={alias[key]} style={style || inputStyle} />}
																</Form.Item>
															)
														})
													}
													<span style={{ padding: 6 }}>
														<MinusCircleOutlined onClick={() => remove(name)} />
													</span>
												</Space>
											)
										})}
										<Form.Item>
											<Button type="dashed" onClick={() => add(initRecord)} block icon={<PlusOutlined />} style={inputStyle}>新增一条</Button>
										</Form.Item>
									</>
								)
							}}
						</Form.List>
						<Form.Item style={{ textAlign: 'center' }}>
							<Space size={8}>
								<Button type="primary" htmlType="submit" style={{ width: 150 }} loading={loading} disabled={loading}>确定</Button>
								<Button style={{ width: 150 }} disabled={loading} onClick={() => setBatchRecordVisible(!batchRecordVisible)}>取消</Button>
							</Space>
						</Form.Item>
					</Form>
				</div>
			</div>
		</Drawer>
	)
};

