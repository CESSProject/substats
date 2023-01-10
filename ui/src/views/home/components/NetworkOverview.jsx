/*
 * @Description:
 * @Autor: fage
 * @Date: 2022-07-26 14:52:51
 * @LastEditors: chenbinfa
 * @LastEditTime: 2022-08-16 20:01:20
 * @description: about
 * @author: chenbinfa
 */
import React, { useState, useEffect } from "react";
import { Button, Col, Spin, DatePicker, Input, Row, Select, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { formatterCurrency, formatterCurrencyStr, formatterCurrencyStr2, formatterSize, formatterSizeFromMB } from "@utils/format";
import subData from "@services/subdata";
import constantsAJAX from "@services/chain-state/constants";
import _ from "lodash";
import moment from "moment";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Pie, Line } from "@ant-design/plots";
import storageAJAX from "@services/storage";
import queryDB from "@services/queryDB";
import "@ant-design/flowchart/dist/index.css";
let lastBlockTime = 0;
let ignore = false;

const SearchBar = ({ className, space }) => {
	const [loading, setLoading] = useState(false);
	const [bgColor, setBgColor] = useState(false);
	const [chartConfig, setChartConfig] = useState();
	const [blockHeight, setBlockHeight] = useState("Connecting...");
	const [totalPower, setTotalPower] = useState(0);
	const [totalIssuance, setTotalIssuance] = useState(0);
	const [avgBlockTime, setAvgBlockTime] = useState("--");
	const [list, setList] = useState([]);
	const [minerCount, setMinerCount] = useState(0);

	// sub blockHeight
	useEffect(() => {
		ignore = false;
		let e = {
			id: "home-blockInfo",
			name: "blockInfo",
			e: data => {
				if (ignore) return;
				setBlockHeight(data.blockHeight);
				setBgColor("red");
				setTimeout(() => {
					if (ignore) return;
					setBgColor("#000");
				}, 500);
				lastBlockTime = new Date().valueOf();
			}
		};
		subData.addEvent(e);
		return () => {
			ignore = true;
			subData.removeEvent(e.id);
		};
	}, []);

	// expectedBlockTime
	useEffect(async () => {
		let result = await constantsAJAX("rrsc", "expectedBlockTime"); // ac1=babe/rrsc
		if (result.msg != "ok") {
			result = await constantsAJAX("babe", "expectedBlockTime"); // ac1=babe/rrsc
			if (result.msg != "ok") {
				return setAvgBlockTime(result.msg);
			}
		}
		// console.log("result", result);
		let t = result.data;
		t = parseInt(t.replace(",", "")) / 1000;
		setAvgBlockTime(t);
	}, []);

	// balances.totalIssuance
	useEffect(async () => {
		setLoading(true);
		let result = await storageAJAX({ ac1: "balances", ac2: "totalIssuance" });
		if (result.msg != "ok") {
			setLoading(false);
			return;
		}
		let balances = parseInt(result.data, 16);
		balances = formatterCurrencyStr2(balances);
		setTotalIssuance(balances);
	}, []);

	// setTotalPower
	useEffect(() => {
		setTotalPower(formatterSizeFromMB(space.total));
	}, [space]);

	// storage_power_trend
	useEffect(async () => {
		setLoading(true);
		const params = {
			tableName: "storage_power_trend",
			pageindex: 1,
			pagesize: 100
		};
		let result = await queryDB.list(params);
		if (result.msg != "ok") {
			setLoading(false);
			return;
		}
		const list = result.data.sort((t1, t2) => t1.id - t2.id);
		list.forEach(t => (t["Storage Power(GiB)"] = parseFloat((t.power / 1073741824).toFixed(2))));
		const config = {
			height: 165,
			data: list,
			padding: "auto",
			xField: "dateStr",
			yField: "Storage Power(GiB)",
			// smooth: true,
			xAxis: {
				// type: 'timeCat',
				tickCount: 5
			},
			point: {
				size: 3,
				shape: "circular",
				style: {
					fill: "white",
					stroke: "#5B8FF9",
					lineWidth: 1
				}
			},
			tooltip: {
				showMarkers: false
			},
			state: {
				active: {
					style: {
						shadowBlur: 4,
						stroke: "#000",
						fill: "red"
					}
				}
			},
			interactions: [
				{
					type: "marker-active"
				}
			]
		};
		setChartConfig(config);
		setLoading(false);
	}, []);

	// get minerCount
	useEffect(async () => {
		setLoading(true);
		const params = {
			tableName: "miner",
			pageindex: 1,
			pagesize: 1
		};
		let result = await queryDB.list(params);
		if (result.msg != "ok") {
			setLoading(false);
			return;
		}
		setMinerCount(result.total);
		setLoading(false);
	}, []);

	return (
		<div className={className}>
			<div className="left-state-box">
				<div className="state-line">
					<div className="state-box">
						<span>Latest Block</span>
						<span className="trs" style={{ color: bgColor }}>
							#{blockHeight} ({avgBlockTime}s)
						</span>
					</div>
					<div className="state-box">
						<span>Storage Power</span>
						<span>{totalPower}</span>
					</div>
					<div className="state-box" style={{ marginBottom: 0 }}>
						<span>Total Issuance($TCESS)</span>
						<span>{totalIssuance}</span>
					</div>
					<div className="state-box" style={{ marginBottom: 0 }}>
						<span>Storage Miners</span>
						<span>{minerCount} Nodes</span>
					</div>
				</div>
			</div>
			<div className="right-line-box">
				<div className="right-line-box-title">Storage Power Trends</div>
				<div className="space-hold block"></div>
				<Spin spinning={loading}>{chartConfig ? <Line {...chartConfig} /> : ""}</Spin>
			</div>
		</div>
	);
};

export default React.memo(styled(SearchBar)`
	padding: 0px;
	background-color: #fff;
	.left-state-box {
		width: 54%;
		float: left;
		display: block;
		overflow: hidden;
		.state-line {
			display: block;
			overflow: hidden;
			.state-box {
				float: left;
				width: 46%;
				background-color: rgb(247 249 252);
				margin-bottom: 24px;
				margin-right: 4%;
				padding: 19px 4%;
				border-radius: 4px;
				border: 1px solid #fff;
				transition: color 2s;
				-moz-transition: color 2s; /* Firefox 4 */
				-webkit-transition: color 2s; /* Safari 和 Chrome */
				-o-transition: color 2s; /* Opera */
				.trs {
					color: #000;
					transition: color 1s;
					-moz-transition: color 1s; /* Firefox 4 */
					-webkit-transition: color 1s; /* Safari 和 Chrome */
					-o-transition: color 1s; /* Opera */
				}
				span {
					display: block;
					clear: both;
					overflow: hidden;
					font-size: 15px;
					line-height: 30px;
					height: 30px;
				}
			}
			.state-box:hover {
				background-color: #e2f6ff;
			}
		}
	}
	.right-line-box {
		float: right;
		width: 45%;
		background-color: rgb(247 249 252);
		border-radius: 5px;
		padding: 9px 2%;
		position: relative;
		padding-top: 37px;
		.right-line-box-title {
			position: absolute;
			top: 12px;
			left: 11px;
			overflow: hidden;
			font-size: 15px;
		}
		.space-hold {
			width: 100%;
			height: 12px;
		}
	}
	@media screen and (max-width: 900px) {
		.left-state-box {
			width: 100%;
			clear: both;
			display: block;
			overflow: hidden;
			.state-line {
				display: block;
				overflow: hidden;
				.state-box:nth-child(odd) {
					margin-left: 0;
					margin-right: 2%;
				}
				.state-box:nth-child(even) {
					margin-left: 2%;
					margin-right: 0;
				}
				.state-box {
					width: 48%;
					margin-bottom: 4px;
					padding: 8px 2%;
					span {
						display: block;
						clear: both;
						overflow: hidden;
						font-size: 15px;
						line-height: 30px;
						height: 30px;
					}
				}
			}
		}
		.right-line-box {
			clear: both;
			width: 100%;
			margin-top: 10px;
		}
	}
`);
