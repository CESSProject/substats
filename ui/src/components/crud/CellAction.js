/*
 * @description: 表单-单元格操作
 * @author: Jack Chen @懒人码农
 * @Date: 2022-04-24 10:01:40
 * @LastEditors: Jack Chen
 * @LastEditTime: 2022-04-25 10:01:28
 */

import styled from "styled-components";
import _ from "lodash";

function CellAction({ className, title, onClick }) {
	/**
	 * 操作项
	 * @param url 操作需要请求的
	 * @param params 操作需要请求传递的
	 * @param callback 操作完成后的回调
	 */
	const handleAction = ({ url, params, callback }) => {
		_.isFunction(onClick) && onClick();
	};

	return (
		<a className={`${className}`} onClick={handleAction}>
			{title}
		</a>
	);
}

export default styled(CellAction)`
	display: inline-block;
	margin-left: 5px !important;
`;
