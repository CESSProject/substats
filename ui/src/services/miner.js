/*
 * @Description:
 * @Autor: fage
 * @Date: 2022-08-09 10:10:31
 * @LastEditors: chenbinfa
 * @LastEditTime: 2022-08-16 17:52:58
 * @description: miner list
 * @author: chenbinfa
 */
import storageAJAX from "@services/storage";
import { NavLink } from "react-router-dom";
import queryDB from "@services/queryDB";

export default { loadMiners, loadOneMiner, getColumns };

async function loadMiners(p) {
	let result = await queryDB.list(p);
	return result;
}
// async function loadMiners() {
// 	let result = await storageAJAX({ ac1: "sminer", ac2: "minerItems" });
// 	// console.log("result", result);
// 	if (result.msg != "ok") {
// 		return result;
// 	}
// 	let totalPower = 0;
// 	result.data.forEach((m, i) => {
// 		m.power = _.toNumber(m.power);
// 		m.totalReward = _.toNumber(m.rewardInfo.totalReward);
// 		totalPower += m.power;
// 	});
// 	result.data.forEach(m => {
// 		if (totalPower == 0) {
// 			m.per = 100;
// 		} else {
// 			m.per = ((m.power * 100) / totalPower).toFixed(1);
// 		}
// 	});
// 	result.data.sort((t1, t2) => t2.power - t1.power);
// 	result.data.forEach((t, i) => {
// 		t.peerid = i + 1;
// 		if (!t.key) t.key = i + 1;
// 	});
// 	// localStorage.setItem()
// 	return result;
// }
async function loadOneMiner(key) {
	let p = {
		tableName: "miner",
		filter: [
			{
				column: "beneficiaryAccount",
				sign: "=",
				values: [key]
			}
		]
	};
	let result = await queryDB.list(p);
	if (result.msg != "ok" || !result.data || result.data.length == 0) {
		return null;
	}
	return result.data[0];
}
function getColumns(type = "table") {
	const minerColumns = [
		{
			title: "Rank",
			dataIndex: "id",
			width: "10%",
			render: (text, record, index) => {
				text = index + 1;
				if (text == 1) {
					text = <img title="NO.1" width={20} src={process.env.PUBLIC_URL + "/img/rank-1.png"} />;
				} else if (text == 2) {
					text = <img title="NO.2" width={20} src={process.env.PUBLIC_URL + "/img/rank-2.png"} />;
				} else if (text == 3) {
					text = <img title="NO.3" width={20} src={process.env.PUBLIC_URL + "/img/rank-3.png"} />;
				} else {
					text = <span>&nbsp;{text}</span>;
				}
				return <NavLink to={"/miner/" + record.beneficiaryAccount}>{text}</NavLink>;
			}
		},
		{
			title: "Account",
			dataIndex: "beneficiaryAccount",
			width: "35%",
			textWrap: "word-break",
			ellipsis: true,
			showType: "accountIcon"
		},
		// {
		// 	title: "Address1",
		// 	dataIndex: "key",
		// 	width: "30%",
		// 	textWrap: "word-break",
		// 	ellipsis: true,
		// 	showType: "copy"
		// },
		// {
		// 	title: "Address2",
		// 	dataIndex: "beneficiary",
		// 	width: "30%",
		// 	textWrap: "word-break",
		// 	ellipsis: true,
		// 	showType: "copy"
		// },
		{
			title: "Power(GiB)",
			dataIndex: "power",
			width: "15%",
			showType: "store-size-g",
			sorter: true
		},
		{
			title: "Power Ratio",
			dataIndex: "powerPer",
			width: "20%",
			showType: "progress",
			sorter: true
		},
		{
			title: "Mining reward($TCESS)",
			dataIndex: "totalReward",
			width: "20%",
			showType: "currency-qianfen",
			sorter: true
		}
	];
	const listColumns = [
		{
			title: "Rank",
			dataIndex: "id",
			width: "10%",
			render: (text, record, index) => {
				text = index + 1;
				if (text == 1) {
					text = <img title="NO.1" width={20} src={process.env.PUBLIC_URL + "/img/rank-1.png"} />;
				} else if (text == 2) {
					text = <img title="NO.2" width={20} src={process.env.PUBLIC_URL + "/img/rank-2.png"} />;
				} else if (text == 3) {
					text = <img title="NO.3" width={20} src={process.env.PUBLIC_URL + "/img/rank-3.png"} />;
				} else {
					text = <span>&nbsp;{text}</span>;
				}
				return <NavLink to={"/miner/" + record.beneficiaryAccount}>{text}</NavLink>;
			}
		},
		{
			title: "Account",
			dataIndex: "beneficiaryAccount",
			width: "35%",
			textWrap: "word-break",
			ellipsis: true,
			showType: "accountIcon"
		},
		{
			title: "Power",
			dataIndex: "power",
			width: "15%",
			showType: "store-size-g",
			tpl: "{power}(GiB)"
		},
		{
			title: "Ratio",
			dataIndex: "powerPer",
			width: "20%",
			showType: "progress"
		}
	];
	return type == "table" ? minerColumns : listColumns;
}
