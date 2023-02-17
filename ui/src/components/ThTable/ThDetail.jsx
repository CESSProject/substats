/*
 * @Description:
 * @Autor: fage
 * @Date: 2022-07-25 17:41:49
 * @LastEditors: chenbinfa
 * @LastEditTime: 2022-08-01 09:51:03
 * @description: about
 * @author: chenbinfa
 */
import React, { useRef, useState, useEffect } from "react";
import { DatePicker, Input, InputNumber, Menu, Modal, Button, Dropdown, Descriptions, Select, Space, Table, message, Tabs, Popconfirm, Checkbox, Card, Form } from "antd";
import { UserOutlined, DownOutlined, DeleteOutlined, SwapRightOutlined } from "@ant-design/icons";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import "./ThTable.less";
import queryDB from "@services/queryDB";

const { Option } = Select;
const { Column, ColumnGroup } = Table;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
let runCount = 0;
let dics = [];

export function ThDetail({ props }) {
	runCount++;
	console.log("ThDetail render count", runCount);
	return (
		<Descriptions bordered column={1}>
			<Descriptions.Item label="消息类型">系统通知</Descriptions.Item>
			<Descriptions.Item label="消息名称">有新活动！</Descriptions.Item>
			<Descriptions.Item label="模板签名">【源品生物】</Descriptions.Item>
			<Descriptions.Item label="模板内容">商城/某产品分类/真爱宝贝A计划</Descriptions.Item>
		</Descriptions>
	);
}
