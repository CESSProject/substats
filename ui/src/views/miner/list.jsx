/*
 * @Description:
 * @Autor: fage
 * @Date: 2022-07-07 14:36:09
 * @LastEditors: chenbinfa
 * @LastEditTime: 2022-08-16 20:02:06
 */
import React, { useRef, useState, useEffect } from "react";
import { DatePicker, Input, Menu, Modal, Button, Dropdown, Descriptions, Select, Space, Table, message, Tabs, Popconfirm, Checkbox, Card, Form } from "antd";
import { UserOutlined, DownOutlined, DeleteOutlined } from "@ant-design/icons";
import _ from "lodash";
import { useNavigate, NavLink } from "react-router-dom";
import subData from "@services/subdata";
import constantsAJAX from "@services/chain-state/constants";
import storageAJAX from "@services/storage";
import miner from "@services/miner";
import { formatterCurrency, formatterCurrencyStr, formatterSize, formatterSizeFromMB } from "@utils/format";
import { ThTable } from "@/components/ThTable";
import MList from "@/components/mobile/MList";

const { Option } = Select;
const { Column, ColumnGroup } = Table;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
let lastBlockTime = 0;
import { isMobile } from "@utils";
const isM = isMobile();
const minerColumns = miner.getColumns(isM ? "list" : "table");

const Home = ({ ...props }) => {
	document.title = "Miners-CESS Substats";
	const navigate = useNavigate();
	const [miners, setMiners] = useState([]);

	const propsTable = {
		border: true,
		size: "middle",
		pagesize: 10,
		loadList: {
			params: {
				tableName: "miner_summary",
				sorter: [
					{
						column: "power",
						order: "desc"
					}
				]
			},
			method: miner.loadMiners
		},
		titleBar: {
			title: "Miners"
		},
		table: {
			columns: minerColumns
		}
	};

	return (
		<div className="containner-in">
			<div className="miner-list">
				{isM ? (
					<Card
						title={
							<span>
								<img width={19} src={process.env.PUBLIC_URL + "/img/2.png"} /> Top Miners
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
