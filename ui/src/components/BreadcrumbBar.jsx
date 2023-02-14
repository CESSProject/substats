/*
 * @Description:
 * @Autor: fage
 * @Date: 2022-07-26 14:52:51
 * @LastEditors: chenbinfa
 * @LastEditTime: 2022-08-08 19:30:36
 * @description: about
 * @author: chenbinfa
 */
import React, { useState, useEffect } from "react";
import { Breadcrumb, Col, DatePicker, Input, Row, Select, message } from "antd";
import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import _ from "lodash";
import moment from "moment";
import styled from "styled-components";
import { useNavigate, NavLink, Route, Routes, useLocation } from "react-router-dom";

const breadcrumbNameMap = {
	"/block/": {
		name: "Blocks",
		icon: "icon_lian.png"
	},
	"/transfer/": {
		name: "Transfers",
		icon: "icon_jh.png"
	},
	"/miner/": {
		name: "Miners",
		icon: "2.png"
	},
	"/account/": {
		name: "Accounts",
		icon: "icon_cess.png"
	}
};

const BreadcrumbBar = ({ className, currPageName }) => {
	if (!currPageName) {
		currPageName = "Detail";
	}
	const location = useLocation();
	const pathSnippets = location.pathname.split("/").filter(i => i);
	// console.log("pathSnippets", pathSnippets);
	const extraBreadcrumbItems = pathSnippets.map((_, index) => {
		const url = `/${pathSnippets.slice(0, index + 1).join("/")}/`;
		return (
			<Breadcrumb.Item key={url}>
				{breadcrumbNameMap[url] ? (
					<NavLink to={url}>
						<img width={18} src={process.env.PUBLIC_URL + "/img/" + breadcrumbNameMap[url].icon} /> &nbsp;
						{breadcrumbNameMap[url].name}
					</NavLink>
				) : (
					<span>{currPageName}</span>
				)}
			</Breadcrumb.Item>
		);
	});
	const breadcrumbItems = [
		<Breadcrumb.Item key="home">
			<NavLink to="/">
				<img width={18} src={process.env.PUBLIC_URL + "/img/icon_gzt1.png"} /> Home
			</NavLink>
		</Breadcrumb.Item>
	].concat(extraBreadcrumbItems);
	return (
		<div className={className}>
			<Breadcrumb>{breadcrumbItems}</Breadcrumb>
		</div>
	);
};

export default React.memo(styled(BreadcrumbBar)`
	display: block;
	overflow: hidden;
	.ant-breadcrumb ol {
		margin-left: -31px !important;
	}
`);
