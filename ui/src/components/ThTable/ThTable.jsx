/*
 * @Description:
 * @Autor: fage
 * @Date: 2022-07-07 14:36:09
 * @LastEditors: chenbinfa
 * @LastEditTime: 2022-08-16 17:03:31
 */
import React, { useRef, useState, useEffect } from "react";
import {
	DatePicker,
	Input,
	InputNumber,
	Menu,
	Modal,
	Button,
	Tooltip,
	Dropdown,
	Descriptions,
	Select,
	Space,
	Table,
	message,
	Tabs,
	Popconfirm,
	Checkbox,
	Card,
	Form
} from "antd";
import { UserOutlined, DownOutlined, DeleteOutlined, SwapRightOutlined } from "@ant-design/icons";
import _ from "lodash";
import { useNavigate, NavLink } from "react-router-dom";
import "./ThTable.less";
import queryDB from "@services/queryDB";
import NumberRange from "./components/NumberRange";
import { ThForm } from "./ThForm";
import { ThDetail } from "./ThDetail";
import moment from "moment";
import copy from "copy-to-clipboard";
import { formatArr } from "@/utils";
let ignore = false;

const { Option } = Select;
const { Column, ColumnGroup } = Table;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
let runCount = 0;
let dics = [];
let timeout = null;

export function ThTable({ props }) {
	runCount++;
	// console.log("ThTable render count", runCount);
	// console.log("props", props);
	const hasBorder = props.border;
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [modalVisible, setModalVisible] = useState(0);
	const [dataSource, setDataSource] = useState([]);
	const [selectRows, setSelectRows] = useState([]);

	const [total, setTotal] = useState(0);
	const [pageindex, setPageindex] = useState(props.pageindex || 1);
	const [pagesize, setPagesize] = useState(props.pagesize);
	const [reload, setReload] = useState(false);

	const [sorter, setSorter] = useState(null);
	const [filter, setFilter] = useState(null);

	const [form] = Form.useForm();
	const [form2] = Form.useForm();

	const pagination = {
		total,
		current: pageindex,
		pageSize: pagesize,
		showSizeChanger: true,
		showQuickJumper: true,
		onChange: (i, size) => {
			// console.log("i, size", i, size);
			setPageindex(i);
			setPagesize(size);
			setReload(!reload);
		},
		showTotal: total => `Total ${total}`
	};

	//load dics
	useEffect(async () => {
		// console.log("load dics");
		let result = await queryDB.dics();
		if (result.msg != "ok") {
			return;
		}
		dics = result.data;
		// console.log("dics", dics);
	}, []);

	//ajax post
	useEffect(() => {
		(async function anyNameFunction() {
			if (props.table && props.table.dataSource) {
				setDataSource(props.table.dataSource);
				const total = props.table.total || props.table.dataSource.length;
				setTotal(total);
				return;
			}
			ignore = false;
			clearTimeout(timeout);
			setLoading(true);
			let params = {};
			if (props.loadList?.params) {
				params = _.cloneDeep(props.loadList.params);
			}
			params.pageindex = pageindex;
			params.pagesize = pagesize;
			if (sorter) {
				params.sorter = [
					{
						column: sorter.column,
						order: sorter.order
					}
				];
			}
			if (filter) {
				params.filter = filter;
				params.filterType = "and";
			}
			let result = await props.loadList?.method(params);
			if (!result || result.msg != "ok") {
				setLoading(false);
				return;
			}
			result.data.forEach((t, i) => {
				if (!t.key) {
					t.key = t.id || i;
				}
			});
			result.data.forEach((t, i) => {
				let arr = result.data.filter(d => d.key == t.key);
				if (arr.length > 1) {
					arr[1].key = arr[1].key + "-2";
				}
			});
			setDataSource(result.data);
			setTotal(result.total || result.data.length);
			console.log("result.data", result.data.length);
			console.log("result.total", result.total);
			setLoading(false);
			//autoRefresh
			if (props.loadList && props.loadList.autoRefresh) {
				timeout = setTimeout(() => {
					if (ignore) return;
					// console.log("autoRefresh", props.loadList.autoRefresh);
					setReload(new Date());
				}, props.loadList.autoRefresh);
			}
		})();
		return () => {
			ignore = true;
		};
	}, [reload]);

	const onTableChange = (paginationObj, filters, sorter, extra) => {
		// console.log("pagination", pagination);
		// console.log("filters", filters);
		// console.log("sorter", sorter);
		// console.log("extra", extra);
		if (sorter && sorter.order) {
			setSorter({
				column: sorter.columnKey || sorter.field,
				order: sorter.order.replace("end", "")
			});
		} else {
			setSorter(null);
		}
		setReload(!reload);
	};

	// format props.batchAction
	useEffect(() => {
		if (props.batchAction && props.batchAction.length > 0 && !props.table?.rowSelection) {
			props.table.rowSelection = {
				type: "checkbox"
			};
		}
		if (props.table?.rowSelection) {
			props.table.rowSelection.onChange = (selectedRowKeys, selectedRows) => {
				setSelectRows(selectedRows);
				// console.log(`selectedRowKeys: ${selectedRowKeys}`, "selectedRows: ", selectedRows);
			};
		}
	}, []);
	// format props.table.columns
	useEffect(() => {
		if (!props.table || !props.table.columns) {
			return;
		}
		formatArr(props.table.columns);
	}, []);

	const onModalOk = () => {
		setModalVisible(0);
	};

	const onModalCancel = () => {
		setModalVisible(0);
	};

	const renderFilterItem = item => {
		if (!item.arr && item.dicId) {
			const dic = dics.find(d => d.id == item.dicId);
			if (dic && dic.items) {
				item.arr = dic.items;
			}
			if (!item.arr || item.arr.length == 0) {
				return "";
			}
		}
		if (item.type === "select") {
			return (
				<Form.Item label={item.label} name={item.cloumn} key={item.cloumn} initialValue={item.defaultValue || 0}>
					<Select
						style={{
							width: 120
						}}
						bordered={hasBorder}
						{...item.props}>
						<Option value={0}>--All--</Option>
						{item.arr.map((a, i) => (
							<Option key={a.value} value={a.value}>
								{a.label}
							</Option>
						))}
					</Select>
				</Form.Item>
			);
		} else if (item.type === "datetime") {
			return (
				<Form.Item label={item.label} key={item.cloumn} name={item.cloumn} initialValue={item.defaultValue}>
					<RangePicker
						showTime={{
							format: "HH:mm"
						}}
						format="YYYY-MM-DD HH:mm"
						allowEmpty={[true, true]}
						{...item.props}
					/>
				</Form.Item>
			);
		} else if (item.type === "numberRange") {
			return (
				<Form.Item label={item.label} key={item.cloumn} name={item.cloumn} initialValue={item.defaultValue}>
					<NumberRange props={item.props} />
				</Form.Item>
			);
		}
	};
	const onFilterFormFinish = values => {
		onFilterSumbit(props.filterBar, values);
	};
	const onTitleFilterFormFinish = values => {
		onFilterSumbit(props.titleBar?.filter, values);
	};
	const onFilterSumbit = (filterConfig, values) => {
		// console.log("values", values);
		const filterBar = [];
		filterConfig.forEach(t => {
			const k = t.cloumn;
			const v = values[k];
			if (!v) {
				return;
			}
			if (t.type === "select") {
				v = v.trim();
				if (!v) {
					return;
				}
				filterBar.push({
					column: k,
					sign: "=",
					values: [v]
				});
			} else if (t.type === "datetime") {
				if (v[0] && v[1]) {
					filterBar.push({
						column: k,
						sign: "betweenTime",
						values: [v[0].format("YYYY-MM-DD HH:mm:ss"), v[1].format("YYYY-MM-DD HH:mm:ss")]
					});
				} else if (v[0]) {
					filterBar.push({
						column: k,
						sign: ">=",
						values: [v[0].format("YYYY-MM-DD HH:mm:ss")]
					});
				} else if (v[1]) {
					filterBar.push({
						column: k,
						sign: "<=",
						values: [v[1].format("YYYY-MM-DD HH:mm:ss")]
					});
				}
			} else if (t.type === "numberRange") {
				if (v[0] !== null && v[1] !== null && v[1] >= v[0]) {
					filterBar.push({
						column: k,
						sign: "between",
						values: v
					});
				} else if (v[0] !== null) {
					filterBar.push({
						column: k,
						sign: ">=",
						values: [v[0]]
					});
				} else if (v[1] !== null) {
					filterBar.push({
						column: k,
						sign: "<=",
						values: [v[1]]
					});
				}
			}
		});
		setFilter(filterBar);
		setReload(!reload);
	};
	const onFilterReset = () => {
		form.resetFields();
	};
	const renderBtn = (item, i) => {
		if (item.type == "add") {
			return (
				<Button size={props.size} key={i} {...item.props} type="primary" onClick={() => setModalVisible(1)}>
					{item.label || "+ 添加"}
				</Button>
			);
		} else {
			return (
				<Button size={props.size} key={i} {...item.props}>
					{item.label}
				</Button>
			);
		}
	};
	const renderBatchActionBtn = (item, i) => {
		if (item.props?.onClick) {
			item.onClick = item.props.onClick;
		}
		if (item.type == "del") {
			return (
				<Button size={props.size} key={i} {...item.props} danger type="default" icon={<DeleteOutlined />}>
					{item.label || " 删除选中"}
				</Button>
			);
		} else {
			return (
				<Button
					size={props.size}
					key={i}
					{...item.props}
					onClick={e => {
						if (item.onClick && selectRows.length > 0) {
							item.onClick(selectRows);
						}
					}}>
					{item.label}
				</Button>
			);
		}
	};

	return (
		<div className="containner-in">
			{props.filterBar ? (
				<div className="filter-box">
					<Form size={props.size} name="horizontal_filter" form={form} layout="inline" onFinish={onFilterFormFinish}>
						{props.filterBar?.map((f, i) => renderFilterItem(f))}
						<Form.Item className="right-btn-box">
							<Button type="default" htmlType="button" onClick={onFilterReset}>
								重置
							</Button>
							&nbsp;
							<Button type="primary" htmlType="submit">
								查询
							</Button>
						</Form.Item>
					</Form>
				</div>
			) : (
				""
			)}
			{props.btnBar && props.btnBar.btns && props.btnBar.btns.length > 0 ? (
				<div className="btns-box">
					<Space style={{ float: props.btnBar?.float }}>{props.btnBar?.btns?.map((f, i) => renderBtn(f, i))}</Space>
				</div>
			) : (
				""
			)}
			<div className="content-box block">
				{props.titleBar ? (
					<div className="table-header block">
						<div className="table-title block">{props.titleBar?.title}</div>
						<div className="right-btn-box block">
							<Space>
								<Form size={props.size} key={"filter-box"} name="horizontal_title_filter" form={form2} layout="inline" onFinish={onTitleFilterFormFinish}>
									{props.titleBar?.filter?.map(f => renderFilterItem(f))}
									{props.titleBar && props.titleBar.filter ? (
										<Form.Item className="right-btn-box">
											<Button type="primary" htmlType="submit">
												查询
											</Button>
										</Form.Item>
									) : (
										""
									)}
								</Form>
								{props.titleBar?.btns?.map((f, i) => renderBtn(f, i))}
							</Space>
						</div>
					</div>
				) : (
					""
				)}
				<div className="table-box block">
					<Table loading={loading} size={props.size} dataSource={dataSource} {...props.table} pagination={props.hidePager ? false : pagination} onChange={onTableChange} />
					<div className="batch-btn-box">
						{props.batchAction && props.batchAction.length > 0 ? <Space>{props.batchAction?.map((f, i) => renderBatchActionBtn(f, i))}</Space> : ""}
					</div>
				</div>
			</div>
			{props.create ? (
				<Modal
					size={props.size}
					footer={false}
					title={props.create?.title}
					width={props.create?.width || "60%"}
					visible={modalVisible === 1}
					onOk={onModalOk}
					onCancel={onModalCancel}>
					<ThForm props={props.create} />
				</Modal>
			) : (
				""
			)}
			{props.detail ? (
				<Modal
					size={props.size}
					footer={false}
					title={props.detail?.title}
					width={props.detail?.width || "60%"}
					visible={modalVisible === 2}
					onOk={onModalOk}
					onCancel={onModalCancel}>
					<ThDetail props={props.detail} />
				</Modal>
			) : (
				""
			)}
		</div>
	);
}
