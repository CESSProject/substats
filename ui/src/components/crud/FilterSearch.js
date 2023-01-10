/*
 * @description: crud搜索组件
 * @author: Jack Chen @懒人码农
 * @Date: 2022-04-24 10:01:40
 * @LastEditors: Jack Chen
 * @LastEditTime: 2022-04-25 10:01:28
 */

import React, { useState } from "react";
import { Button, Col, DatePicker, Input, Row, Select, message } from "antd";
import _ from "lodash";
import moment from "moment";
import styled from "styled-components";

const { Option } = Select;
const FilterSearch = ({ filterOptions, handleSearch, className }) => {
	const defaultFilter = {};
	_.map(filterOptions, f => {
		defaultFilter[f.filterKey] = f.defaultValue;
	});
	const [filter, setFilter] = useState(defaultFilter);

	const handleClick = () => {
		const rangeItem = _.find(filterOptions, f => f.type === "daterange");
		const rangeKey = _.get(rangeItem, "filterKey");
		const rangeLabel = _.get(rangeItem, "label");
		const rangeList = filter[rangeKey];
		if (_.isEmpty(rangeList)) {
			message.info(`请选择${rangeLabel}`);
		} else if (_.isEmpty(rangeList[0])) {
			message.info(`请选择${rangeLabel}的起始时间`);
		} else if (_.isEmpty(rangeList[1])) {
			message.info(`请选择${rangeLabel}的结束时间`);
		} else if (rangeList[0] > rangeList[1]) {
			message.info(`${rangeLabel}的起始时间不能大于${rangeLabel}的结束时间`);
		}
		handleSearch(filter);
	};

	const renderItem = item => {
		if (item.type === "input") {
			return <Input placeholder={`请输入${item.label}`} onChange={e => setFilter(_.assign(filter, { [item.filterKey]: e.target.value }))} />;
		} else if (item.type === "select") {
			return (
				<Select
					labelInValue
					defaultValue={{ value: item.defaultValue }}
					style={{ width: "100%" }}
					onChange={opt => setFilter(_.assign(filter, { [item.filterKey]: opt.value }))}>
					{item &&
						item.options &&
						item.options.map(opt => (
							<Option key={opt.valueKey} value={opt.value}>
								{opt.label}
							</Option>
						))}
				</Select>
			);
		} else if (item.type === "date") {
			return <DatePicker style={{ width: "100%" }} onChange={value => setFilter(_.assign(filter, { [item.filterKey]: moment(value).format("x") }))} />;
		} else if (item.type === "daterange") {
			return (
				<>
					<DatePicker
						style={{ width: "48%" }}
						onChange={value => {
							const rangeList = _.get(filter, `${item.filterKey}`, []);
							rangeList[0] = moment(value).format("x");
							setFilter({ ...filter, [item.filterKey]: rangeList });
						}}
					/>
					<span> - </span>
					<DatePicker
						style={{ width: "48%" }}
						onChange={value => {
							const rangeList = _.get(filter, `${item.filterKey}`, []);
							rangeList[1] = moment(value).format("x");
							setFilter({ ...filter, [item.filterKey]: rangeList });
						}}
					/>
				</>
			);
		} else {
			return null;
		}
	};

	return (
		<Row gutter={[16, 16]} className={`${className}`}>
			{filterOptions &&
				filterOptions.map(item =>
					item.type === "daterange" ? (
						<Col key={item.filterKey} span={10}>
							{renderItem(item)}
						</Col>
					) : (
						<Col key={item.filterKey} span={5}>
							{renderItem(item)}
						</Col>
					)
				)}
			<Col span={3}>
				<Button type="primary" onClick={handleClick}>
					搜索
				</Button>
			</Col>
		</Row>
	);
};

export default React.memo(styled(FilterSearch)`
	margin-bottom: 20px;
`);
