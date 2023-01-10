/*
 * @Description:
 * @Autor: fage
 * @Date: 2022-07-26 14:52:51
 * @LastEditors: chenbinfa
 * @LastEditTime: 2022-08-08 15:11:07
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

const SearchBar = ({ className, space }) => {
	const [loading, setLoading] = useState(false);
	const [chartConfig, setChartConfig] = useState();

	useEffect(async () => {
		let usePer = "100";
		if (space.total > 0) {
			usePer = ((space.used * 100) / space.total).toFixed(1);
		}
		const config = {
			height: 225,
			data: [
				{
					type: "Use Storage",
					value: space.used
				},
				{
					type: "Available Storage",
					value: space.idle
				}
			],
			legend: false,
			angleField: "value",
			colorField: "type",
			radius: 1,
			innerRadius: 0.7,
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
			color: "rgb(41 119 240)",
			statistic: {
				title: false,
				content: {
					style: {
						whiteSpace: "pre-wrap",
						overflow: "hidden",
						textOverflow: "ellipsis",
						fontSize: "18px"
					},
					content: usePer + "%\n\n  Storage Used"
				}
			}
		};
		setChartConfig(config);
	}, [space]);

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
