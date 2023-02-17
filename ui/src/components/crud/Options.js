/*
 * @description: crud操作组件
 * @author: Jack Chen @懒人码农
 * @Date: 2022-04-24 10:01:40
 * @LastEditors: Jack Chen
 * @LastEditTime: 2022-04-25 10:03:31
 */

import { Button, Space } from "antd";
import _ from "lodash";

const Options = props => {
	const { btnOptions, hasAdd, hasDel, handleAdd, handleDel } = props;

	return (
		<Space>
			{hasAdd && (
				<Button type="primary" onClick={handleAdd}>
					新增
				</Button>
			)}
			{hasDel && (
				<Button type="primary" onClick={handleDel}>
					删除
				</Button>
			)}
			{!_.isEmpty(btnOptions) &&
				btnOptions.map((b, idx) => {
					return (
						<Button key={idx} type="primary" onClick={b.handleClick}>
							{b.title}
						</Button>
					);
				})}
		</Space>
	);
};

export default Options;
