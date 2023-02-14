/*
 * @Description:
 * @Autor: fage
 * @Date: 2022-07-07 14:36:09
 * @LastEditors: lanmeng656 lanmeng656@google.com
 * @LastEditTime: 2023-02-02 17:42:06
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
	Empty
} from "antd";
import { UserOutlined, DownOutlined, DeleteOutlined, SwapRightOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import constantsAJAX from "@services/chain-state/constants";
import storageAJAX from "@services/storage";
import queryDB from "@services/queryDB";
import moment from "moment";
import { formatterCurrency, formatterCurrencyStr, formatterSize, formatterSizeFromMB } from "@utils/format";
import copy from "copy-to-clipboard";
import { NavLink, Outlet, useParams } from "react-router-dom";
import { ThTable } from "@/components/ThTable";
import { isMobile } from "@utils";
import MList from "@/components/mobile/MList";
const isM = isMobile();

const { Option } = Select;
const { Column, ColumnGroup } = Table;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const columns = [
	{
		title: "Block",
		dataIndex: "blockHeight",
		key: "blockHeight",
		width: "4%",
		showType: "link",
		tpl: "/transfer/{hash}",
		sorter: true
	},
	{
		title: "Hash",
		dataIndex: "hash",
		key: "hash",
		width: "14%",
		textWrap: "word-break",
		ellipsis: true,
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
		width: "5%",
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
		},
		sorter: true
	},
	// {
	// 	title: "DestAccount",
	// 	dataIndex: "destAccount",
	// 	width: "10%",
	// 	textWrap: "word-break",
	// 	ellipsis: true,
	// 	showType: "copy"
	// },
	{
		title: "Amount($DOT)",
		dataIndex: "amount",
		width: "5%",
		sorter: true,
		showType: "currency-qianfen"
	},
	{
		title: "Time",
		dataIndex: "timestamp",
		width: "10%",
		showType: "datetime",
		tpl: "YYYY-MM-DD HH:mm:ss",
		sorter: true
	}
];
if (isM) {
	columns[4].title = "Amount";
	columns[4].tpl = "{amount} ($DOT)";
}

const Main = ({ ...propsS }) => {
	document.title = "Transfers-CESS Substats";
	let params = useParams();

	const props = {
		border: true,
		size: "middle",
		pagesize: 10,
		loadList: {
			params: {
				tableName: "block_transaction",
				sorter: [
					{
						column: "blockHeight",
						order: "desc"
					},
					{
						column: "id",
						order: "desc"
					}
				]
			},
			method: queryDB.list
		},
		titleBar: {
			title: "Transactions"
		},
		table: {
			columns
		}
	};

	return (
		<div className="containner-in">
			<div className="list">
				{isM ? (
					<Card
						title={
							<span>
								<img width={19} src={process.env.PUBLIC_URL + "/img/icon_jh.png"} /> Transactions
							</span>
						}
						className="myRadius">
						<MList props={props} />
					</Card>
				) : (
					<ThTable props={props} />
				)}
			</div>
		</div>
	);
};

function isEqual(prevProps, nextProps) {
	return _.isEqual(prevProps.data, nextProps.data);
}

export default React.memo(Main, isEqual);
