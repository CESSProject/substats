/*
 * @Description:
 * @Autor: fage
 * @Date: 2022-07-07 14:36:09
 * @LastEditors: chenbinfa
 * @LastEditTime: 2022-08-18 17:39:21
 */
import React, { useRef, useState, useEffect } from "react";
import { DatePicker, Input, Menu, Modal, Button, Dropdown, Descriptions, Select, Space, Table, message, Tabs, Popconfirm, Checkbox, Card, Form } from "antd";
import { UserOutlined, DownOutlined, DeleteOutlined } from "@ant-design/icons";
import _ from "lodash";
import "./list.less";
import constantsAJAX from "@services/chain-state/constants";
import storageAJAX from "@services/storage";
import { formatterCurrency, formatterCurrencyStr, formatterSize, formatterSizeFromMB } from "@utils/format";
import { ThTable } from "@/components/ThTable";
import queryDB from "@services/queryDB";
import moment from "moment";

const { Option } = Select;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const Main = () => {
	const menu = (
		<Menu
			items={[
				{
					label: "1st menu item",
					key: "1",
					icon: <UserOutlined />
				},
				{
					label: "2nd menu item",
					key: "2",
					icon: <UserOutlined />
				},
				{
					label: "3rd menu item",
					key: "3",
					icon: <UserOutlined />
				}
			]}
		/>
	);

	const props = {
		border: true,
		size: "middle",
		pagesize: 5,
		filterBar: [
			{
				label: "ARR状态",
				cloumn: "status2",
				type: "select",
				defaultValue: 0,
				arr: [
					{ value: 1, label: "进行中" },
					{ value: 2, label: "已完成" },
					{ value: 3, label: "开始中" },
					{ value: 4, label: "进行中2" }
				]
			},
			{
				label: "状态",
				cloumn: "status",
				type: "select",
				defaultValue: 0,
				dicId: 1
			},
			{
				label: "Timestamp",
				cloumn: "timestamp",
				type: "datetime",
				props: {
					showTime: true
				}
			},
			{
				label: "Block Height",
				cloumn: "blockHeight",
				type: "numberRange",
				props: {
					keyboard: true
				}
			}
		],
		titleBar: {
			title: "表格标题",
			filter: [
				{
					label: "状态",
					cloumn: "status",
					type: "select",
					defaultValue: 0,
					dicId: 1
				},
				{
					label: "Block Height",
					cloumn: "blockHeight",
					type: "numberRange",
					props: {
						keyboard: true
					}
				}
			],
			btns: [
				{
					label: "AJAX请求",
					type: "ajax",
					key: "2",
					props: {
						type: "default",
						onClick: () => {
							alert("nnn");
						}
					}
				},
				{
					label: "",
					type: "add",
					key: "1"
				}
			]
		},
		btnBar: {
			float: "left",
			btns: [
				{
					label: "AJAX请求",
					type: "ajax",
					key: "2",
					props: {
						type: "default",
						onClick: () => {
							alert("333");
						}
					}
				},
				{
					label: "",
					type: "add",
					key: "1"
				}
			]
		},
		loadList: {
			params: {
				tableName: "block_info"
			},
			method: queryDB.list
		},
		table: {
			columns: [
				{
					title: "blockHeight",
					dataIndex: "blockHeight",
					key: "blockHeight",
					sorter: true
				},
				{
					title: "hash",
					dataIndex: "hash",
					key: "hash",
					width: "15%",
					textWrap: "word-break",
					ellipsis: true
				},
				{
					title: "parentHash",
					dataIndex: "parentHash",
					key: "parentHash",
					width: "15%",
					textWrap: "word-break",
					ellipsis: true
				},
				// {
				// 	title: "stateRoot",
				// 	dataIndex: "stateRoot",
				// 	key: "stateRoot",
				// 	width: "15%",
				// 	textWrap: "word-break",
				// 	ellipsis: true
				// },
				// {
				// 	title: "extrinsicsRoot",
				// 	dataIndex: "extrinsicsRoot",
				// 	key: "extrinsicsRoot",
				// 	width: "15%",
				// 	textWrap: "word-break",
				// 	ellipsis: true
				// },
				{
					title: "timestamp",
					dataIndex: "timestamp",
					key: "timestamp",
					sorter: true
				},
				{
					title: "操作",
					key: "operation",
					fixed: "right",
					width: 120,
					render: () => (
						<div>
							<a onClick={e => setModalVisible(2)}>详情</a> &nbsp;&nbsp;
							<a onClick={e => setModalVisible(1)}>编辑</a>&nbsp;&nbsp;
							<Dropdown overlay={menu}>
								<a onClick={e => e.preventDefault()}>
									<DownOutlined />
								</a>
							</Dropdown>
						</div>
					)
				}
			]
		},
		create: {
			title: "添加记录",
			params: {
				tableName: "block_info"
			},
			method: queryDB.list,
			columns: [
				{
					title: "blockHeight",
					dataIndex: "blockHeight",
					key: "blockHeight",
					sorter: true
				},
				{
					title: "hash",
					dataIndex: "hash",
					key: "hash",
					width: "15%",
					textWrap: "word-break",
					ellipsis: true
				},
				{
					title: "parentHash",
					dataIndex: "parentHash",
					key: "parentHash",
					width: "15%",
					textWrap: "word-break",
					ellipsis: true
				},
				// {
				// 	title: "stateRoot",
				// 	dataIndex: "stateRoot",
				// 	key: "stateRoot",
				// 	width: "15%",
				// 	textWrap: "word-break",
				// 	ellipsis: true
				// },
				// {
				// 	title: "extrinsicsRoot",
				// 	dataIndex: "extrinsicsRoot",
				// 	key: "extrinsicsRoot",
				// 	width: "15%",
				// 	textWrap: "word-break",
				// 	ellipsis: true
				// },
				{
					title: "timestamp",
					dataIndex: "timestamp",
					key: "timestamp",
					sorter: true
				}
			]
		},
		batchAction: [
			{
				label: "",
				type: "del",
				key: "1"
			},
			{
				label: "AJAX请求",
				type: "ajax",
				key: "2",
				props: {
					type: "default",
					onClick: items => {
						alert("select count:" + items.length);
					}
				}
			}
		]
	};

	return <ThTable props={props} />;
};

function isEqual(prevProps, nextProps) {
	return _.isEqual(prevProps.data, nextProps.data);
}

export default React.memo(Main, isEqual);
