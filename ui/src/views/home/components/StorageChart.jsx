/*
 * @Description:
 * @Autor: fage
 * @Date: 2022-07-26 14:52:51
 * @LastEditors: lanmeng656 lanmeng656@google.com
 * @LastEditTime: 2023-02-14 14:34:13
 * @description: about
 * @author: chenbinfa
 */
import React, { useState, useEffect } from "react";
import { Button, Col, Spin, DatePicker, Input, Row, Select, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import _ from "lodash";
import moment from "moment";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Pie } from "@ant-design/plots";
import storageAJAX from "@services/storage";
import "@ant-design/flowchart/dist/index.css";

const SearchBar = ({ className, stakingPer }) => {
	const [loading, setLoading] = useState(false);
	const [chartConfig, setChartConfig] = useState();
	if(!stakingPer) return;
	stakingPer=parseFloat(stakingPer);

	useEffect(async () => {
		const config = {
			height: 150,
			data: [
				{
					type: "Staking",
					value: stakingPer//space.used
				},
				{
					type: "Unstaking",
					value: 100- stakingPer//space.idle
				}
			],
			legend: false,
			angleField: "value",
			colorField: "type",
			radius: 1,
			innerRadius: 0.66,
			label: {
				type: "inner",
				offset: "-50%",
				content: "{value}",
				style: {
					textAlign: "center",
					fontSize: 14
				}
			},
			interactions: [
				{
					type: "element-selected"
				},
				{
					type: "element-active"
				}
			],
			color: ['rgba(230, 0, 122, 1)','#000000'],
			statistic: {
				title: false,
				content: {
					style: {
						whiteSpace: "pre-wrap",
						overflow: "hidden",
						textOverflow: "ellipsis",
						fontSize: "18px"
					},
					content: '<img width="50px" src="/img/u218.png" />'
				}
			}
		};
		setChartConfig(config);
	}, [stakingPer]);

	return (
		<div className={className}>
			<Spin spinning={loading}>{chartConfig ? <Pie {...chartConfig} /> : ""}</Spin>
		</div>
	);
};

export default React.memo(styled(SearchBar)`
	padding: 0px;
	background-color: #fff;
`);
