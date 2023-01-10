/*
 * @Description:
 * @Autor: fage
 * @Date: 2022-07-07 14:36:09
 * @LastEditors: chenbinfa
 * @LastEditTime: 2022-09-20 10:24:16
 */
import React, { useRef, useState, useEffect } from "react";
import { DatePicker, Input, Menu, Modal, Button, Dropdown, Tooltip, Descriptions, Empty, Select, Space, Table, message, Tabs, Popconfirm, Checkbox, Card, Form } from "antd";
import { UserOutlined, DownOutlined, DeleteOutlined, AppstoreAddOutlined, SwapOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import subData from "@services/subdata";
import constantsAJAX from "@services/chain-state/constants";
import storageAJAX from "@services/storage";
import queryDB from "@services/queryDB";
import moment from "moment";
import { formatterCurrency, formatterCurrencyStr, formatterSize, formatterSizeFromMB } from "@utils/format";
import copy from "copy-to-clipboard";
import { NavLink, Outlet, useParams } from "react-router-dom";
import { ThTable } from "@/components/ThTable";
import BlockList from "@/components/mobile/BlockList";
import TransactionList from "@/components/mobile/TransactionList";

import styled from "styled-components";
import { isMobile } from "@utils";
var isM = isMobile();

const { Option } = Select;
const { Column, ColumnGroup } = Table;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
let ignore = false;

const columnsBlock = [
	{
		title: "Block",
		dataIndex: "blockHeight",
		width: "15%",
		showType: "link",
		tpl: "/block/{blockHeight}"
	},
	{
		title: "Hash",
		dataIndex: "hash",
		width: "60%",
		textWrap: "word-break",
		ellipsis: true,
		showType: "copy"
	},
	{
		title: "Time",
		dataIndex: "timestamp",
		width: "25%",
		showType: "datetime",
		tpl: "fromNow"
	}
];
const columnsTx = [
	{
		title: "Method",
		dataIndex: "method",
		width: "10%",
		render: (text, record, index) => {
			return <NavLink to={"/transfer/" + record.hash}>{record.section + "." + text}</NavLink>;
		}
	},
	{
		title: "Status",
		dataIndex: "status",
		width: "8%",
		render: (text, record, index) => {
			return !text || text == "success" ? (
				<span className="green">
					<CheckCircleOutlined /> success
				</span>
			) : (
				<span className="red">
					<ExclamationCircleOutlined /> fail
				</span>
			);
		}
	},
	{
		title: "Time",
		dataIndex: "timestamp",
		width: "10%",
		showType: "datetime",
		tpl: "fromNow"
	}
];
const ajax = async tableName => {
	let par = {
		tableName,
		pagesize: 10,
		pageindex: 1
	};
	if (tableName == "block_transaction") {
		par.sorter = [
			{
				column: "blockHeight",
				order: "desc"
			},
			{
				column: "id",
				order: "desc"
			}
		];
	}
	let tmp = await queryDB.list(par);
	if (tmp.msg != "ok") {
		message.error(tmp.msg);
		return null;
	}
	tmp.data.forEach(t => (t.key = t.id));
	return tmp.data;
};

const Main = ({ className, miners }) => {
	const [props, setProps] = useState();
	const [propsTx, setPropsTx] = useState();
	const [time, setTime] = useState();

	useEffect(() => {
		const subId = "home-blockInfo-2";
		(async function anyNameFunction() {
			ignore = false;
			const pBlock = {
				size: "middle",
				hidePager: true,
				pagesize: 10,
				table: {
					dataSource: [],
					columns: columnsBlock
				}
			};
			const pTx = {
				size: "middle",
				hidePager: true,
				pagesize: 10,
				table: {
					columns: columnsTx,
					dataSource: []
				}
			};
			let tmp = await ajax("block_info");
			if (tmp) {
				pBlock.table.dataSource = tmp;
				setProps(pBlock);
			}
			tmp = await ajax("block_transaction");
			if (tmp) {
				pTx.table.dataSource = tmp;
				setPropsTx(pTx);
			}

			let e = {
				id: subId,
				name: "blockInfo",
				e: data => {
					setTime(new Date().valueOf());
				}
			};
			subData.addEvent(e);
		})();
		return () => {
			ignore = true;
			subData.removeEvent(subId);
		};
	}, [time]);

	return (
		<div className={className}>
			<Card
				bodyStyle={{ padding: 0, margin: 0 }}
				className="chart-left myRadius"
				title={
					<span>
						<img width={19} src={process.env.PUBLIC_URL + "/img/icon_lian.png"} /> Latest Blocks
					</span>
				}
				extra={
					<NavLink className="btn-more" to="/block/">
						ALL
					</NavLink>
				}>
				<div className="tx-list-box">{!props ? <Empty /> : isM ? <BlockList props={props} /> : <ThTable props={props} />}</div>
			</Card>
			<Card
				bodyStyle={{ padding: 0, margin: 0 }}
				className="chart-right myRadius"
				title={
					<span>
						<img width={19} src={process.env.PUBLIC_URL + "/img/icon_jh.png"} /> Transactions
					</span>
				}
				extra={
					<NavLink className="btn-more" to="/transfer/">
						ALL
					</NavLink>
				}>
				<div className="tx-list-box">{!propsTx ? <Empty /> : isM ? <TransactionList props={propsTx} /> : <ThTable props={propsTx} />}</div>
			</Card>
		</div>
	);
};

export default React.memo(styled(Main)`
	display: block;
	overflow: hidden;
	.tx-list-box {
		display: block;
		overflow: hidden;
		width: 100%;
		/* height: 527px; */
	}
`);
