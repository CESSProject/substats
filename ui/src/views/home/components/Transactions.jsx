/*
 * @Description:
 * @Autor: fage
 * @Date: 2022-07-07 14:36:09
 * @LastEditors: lanmeng656 lanmeng656@google.com
 * @LastEditTime: 2023-02-13 17:45:17
 */
import React, { useRef, useState, useEffect } from "react";
import { DatePicker, Input, Menu, Modal, Button, Dropdown, Tooltip, Descriptions, Empty, Select, Space, Table, message, Tabs, Popconfirm, Checkbox, Card, Form } from "antd";
import { UserOutlined, DownOutlined, DeleteOutlined, AppstoreAddOutlined, SwapOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
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
import BlockList from "@/components/mobile/BlockList";
import TransactionList from "./TransactionList";

import styled from "styled-components";
import { isMobile } from "@utils";

let ignore = false;

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

const Transactions = ({ className }) => {
	const [list, setList] = useState();

	useEffect(() => {
		(async function anyNameFunction() {
			ignore = false;
			let tmp = await ajax("block_transaction");
			if(ignore) return;
			setList(tmp);
		})();
		return () => {
			ignore = true;
		};
	}, []);

	return (
		<div className={className}>
			<Card
				bodyStyle={{ padding: 0, margin: 0 }}
                headStyle={{borderBottom:"none"}}
				className="chart-left myRadius"
				title={
					<span>
						Transactions
					</span>
				}
				extra={
					<NavLink className="btn-more" to="/transfer/">
						View all
					</NavLink>
				}>
				<div className="tx-list-box">{!list ? <Empty /> :<TransactionList list={list} />}</div>
			</Card>
		</div>
	);
};

export default React.memo(styled(Transactions)`
	display: block;
	overflow: hidden;
	.tx-list-box {
		display: block;
		overflow: hidden;
		width: 100%;
		/* height: 527px; */
	}
`);
