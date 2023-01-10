/*
 * @Description:
 * @Autor: fage
 * @Date: 2022-07-07 14:36:09
 * @LastEditors: lanmeng656 lanmeng656@google.com
 * @LastEditTime: 2023-01-10 11:40:31
 */
import React, { useRef, useState, useEffect, useMemo } from "react";
import { DatePicker, Input, Menu, Modal, Button, Dropdown, Descriptions, Select, Space, Table, message, Tabs, Popconfirm, Checkbox, Card, Form } from "antd";
import _ from "lodash";
import "./index.less";
import storageAJAX from "@services/storage";
import miner from "@services/miner";
import { ThTable } from "@/components/ThTable";
import StorageChart from "./components/StorageChart";
import NetworkOverview from "./components/NetworkOverview";
import Blocks from "./components/Blocks";
import { isMobile } from "@utils";
const isM = isMobile();

let ignore = false;
let timeout = null;

const minerColumns = miner.getColumns(isM ? "list" : "table");

const Home = ({ ...props }) => {
	document.title = "Home-CESS Substats";
	const [miners, setMiners] = useState([]);
	const [propsTable, setPropsTable] = useState();
	const [space, setSpace] = useState({
		used: 0,
		idle: 0,
		total: 0
	});
	useEffect(() => {
		const c = _.cloneDeep(minerColumns);
		c[2].sorter = false;
		c[3].sorter = false;
		if (c[4]) {
			c[4].sorter = false;
		}
		const props = {
			border: true,
			size: "middle",
			pagesize: 10,
			hidePager: true,
			loadList: {
				method: async () => {
					if (ignore) return;
					let result = await miner.loadMiners({
						tableName: "miner_summary",
						pageindex: 1,
						pagesize: 20,
						sorter: [
							{
								column: "power",
								order: "desc"
							}
						]
					});
					if (ignore) return;
					if (result.msg == "ok") {
						setMiners(result.data);
					}
					return {
						msg: "ok",
						data: result.data.slice(0, 20)
					};
				}
			},
			table: {
				columns: c
			}
		};
		setPropsTable(props);
	}, []);

	useEffect(() => {
		ignore = false;
		async function run() {
			if (ignore) return;
			let result = await storageAJAX({ ac1: "sminer", ac2: "totalServiceSpace" });
			if (result.msg != "ok") {
				return;
			}
			const used = result.data;
			if (ignore) return;
			result = await storageAJAX({ ac1: "sminer", ac2: "totalIdleSpace" });
			if (result.msg != "ok") {
				return;
			}
			const idle = result.data;
			if (ignore) return;
			setSpace({
				used,
				idle,
				total: used + idle
			});
		}
		timeout = setInterval(run, 10000);
		run();
		return () => {
			ignore = true;
			clearInterval(timeout);
		};
	}, []);
	return (
		<div className="containner-in">
			<div className="top-price-box"></div>
			<div className="chart-box block">
				<Card
					title={
						<span>
							<img width={19} src={process.env.PUBLIC_URL + "/img/icon_cess.png"} /> CESS Storage
						</span>
					}
					className="chart-left myRadius">
					<StorageChart space={space} />
				</Card>
				<Card
					className="chart-right myRadius"
					title={
						<span>
							<img width={19} src={process.env.PUBLIC_URL + "/img/icon_cp.png"} /> Network Overview
						</span>
					}>
					<NetworkOverview space={space} />
				</Card>
			</div>
			<div className="list-box block">
				<Blocks />
			</div>			
		</div>
	);
};

function isEqual(prevProps, nextProps) {
	return _.isEqual(prevProps.data, nextProps.data);
}

export default React.memo(Home, isEqual);
