/*
 * @Description:
 * @Autor: fage
 * @Date: 2022-07-26 14:52:51
 * @LastEditors: chenbinfa
 * @LastEditTime: 2022-08-15 17:59:50
 * @description: about
 * @author: chenbinfa
 */
import React, { useState, useEffect } from "react";
import { Breadcrumb, Col, DatePicker, Input, Row, Select, message, List, Divider, Typography, Avatar } from "antd";
import { ClockCircleOutlined, UserOutlined } from "@ant-design/icons";
import _ from "lodash";
import moment from "moment";
import styled from "styled-components";
import { useNavigate, NavLink, Route, Routes, useLocation } from "react-router-dom";
import { formatDataSource } from "@/utils";
import MList from "./MList";
let i = 1;

const CBlockList = ({ className, props }) => {
	// props.table.renderItem = item => {
	// 	return (
	// 		<List.Item>
	// 			<div className="block-list-box block">
	// 				<div className="block">
	// 					<span className="left-name">Rank：</span>
	// 					<span className="right-value">
	// 						{i++} <label>&nbsp;&nbsp;({item.power}GiB)</label>
	// 					</span>
	// 				</div>
	// 				<div className="block">
	// 					<span className="left-name">Ratio：</span>
	// 					<span className="right-value">{item.per}</span>
	// 				</div>
	// 				<div className="block">
	// 					<span className="left-name">Acc：</span>
	// 					<span className="right-value">{item.key}</span>
	// 				</div>
	// 			</div>
	// 		</List.Item>
	// 	);
	// };
	return (
		<div className={className}>
			<MList props={props} />
		</div>
	);
};

export default React.memo(CBlockList);
