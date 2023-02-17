/*
 * @Description:
 * @Autor: fage
 * @Date: 2022-07-26 14:52:51
 * @LastEditors: chenbinfa
 * @LastEditTime: 2022-08-10 17:49:21
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
	props.table.renderItem = item => {
		return (
			<List.Item>
				<div className="block-list-box block">
					<div className="block">
						<span className="left-name">Block：</span>
						<span className="right-value">
							{item.blockHeight} <label>({item.timestamp})</label>
						</span>
					</div>
					<div className="block">
						<span className="left-name">Hash：</span>
						<span className="right-value">{item.hash}</span>
					</div>
				</div>
			</List.Item>
		);
	};

	return <MList props={props} />;
};

export default React.memo(CBlockList);
