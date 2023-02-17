/*
 * @Description:
 * @Autor: fage
 * @Date: 2022-07-07 14:36:09
 * @LastEditors: lanmeng656 lanmeng656@google.com
 * @LastEditTime: 2023-02-15 17:34:38
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
import copy from "copy-to-clipboard";
import { NavLink, Outlet, useParams } from "react-router-dom";
import { ThTable } from "@/components/ThTable";
import BlockList from "./BlockList";

import styled from "styled-components";
import { isMobile } from "@utils";
let ignore = false;

const ajax = async tableName => {
	let par = {
		tableName,
		pagesize: 10,
		pageindex: 1
	};
	let tmp = await queryDB.list(par);
	if (tmp.msg != "ok") {
		message.error(tmp.msg);
		return null;
	}
	tmp.data.forEach(t => (t.key = t.id));
	return tmp.data;
};

const Main = ({ className, miners }) => {
	const [list, setList] = useState();

	useEffect(() => {
		(async function anyNameFunction() {
			ignore = false;
			let tmp = await ajax("block_info");
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
				className="chart-left myRadius"
				headStyle={{borderBottom:"none"}}
				title={
					<span>
						 Latest Blocks
					</span>
				}
				extra={
					<NavLink className="btn-more" to="/block/">
						View all
					</NavLink>
				}>
				<div className="tx-list-box">{!list ? <Empty /> : <BlockList list={list} /> }</div>
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
