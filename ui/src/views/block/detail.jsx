/*
 * @Description:
 * @Autor: fage
 * @Date: 2022-07-26 17:49:48
 * @LastEditors: chenbinfa
 * @LastEditTime: 2022-08-16 17:06:54
 * @description: about
 * @author: chenbinfa
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
	Form,
	Collapse,
	Empty,
	Spin,
	List
} from "antd";
import { UserOutlined, DownOutlined, DeleteOutlined, SwapRightOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import styled from "styled-components";
import _ from "lodash";
import { useNavigate, useParams, NavLink } from "react-router-dom";
import queryDB from "@services/queryDB";
import { formatArr } from "@/utils/format-show-type";
import moment from "moment";
import copy from "copy-to-clipboard";
import BreadcrumbBar from "@/components/BreadcrumbBar";
import MList from "@/components/mobile/MList";

const { Option } = Select;
const { Column, ColumnGroup } = Table;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Panel } = Collapse;
let runCount = 0;
let dics = [];

function Main({ className }) {
	const { q } = useParams();
	const [loading, setLoading] = useState(false);
	const [blockHeight, setBlockHeight] = useState(q);
	const [blockDetail, setBlockDetail] = useState({});
	const [columns, setColumns] = useState([]);
	const [transactions, setTransactions] = useState([]);
	const [transactionColumns, setTransactionColumns] = useState([]);

	if (!q) {
		return message.error("blockHeight is not found");
	} else {
		if (q != blockHeight) {
			setBlockHeight(q);
		}
	}
	if (document.getElementById("searchInput")) {
		document.getElementById("searchInput").value = blockHeight;
	}
	console.log("blockHeight", blockHeight);
	useEffect(async () => {
		const params = {
			tableName: "block_info",
			pageindex: 1,
			pagesize: 1,
			filter: [
				{
					column: "blockHeight",
					sign: "=",
					values: [blockHeight]
				}
			]
		};
		let result = await queryDB.list(params);
		if (result.msg != "ok") {
			return message.info(result.err || result.msg);
		}
		setBlockDetail(result.data[0]);
	}, [blockHeight]);
	useEffect(async () => {
		setLoading(true);
		let params = {
			tableName: "block_event",
			pageindex: 1,
			pagesize: 10000,
			filter: [
				{
					column: "blockHeight",
					sign: "=",
					values: [blockHeight]
				}
			]
		};
		let result = await queryDB.list(params);
		if (result.msg != "ok") {
			setLoading(false);
			return message.info(result.err || result.msg);
		}
		const events = result.data;
		params = {
			tableName: "block_transaction",
			pageindex: 1,
			pagesize: 10000,
			filter: [
				{
					column: "blockHeight",
					sign: "=",
					values: [blockHeight]
				}
			]
		};
		result = await queryDB.list(params);
		if (result.msg != "ok") {
			setLoading(false);
			return message.info(result.err || result.msg);
		}
		result.data.forEach(tx => {
			tx.events = events.filter(ev => ev.txId == tx.id);
		});
		setTransactions(result.data);
		setLoading(false);
	}, [blockHeight]);
	useEffect(async () => {
		const columnsArr = [
			{
				title: "Block Height",
				dataIndex: "blockHeight",
				key: "blockHeight",
				width: "10%",
				showType: "link",
				tpl: "/block/{blockHeight}"
			},
			{
				title: "Hash",
				dataIndex: "hash",
				key: "hash",
				width: "35%",
				textWrap: "word-break",
				ellipsis: true,
				showType: "copy"
			},
			{
				title: "Prent Hash",
				dataIndex: "parentHash",
				key: "parentHash",
				width: "35%",
				textWrap: "word-break",
				ellipsis: true,
				showType: "copy"
			},
			{
				title: "Time",
				dataIndex: "timestamp",
				key: "timestamp",
				width: "20%",
				showType: "datetime"
			}
		];
		formatArr(columnsArr);
		setColumns(columnsArr);
	}, []);
	useEffect(async () => {
		const columnsArr = [
			{
				title: "Hash",
				dataIndex: "hash",
				width: "15%",
				showType: "copy"
			},
			{
				title: "Method",
				dataIndex: "method",
				width: "15%",
				render: (text, record, index) => {
					return record.section + "." + text;
				}
			},
			{
				title: "Status",
				dataIndex: "status",
				width: "8%",
				render: (text, record, index) => {
					return text === "success" ? (
						<span className="green">
							<CheckCircleOutlined /> {text}
						</span>
					) : (
						<span className="red">
							<ExclamationCircleOutlined /> {text}
						</span>
					);
				}
			},
			{
				title: "Signer",
				dataIndex: "signer",
				width: "15%",
				textWrap: "word-break",
				ellipsis: true,
				showType: "copy"
			},
			{
				title: "DestAccount",
				dataIndex: "destAccount",
				width: "15%",
				textWrap: "word-break",
				ellipsis: true,
				showType: "copy"
			},
			{
				title: "Amount($DOT)",
				dataIndex: "amount",
				width: "5%",
				showType: "currency-qianfen"
			},
			{
				title: "Signature",
				dataIndex: "signature",
				width: "15%",
				textWrap: "word-break",
				ellipsis: true,
				showType: "copy"
			},
			{
				title: "Time",
				dataIndex: "timestamp",
				width: "10%",
				showType: "datetime"
			},
			{
				title: "Events",
				dataIndex: "events",
				render: (text, record, index) => {
					if (record.events.length == 0) {
						return "";
					}
					return (
						<Collapse accordion bordered={false} ghost>
							{record.events.map((ev, i) => {
								return (
									<Panel header={ev.section + "." + ev.method} key={i}>
										<pre>{JSON.stringify(JSON.parse(ev.data), null, 2)}</pre>
									</Panel>
								);
							})}
						</Collapse>
					);
				}
			}
		];
		formatArr(columnsArr);
		setTransactionColumns(columnsArr);
	}, []);
	return (
		<div className={className}>
			<BreadcrumbBar currPageName="Block detail" />
			<Spin spinning={loading}>
				<Card title="Block Overview">
					<div className="table-content">
						<div className="block-list-box block">
							{columns.map((t, index) => {
								return (
									<div className="block" key={index}>
										<span className="left-name">{t.title}：</span>
										<span className="right-value">{t.render ? t.render(blockDetail[t.key], blockDetail, index) : blockDetail[t.key]}</span>
									</div>
								);
							})}
						</div>
					</div>
				</Card>
			</Spin>
			<Spin spinning={loading}>
				<Card title={"Extrinsics(" + transactions.length + ")"} style={{ marginTop: 10 }}>
					{transactions.length == 0 ? (
						<Empty />
					) : (
						<div className="block-list-box block">
							{transactions.map((trx, i) => {
								return (
									<div className="one-transaction block" key={trx.key || trx.dataIndex || i}>
										<Card title={"Transfer Info"} className="trx-info">
											{transactionColumns
												.filter(w => w.title != "Events")
												.map((t, index) => {
													const value = t.render ? t.render(trx[t.key], trx, index) : trx[t.key];
													if (value === "") {
														return "";
													}
													return (
														<div className="block" key={index}>
															<span className="left-name">{t.title}：</span>
															<span className="right-value">{value}</span>
														</div>
													);
												})}
										</Card>
										{transactionColumns
											.filter(w => w.title == "Events")
											.map((t, index) => {
												const value = t.render ? t.render(trx[t.key], trx, index) : trx[t.key];
												if (value === "") {
													return "";
												}
												return (
													<Card key={index} title="Events" bodyStyle={{ padding: 6, margin: 0 }} className="trx-events">
														{value}
													</Card>
												);
											})}
									</div>
								);
							})}
						</div>
					)}
				</Card>
			</Spin>
		</div>
	);
}

export default styled(Main)`
	display: block;
	overflow: hidden;
	.table-content {
		background-color: #fff;
		.ant-descriptions-header {
			margin-bottom: 0 !important;
			padding: 10px;
		}
	}
	pre {
		background-color: #999;
		color: #fff;
		padding: 20px;
	}
	.block-list-box {
		position: relative;
		padding: 4px 10px;
		display: block;
		width: 100%;
		line-height: 27px;
		.block {
			clear: both;
			line-height: 32px;
		}
		.one-transaction {
			border-bottom: 1px solid #eee;
			padding: 20px 0;
			.trx-info,
			.trx-events {
				display: block;
				overflow: hidden;
				margin-bottom: 5px;
			}
			@media screen and (min-width: 901px) {
				.trx-info {
					display: block;
					overflow: hidden;
					float: left;
					width: 40%;
					margin-bottom: 0px;
				}
				.trx-events {
					display: block;
					overflow: hidden;
					float: right;
					width: 59%;
					margin-bottom: 0px;
				}
			}
		}
		.left-name {
			color: #aaa;
			float: left;
			width: 35%;
			text-align: right;
			padding-right: 10px;
			max-width: 200px;
		}
		.right-value {
			label {
				color: green;
				padding-left: 10px;
			}
		}
	}
`;
