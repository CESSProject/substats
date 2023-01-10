/*
 * @Description:
 * @Autor: fage
 * @Date: 2022-07-25 17:41:49
 * @LastEditors: chenbinfa
 * @LastEditTime: 2022-08-01 09:50:52
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

export function ThForm({ props }) {
	runCount++;
	console.log("ThForm render count", runCount);
	const onFinish = values => {
		console.log("Success:", values);
	};

	const onFinishFailed = errorInfo => {
		console.log("Failed:", errorInfo);
	};

	return (
		<Form
			name="basic"
			labelCol={{
				span: 4
			}}
			wrapperCol={{
				span: 20
			}}
			initialValues={{
				remember: true
			}}
			onFinish={onFinish}
			onFinishFailed={onFinishFailed}
			autoComplete="off">
			<Form.Item
				label="Username"
				name="username"
				rules={[
					{
						required: true,
						message: "Please input your username!"
					}
				]}>
				<Input />
			</Form.Item>

			<Form.Item
				label="Password"
				name="password"
				rules={[
					{
						required: true,
						message: "Please input your password!"
					}
				]}>
				<Input.Password />
			</Form.Item>

			<Form.Item
				name="remember"
				valuePropName="checked"
				wrapperCol={{
					offset: 8,
					span: 16
				}}>
				<Checkbox>Remember me</Checkbox>
			</Form.Item>

			<Form.Item
				wrapperCol={{
					offset: 8,
					span: 16
				}}>
				<Button type="primary" htmlType="submit">
					Submit
				</Button>
			</Form.Item>
		</Form>
	);
}
