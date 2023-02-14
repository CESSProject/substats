/*
 * @Description:
 * @Autor: fage
 * @Date: 2022-07-07 14:36:09
 * @LastEditors: lanmeng656 lanmeng656@google.com
 * @LastEditTime: 2023-02-09 14:06:41
 */
import React, { useRef, useState, useEffect } from "react";
import { DatePicker, Input, Menu, Modal, Button, Dropdown, Descriptions, Select, Space, Table, message, Tabs, Popconfirm, Checkbox, Card, Form } from "antd";
import { UserOutlined, DownOutlined, DeleteOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import constantsAJAX from "@services/chain-state/constants";
import storageAJAX from "@services/storage";
import queryDB from "@services/queryDB";
import { formatterCurrency, formatterCurrencyStr2, formatterCurrencyStr, formatterSize, formatterSizeFromMB } from "@utils/format";
import { ThTable } from "@/components/ThTable";
import { isMobile } from "@utils";
import MList from "@/components/mobile/MList";
const isM = isMobile();

const { Option } = Select;
const { Column, ColumnGroup } = Table;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
let lastBlockTime = 0;
const columns = [
	{
		title: "AccountId",
		dataIndex: "accountId",
		width: "45%",
		showType: "accountIcon",
		textWrap: "word-break",
		ellipsis: true,
		tpl: "{accountId}",
		sorter: true
	},
	{
		title: "Balances($DOT)",
		dataIndex: "amount",
		width: "20%",
		showType: "currency-qianfen",
		sorter: true
	},
	{
		title: "Transfers",
		dataIndex: "txCount",
		width: "20%",
		sorter: true
	}
];
if (isM) {
	columns[1].title = "Balances";
	columns[1].tpl = "{amount} ($DOT)";
}

const Home = ({ ...props }) => {
	document.title = "Account-CESS Substats";
	const navigate = useNavigate();
	const [miners, setMiners] = useState([]);

	const loadMiners = async () => {
		let result = await storageAJAX({ ac1: "fileBank", ac2: "purchasedPackage" });
		console.log("result", result);
		if (result.msg != "ok") {
			return;
		}
		return result;
	};

	const propsTable = {
		border: true,
		size: "middle",
		pagesize: 20,
		loadList: {
			params: {
				tableName: "block_account",
				sorter: [
					{
						column: "amount",
						order: "desc"
					}
				]
			},
			method: queryDB.list
		},
		titleBar: {
			title: "Accounts"
		},
		table: {
			columns
		}
	};

	return (
		<div className="containner-in">
			<div className="miner-list">
				{isM ? (
					<Card
						title={
							<span>
								<UserOutlined /> Accounts
							</span>
						}
						className="myRadius">
						<MList props={propsTable} />
					</Card>
				) : (
					<ThTable props={propsTable} />
				)}
			</div>
		</div>
	);
};

function isEqual(prevProps, nextProps) {
	return _.isEqual(prevProps.data, nextProps.data);
}

export default React.memo(Home, isEqual);
