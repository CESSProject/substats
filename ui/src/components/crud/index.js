/*
 * @description: CRUD组件，纯业务组件用（搜索/重置组件 + CRUD操作 + 表格 + 分页）
 * @author: Jack Chen @懒人码农
 * @Date: 2022-04-24 10:01:40
 * @LastEditors: Jack Chen
 * @LastEditTime: 2022-04-25 10:01:28
 */

import React, { useRef, useState } from "react";
import { DatePicker, Form, Input, Modal, Select, Table, message, Tabs, Checkbox } from "antd";
import FilterSearch from "@comp/crud/FilterSearch";
import Options from "@comp/crud/Options";
import _ from "lodash";
import CellAction from "@comp/crud/CellAction";
import { useNavigate } from "react-router-dom";

const { Option } = Select;
const { Column, ColumnGroup } = Table;
const { TabPane } = Tabs;

const dataSource = [
	{
		key: "1",
		name: "胡彦斌",
		age: 32,
		address: "西湖区湖底公园1号"
	},
	{
		key: "2",
		name: "胡彦祖",
		age: 42,
		address: "西湖区湖底公园1号"
	}
];
/**
 * columns参数
 * title 名称
 * dataIndex 列数据在数据项中对应的路径，支持通过数组查询嵌套路径,唯一标识
 * key  React 需要的 key，如果已经设置了唯一的 dataIndex，可以忽略这个属性
 * type 新增/修改 渲染的组件类型
 * rules 新增/修改 表单验证规则
 * isItem 是否是新增/修改表单项
 * isNotColumn 新增表单项是否是表格column
 */

const columns = [
	{
		title: "姓名",
		dataIndex: "name",
		key: "name",
		type: "input",
		rules: [{ required: true, message: "请输入姓名" }],
		isItem: true
	},
	{
		title: "年龄",
		dataIndex: "age",
		key: "age",
		isNotColumn: false,
		type: "input",
		rules: [{ required: true, message: "请输入年龄" }],
		isItem: true
	},
	{
		title: "住址",
		dataIndex: "address",
		key: "address",
		type: "input",
		rules: [{ required: true, message: "请输入住址" }],
		isItem: true
	},
	{
		title: "操作",
		dataIndex: "",
		key: "x",
		render: () => <a>编辑</a>
	}
];

const filterOptions = [
	{ label: "网关名称", filterKey: "gatewayName", type: "input" },
	{ label: "UID", filterKey: "uuid", type: "input" },
	{
		label: "设备状态",
		filterKey: "status",
		type: "select",
		options: [
			{ value: "待激活", label: "待激活", valueKey: 0 },
			{ value: "运行", label: "运行", valueKey: 1 },
			{ value: "停用", label: "停用", valueKey: 2 },
			{ value: "异常", label: "异常", valueKey: 3 }
		]
	},
	{ label: "日期", filterKey: "date", type: "date" }
];

const ThCRUD = ({ ...props }) => {
	const [form] = Form.useForm();
	const [isModalVisible, showModal] = useState(false);
	const [isEdit, changeEditStatus] = useState(false);
	const [currentRow, setCurrentRow] = useState(null);
	const [selectedRowKeys, setSelectedRowKeys] = useState([]);
	const navigate = useNavigate();
	/**
	 * 点击搜索
	 * @param params
	 */
	const handleSearch = params => {
		// _.isFunction(props.handleFinalSearch) && props.handleFinalSearch(params)
		console.log(params, "paramsparamsparams");
	};
	/**
	 * 点击重置
	 */
	const handleReset = () => {};

	/**
	 * 新增表格项
	 */
	const addRow = () => {
		showModal(true);
	};
	/**
	 * 删除表格项
	 */
	const delRow = () => {
		if (_.isEmpty(selectedRowKeys)) {
			message.info("请选择需要删除的项");
			return;
		}
	};
	/**
	 * 编辑表格项
	 */
	const editRow = record => {
		changeEditStatus(true);
		form.setFieldsValue(record);
		setCurrentRow(record);
		showModal(true);
	};
	/**
	 * 点击弹框确定按钮
	 */
	const handleOk = () => {
		form
			.validateFields()
			.then(nameList => {
				// 验证成功，提交服务器
				console.log(nameList, "nameList");
			})
			.catch(errorInfo => {
				// 验证失败
				console.log(errorInfo, "error");
			});
	};
	/**
	 * 关闭/取消弹框
	 */
	const handleCancel = () => {
		const nameList = props.columns ? props.columns.filter(n => n.isItem).map(n => n.dataIndex) : [];
		isEdit && form.resetFields(nameList);
		changeEditStatus(false);
		showModal(false);
	};
	/**
	 *  渲染新增/修改表单项
	 */
	const renderFormItem = item => {
		if (item.type === "input") {
			return <Input placeholder={`请输入${item.title}`} />;
		} else if (item.type === "select") {
			return (
				<Select style={{ width: "100%" }}>
					{item &&
						item.options &&
						item.options.map(opt => (
							<Option value={opt.value} lable={opt.label} key={opt.value}>
								{opt.label}
							</Option>
						))}
				</Select>
			);
		} else if (item.type === "date") {
			return <DatePicker style={{ width: "100%" }} />;
		} else if (item.type === "datetime") {
			return null;
		} else if (item.type === "checkbox") {
			return <Checkbox.Group options={item.checkboxOptions} onChange={checkBoxChange} />;
		} else {
			return null;
		}
	};

	const checkBoxChange = checkedValues => {
		console.log("checked = ", checkedValues);
	};

	const onSelectChange = selectedRowKeys => {
		console.log("selectedRowKeys changed: ", selectedRowKeys);
		setSelectedRowKeys(selectedRowKeys);
	};

	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange
	};

	return (
		<>
			{/* 搜索组件*/}
			{!_.isEmpty(props.filterOptions) && <FilterSearch filterOptions={props.filterOptions} handleSearch={handleSearch} />}
			{/* 操作组件*/}
			{(props.hasAdd || props.hasDel || !_.isEmpty(props.options)) && (
				<Options hasAdd={props.hasAdd} hasDel={props.hasDel} btnOptions={props.options} handleAdd={addRow} handleDel={delRow} />
			)}
			{/* tab页切换表格*/}
			{!_.isEmpty(props.tabList) && (
				<Tabs style={{ marginTop: "20px" }} defaultActiveKey="0" onChange={props.changeTab}>
					{props.tabList && props.tabList.map((t, idx) => <TabPane tab={t} key={idx} />)}
				</Tabs>
			)}
			{/* 表格*/}
			<Table {...props} title={() => ""} style={{ marginTop: "20px" }} dataSource={props.data || dataSource} pagination={props.pagination}>
				{props.columns &&
					props.columns.map(column => {
						if (column.isNotColumn) {
							return null;
						}
						if (props.hasEdit && _.isFunction(column.render) && column.dataIndex === "actions") {
							return (
								<Column
									title={column.title}
									dataIndex={column.dataIndex}
									key={column.key || column.dataIndex}
									render={(text, record) => (
										<>
											<a onClick={() => editRow(record)}>编辑</a>
											{column.render && _.isFunction(column.render) && column.render(record)}
										</>
									)}
								/>
							);
						} else if (column.render && _.isFunction(column.render)) {
							return <Column title={column.title} dataIndex={column.dataIndex} key={column.key || column.dataIndex} render={column.render} />;
						} else {
							return (
								<Column
									title={column.title}
									dataIndex={column.dataIndex}
									key={column.key || column.dataIndex}
									shouldCellUpdate={(record, prevRecord) => {
										return prevRecord[column.dataIndex] !== record[column.dataIndex];
									}}
								/>
							);
						}
					})}
			</Table>
			{/* 新增/修改 - 弹框*/}
			<Modal title={props.title || "默认标题"} centered visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
				<Form form={form} name="control-hooks">
					{props.columns &&
						props.columns.map(
							item =>
								item.isItem && (
									<Form.Item label={item.title} name={item.dataIndex} rules={item.rules} key={item.dataIndex}>
										{renderFormItem(item)}
									</Form.Item>
								)
						)}
				</Form>
			</Modal>
		</>
	);
};

function isEqual(prevProps, nextProps) {
	return _.isEqual(prevProps.data, nextProps.data);
}

export default React.memo(ThCRUD, isEqual);
