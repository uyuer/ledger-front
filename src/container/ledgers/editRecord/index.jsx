import React, { useEffect, useState, useContext } from "react";
import classnames from "classnames";
import moment from "moment";
import { DatePicker, Button, Drawer, Form, Input, Radio, Space, InputNumber, Message } from "antd";
import styles from "./style.module.scss";
import Icon from "components/Icon"
import { CostContext } from "./../context";
import service from "service";

// 账单数据编辑|新增面板
export default function EditRecord(props) {
	const {
		labels, // 标签列表
		selectedBookId, // 当前选中账本
		getList, // 获取数据列表
		recordVisible, // 账单详情编辑|新增面板显示
		record, //
		editType, // 编辑类型
		cancelRecordHandle, // 账单数据编辑|新增面板关闭
	} = useContext(CostContext);

	const [formIns] = Form.useForm();
	const [loading, setLoading] = useState(false);
	const [selected, setSelected] = useState("");

	useEffect(() => {
		if (!recordVisible || !editType || !labels.length) {
			return;
		}
		let labelId = labels.length ? labels[0].id : null;
		const initialValues = {
			add: {
				date: moment(),
				type: "0",
				labelId: labelId,
			},
			edit: {
				date: moment((record || {}).date),
				type: (record || {}).type,
				labelId: (record || {}).labelId,
				amount: (record || {}).amount,
				remark: (record || {}).remark,
			},
		}[editType];
		// 初始化页面
		setSelected(initialValues.labelId);
		formIns.setFieldsValue(initialValues);
	}, [recordVisible, editType, record, labels, formIns]);

	// 分类标签点击
	function labelChange(id) {
		setSelected(id);
		formIns.setFieldsValue({ labelId: id });
	}
	// 点击提交
	function onFinish(values) {
		let params = {
			...values,
			date: values.date.format("YYYY-MM-DD"),
			bookId: selectedBookId, // 使用页面选中的账本id, 编辑时可以改变所属账本
			id: (record || {}).id,
		};
		setLoading(true);
		let handle = {
			edit: edit,
			add: add,
		}[editType];
		handle(params);
	}
	function edit(params) {
		return service.detail.updateOne(params)
			.then((data) => {
				Message.success("编辑成功");
				cancel();
			})
			.finally(() => {
				setLoading(false);
				getList();
			});
	}
	function add(params) {
		return service.detail.addOne(params)
			.then((data) => {
				Message.success("添加成功");
				cancel();
			})
			.finally(() => {
				setLoading(false);
				getList();
			});
	}

	// 关闭弹窗, 关闭时需要重置form
	function cancel() {
		setSelected('')
		formIns.resetFields();
		cancelRecordHandle();
	}

	return (
		<Drawer
			title={editType === "add" ? "新增" : "编辑"}
			placement="bottom"
			closable={false}
			onClose={cancel}
			visible={recordVisible}
			getContainer={false}
			style={{ position: "absolute" }}
			height={"auto"}
			bodyStyle={{ padding: "8px 20px" }}
			headerStyle={{ padding: "8px 20px" }}
		>
			<Form form={formIns} onFinish={onFinish} labelAlign={"right"} labelCol={{ span: 5 }} wrapperCol={{ span: 18 }}>
				<Form.Item label="所有分类" name="labelId" rules={[{ required: true, message: "请选择分类" }]} labelCol={{ span: 6 }} wrapperCol={{ span: 24 }} style={{ flexDirection: "column" }}>
					<ul className={styles.labelList}>
						{labels.map((item) => {
							return (
								<li className={classnames(item.id === selected ? styles.active : "")} key={item.id} onClick={() => labelChange(item.id)}>
									<i><Icon name={item.label} /></i>
									<p>{item.label}</p>
								</li>
							);
						})}
					</ul>
				</Form.Item>
				<Form.Item label="类型" name="type" rules={[{ required: true }]}>
					<Radio.Group>
						<Radio value={"0"}>支出</Radio>
						<Radio value={"1"}>收入</Radio>
					</Radio.Group>
				</Form.Item>
				<Form.Item label="日期" name="date" rules={[{ required: true }]}>
					<DatePicker placeholder="请选择" style={{ width: 140 }} format={"YYYY-MM-DD"} />
				</Form.Item>
				<Form.Item label="金额" name="amount" rules={[{ required: true }]}>
					<InputNumber placeholder="请输入" style={{ width: 140 }} min={0} max={1000000} />
				</Form.Item>
				<Form.Item label="备注" name="remark">
					<Input.TextArea placeholder="请输入" autoSize={{ minRows: 2, maxRows: 3 }} />
				</Form.Item>
				<Form.Item style={{ textAlign: "center" }} wrapperCol={{ span: 24 }}>
					<Space size={8}>
						<Button type="primary" htmlType="submit" style={{ width: 120 }} loading={loading} disabled={loading}>
							确定
						</Button>
						<Button style={{ width: 120 }} disabled={loading} onClick={cancel}>
							取消
						</Button>
					</Space>
				</Form.Item>
			</Form>
		</Drawer>
	);
}

EditRecord.defaultProps = {};
