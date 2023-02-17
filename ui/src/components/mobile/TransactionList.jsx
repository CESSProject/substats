/*
 * @Description:
 * @Autor: fage
 * @Date: 2022-07-26 14:52:51
 * @LastEditors: chenbinfa
 * @LastEditTime: 2022-08-11 17:38:34
 * @description: about
 * @author: chenbinfa
 */
import React, { useState, useEffect } from "react";
import { Breadcrumb, Col, DatePicker, Input, Row, Select, message, Divider, List, Typography, Avatar } from "antd";
import { ClockCircleOutlined, UserOutlined } from "@ant-design/icons";
import _ from "lodash";
import moment from "moment";
import styled from "styled-components";
import { useNavigate, NavLink, Route, Routes, useLocation } from "react-router-dom";
import { formatDataSource } from "@/utils";
import MList from "./MList";

const CBlockList = ({ className, props }) => {
	if (!props.table.columns.find(t => t.title == "Hash")) {
		props.table.columns.push({
			title: "Hash",
			dataIndex: "hash",
			width: "60%",
			textWrap: "word-break",
			ellipsis: true,
			showType: "copy"
		});
	}
	props.table.renderItem = item => {
		return (
			<List.Item>
				<div className="block-list-box block">
					<div className="block">
						<span className="left-name">Method：</span>
						<span className="right-value">{item.method}</span>
					</div>
					<div className="block">
						<span className="left-name">Status：</span>
						<span className="right-value">{item.status}</span>
					</div>
					<div className="block">
						<span className="left-name">Time：</span>
						<span className="right-value">{item.timestamp}</span>
					</div>
					<div className="block">
						<span className="left-name">TXHash：</span>
						<span className="right-value">{item.hash}</span>
					</div>
				</div>
			</List.Item>
		);
	};
	return <MList props={props} />;
};
export default React.memo(CBlockList);
