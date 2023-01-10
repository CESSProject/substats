/*
 * @Description:
 * @Autor: fage
 * @Date: 2022-07-26 14:52:51
 * @LastEditors: lanmeng656 lanmeng656@google.com
 * @LastEditTime: 2023-01-10 11:41:35
 * @description: about
 * @author: chenbinfa
 */
import React, { useState, useEffect } from "react";
import { Button, Col, DatePicker, Table, Input, Row, Select, message, Modal } from "antd";
import { SearchOutlined, RedoOutlined, LoadingOutlined } from "@ant-design/icons";
import storageAJAX from "@services/storage";
import _ from "lodash";
import moment from "moment";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const { Option } = Select;
const { Search } = Input;
let ignore = false;

const SearchBar = ({ className }) => {
	const [keyword, setKeyword] = useState();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [searchType, setSearchType] = useState("All");
	const [loading, setLoading] = useState(false);
	const [space, setSpace] = useState({
		used: 0,
		idle: 0,
		total: 0,
		totalGiB: 0
	});
	const navigate = useNavigate();

	async function getStore() {
		if (ignore || loading) return;
		setLoading(true);
		let result = await storageAJAX({ ac1: "sminer", ac2: "totalServiceSpace" });
		if (result.msg != "ok") {
			setLoading(false);
			return;
		}
		const used = result.data;
		if (ignore) {
			setLoading(false);
			return;
		}
		result = await storageAJAX({ ac1: "sminer", ac2: "totalIdleSpace" });
		setLoading(false);
		if (result.msg != "ok") {
			return;
		}
		const idle = result.data;
		if (ignore) return;
		const total = used + idle;
		const totalGiB = total / 1073741824;
		console.log("totalGiB", totalGiB);
		setSpace({
			used,
			idle,
			total,
			totalGiB
		});
	}

	useEffect(() => {
		ignore = false;
		getStore();
		return () => {
			ignore = true;
		};
	}, []);

	useEffect(() => {
		let pathArr = window.location.pathname.split("/");
		if (pathArr.length == 3) {
			let type = pathArr[1];
			let v = pathArr[2];
			if (type == "block") {
				type = "Block";
			} else if (type == "transfer") {
				type = "Transfer";
			} else if (type == "account") {
				type = "Account";
			} else {
				type = "All";
			}
			setSearchType(type);
			setKeyword(v);
		}
	}, []);

	const onSearch = e => {
		if (e.code && e.code == "Enter" && e.target.value) {
			setKeyword(e.target.value);
		}
		let type = getSearchType();
		setSearchType(type);
		let url = "/" + type.toLowerCase() + "/" + keyword;
		navigate(url);
	};
	const getSearchType = () => {
		let type = "Transfer";
		if (keyword.indexOf("cX") == 0) {
			type = "Account";
		} else if (keyword.length < 15 && !isNaN(keyword)) {
			type = "Block";
		}
		return type;
	};
	const onChangeType = value => {
		setSearchType(value);
	};
	const onChangeKeyword = e => {
		setKeyword(e.target.value);
	};

	const getPrice = (store, type) => {
		let v = 1000 + (store * 10000) / space.totalGiB;
		if (type == 2) {
			v = v / store;
		}
		return v.toFixed(2) + "  TCESS";
	};

	const columns = [
		{
			title: "Tier",
			dataIndex: "key",
			render: t => <span className="gray">{t}</span>
		},
		{
			title: "Storage Scale",
			dataIndex: "storage"
		},
		{
			title: "Days",
			dataIndex: "days"
		},
		{
			title: "Frozen Days",
			dataIndex: "frozen"
		},
		{
			title: "Fee",
			dataIndex: "fee",
			render: (txt, record) => (
				<div>{txt == "Free" ? <span className="green">Free</span> : txt == "/" ? <span className="gray">/</span> : <span>{getPrice(txt, 1)}</span>}</div>
			)
		},
		{
			title: "Estimated 1 GiB Pricing",
			dataIndex: "estimated",
			render: (txt, record) => (
				<div>{txt == "Free" ? <span className="green">Free</span> : txt == "/" ? <span className="gray">/</span> : <span>{getPrice(txt, 2)}</span>}</div>
			)
		}
	];

	const dataSource = [
		{
			key: "1",
			storage: "Less than 10 GiB",
			days: 30,
			frozen: 0,
			fee: "Free",
			estimated: "Free"
		},
		{
			key: "2",
			storage: "500 GiB",
			days: 30,
			frozen: 7,
			fee: 500,
			estimated: 500
		},
		{
			key: "3",
			storage: "1 TiB",
			days: 30,
			frozen: 14,
			fee: 1024,
			estimated: 1024
		},
		{
			key: "4",
			storage: "5 TiB",
			days: 30,
			frozen: 20,
			fee: 5120,
			estimated: 5120
		},
		{
			key: "5",
			storage: "Over 5 TiB",
			days: 30,
			frozen: 30,
			fee: "/",
			estimated: "/"
		}
	];

	return (
		<div className={className}>
			<div className="big-title block">
				<div className="big-title-txt block">Substats Blockchain Explorer</div>
				<div className="big-title-txt-2 block">Find the block that eats the world.</div>
			</div>
			<Search
				className="search-box"
				placeholder="Block Height/Transaction Hash/Account"
				onSearch={onSearch}
				onPressEnter={onSearch}
				allowClear
				value={keyword}
				bordered={false}
				onChange={onChangeKeyword}
				style={{
					borderRadius: "10px",
					border: "1px solid #ddd",
					backgroundColor: "#fff",
					overflow: "hidden"
				}}
				id="searchInput"
				size="large"
			/>
		</div>
	);
};

export default React.memo(styled(SearchBar)`
	margin-bottom: 20px;
	.top-price-btn {
		position: absolute;
		top: 0px;
		right: 0px;
		display: flex;
		width: 420px;
		padding: 5px 30px;
		border-radius: 6px;
		background-color: #fff;
		box-shadow: 1px 1px 20px 0px #e9e9e9;
		.top-price-btn-left {
			width: 70%;
			span {
				font-size: 13px;
			}
			label {
				font-size: 12px;
				color: #aaa;
			}
		}
		.top-price-btn-right {
			width: 30%;
			span {
				width: 100%;
				border-radius: 4px;
				background-color: #3187fa;
				color: #fff;
				margin: 5px 0;
				display: block;
				overflow: hidden;
				height: 30px;
				line-height: 30px;
				text-align: center;
				cursor: pointer;
			}
			span:hover {
				background-color: #73abf7;
			}
		}
	}
	@media screen and (max-width: 900px) {
		.top-price-btn {
			position: relative !important;
			width: 100% !important;
			margin: 20px auto 0;
			padding: 5px 10px;
		}
	}
	.search-box {
		max-width: 700px;
	}
	.big-title {
		font-family: "Microsoft YaHei", 微软雅黑;
		.big-title-txt {
			font-size: 20px;
			color: #000;
			font-weight: bold;
		}
		.big-title-txt-2 {
			font-size: 14px;
			color: #aaa;
			margin-bottom: 16px;
		}
	}
	.ant-input-group-addon button {
		border: none !important;
		color: rgb(69 148 255) !important;
	}
`);
