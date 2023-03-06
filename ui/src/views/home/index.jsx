/*
 * @Description:
 * @Autor: fage
 * @Date: 2022-07-07 14:36:09
 * @LastEditors: lanmeng656 lanmeng656@google.com
 * @LastEditTime: 2023-02-14 15:34:19
 */
import styled from "styled-components";
import React, { useRef, useState, useEffect, useMemo } from "react";
import {
  DatePicker,
  Input,
  Menu,
  Modal,
  Button,
  Dropdown,
  Descriptions,
  Select,
  Space,
  Table,
  message,
  Tabs,
  Popconfirm,
  Checkbox,
  Card,
  Spin,
} from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import _ from "lodash";
import "./index.less";
import storageAJAX from "@services/storage";
import StorageChart from "./components/StorageChart";
import miner from "@services/miner";
import { ThTable } from "@/components/ThTable";
import Blocks from "./components/Blocks";
import Transactions from "./components/Transactions";
import Overview from "./components/Overview";
import TransactionTrend from "./components/TransactionTrend";
import { isMobile } from "@utils";
import subData from "@services/subdata";
import queryDB from "@services/queryDB";
import webconfig from "@/webconfig";
import {
  formatterCurrency,
  formatterCurrencyStr,
  formatterCurrencyStr2,
  formatterSize,
  formatterNumberStr,
} from "@utils/format";

const isM = isMobile();

let ignore = false;
let timeout = null;
let timeSecG = -1;

const minerColumns = miner.getColumns(isM ? "list" : "table");

const Home = ({ ...props }) => {
  document.title = "Home-Substats";
  const [totalIssuance, setTotalIssuance] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [blockHeight, setBlockHeight] = useState("loading...");
  const [validators, setValidators] = useState("loading");
  const [timeSec, setTimeSec] = useState("--");
  const [staking, setStaking] = useState("--");
  const [stakingPer, setStakingPer] = useState("--");

  const [space, setSpace] = useState({
    used: 0,
    idle: 0,
    total: 0,
  });
  useEffect(() => {
    const c = _.cloneDeep(minerColumns);
    c[2].sorter = false;
    c[3].sorter = false;
    if (c[4]) {
      c[4].sorter = false;
    }
    const props = {
      border: true,
      size: "middle",
      pagesize: 10,
      hidePager: true,
      loadList: {
        method: async () => {
          if (ignore) return;
          let result = await miner.loadMiners({
            tableName: "miner_summary",
            pageindex: 1,
            pagesize: 20,
            sorter: [
              {
                column: "power",
                order: "desc",
              },
            ],
          });
          if (ignore) return;
          if (result.msg == "ok") {
            setMiners(result.data);
          }
          return {
            msg: "ok",
            data: result.data.slice(0, 20),
          };
        },
      },
      table: {
        columns: c,
      },
    };
    // setPropsTable(props);
  }, []);

  useEffect(() => {
    setTimeout(function () {
      if (document.getElementById("searchInput")) {
        document.getElementById("searchInput").value = "";
      }
    }, 1);
  }, []);

  useEffect(() => {
    //query transaction count

    ignore = false;
    async function run() {
      if (ignore) return;
      let result = await queryDB.list({
        tableName: "block_transaction",
        pagesize: 1,
        pageindex: 1,
        onlytotal: 1,
      });
      if (result.msg != "ok") {
        return;
      }
      const count = result.total;
      setTotalTransactions(formatterNumberStr(count));
    }
    run();
    return () => {
      ignore = true;
    };
  }, []);

  // query Validators
  useEffect(() => {
    ignore = false;
    async function run() {
      if (ignore) return;
      let result = await storageAJAX({
        ac1: "babe",
        ac2: "authorities",
      });
      if (result.msg != "ok") {
        setValidators("no");
        return;
      }
      const count = result.data.length;
      setValidators(formatterNumberStr(count));
    }
    run();
    return () => {
      ignore = true;
    };
  }, []);

  // balances.totalIssuance
  useEffect(async () => {
    let result = await storageAJAX({ ac1: "balances", ac2: "totalIssuance" });
    if (result.msg != "ok") {
      console.log(result);
      return;
    }
    let balances = parseInt(result.data, 16);
    let balancesStr = formatterCurrencyStr2(balances);
    setTotalIssuance(balancesStr);

    result = await storageAJAX({ ac1: "staking", ac2: "erasTotalStake" });
    if (result.msg != "ok") {
      console.log(result);
      setStakingPer("no");
      return;
    }
    let stakingInt = parseInt(result.data[0], 16);
    let stakingStr = formatterNumberStr(stakingInt / 1000000000000000000);
    setStaking(stakingStr);
    let stakingPer = ((stakingInt * 100) / balances).toFixed(2);
    setStakingPer(stakingPer);

    // result.data.forEach(t=>{
    //   console.log(eval(t).toString(10));
    // });
    // let balances = parseInt(result.data, 16);
    // balances = formatterCurrencyStr2(balances);
    // setTotalIssuance(balances);
  }, []);

  //sub block heigiht
  useEffect(() => {
    const subId = "home-blockInfo";
    let e = {
      id: subId,
      name: "block-new",
      e: (data) => {
        if (ignore) return;
        setBlockHeight(formatterNumberStr(data.blockHeight));
        timeSecG = 0;
      },
    };
    subData.addEvent(e);
    timeout = setInterval(function () {
      if (timeSecG > -1 && !ignore) {
        setTimeSec(timeSecG.toFixed(1) + " s");
        timeSecG += 0.1;
      }
    }, 100);
    return () => {
      ignore = true;
      clearInterval(timeout);
      subData.removeEvent(subId);
    };
  }, []);

  return (
    <div className="containner-in">
      <div className="top-price-box"></div>
      <div>
        <div className="chart-box block">
          <Overview className="chart-left myRadius" />
          <div className="chart-right myRadius">
            <div className="box-title">Network Overview</div>
            <div className="box-con">
              <div className="block-1">
                <div>Finalized Block</div>
                <span>{blockHeight}</span>
                <div style={{ fontSize: 18, color: "red" }}>{timeSec}</div>
              </div>
              <div className="block-1">
                <div>Transaction</div>
                <span>{totalTransactions}</span>
              </div>
              <div className="block-1">
                <div>Total issuance</div>
                <span>{totalIssuance}</span>
              </div>
              <div className="block-1">
                <div>Validators</div>
                {validators == "no" ? (
                  <span style={{ fontSize: "14px", fontWeight: "lighter" }}>
                    Chain not supported
                  </span>
                ) : validators == "loading" ? (
                  <Spin spinning={true}>
                    <span style={{ fontSize: "14px", fontWeight: "lighter" }}>
                      Loading...
                    </span>
                  </Spin>
                ) : (
                  <span>{validators}</span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="list-box block">
          <div className="l-box-1">
            {stakingPer == "no" ? (
              <div className="l-box-1-top">
                <div className="l-box-1-top-left">
                  <div className="box-title">Total Staking Rate</div>
                  <span
                    className="main-font"
                    style={{ fontSize: "14px", lineHeight: "130px" }}
                  >
                    Not supported the staking pallet.
                  </span>
                </div>
              </div>
            ) : stakingPer == "--" ? (
              <Spin spinning={true}>
                <div className="l-box-1-top">
                  <div className="l-box-1-top-left">
                    <div className="box-title">Total Staking Rate</div>
                    <span
                      className="main-font"
                      style={{ fontSize: "14px", lineHeight: "130px" }}
                    >
                      Loading...
                    </span>
                  </div>
                </div>
              </Spin>
            ) : (
              <div className="l-box-1-top">
                <div className="l-box-1-top-left">
                  <div className="box-title">Total Staking Rate</div>
                  <span className="main-font">{stakingPer}%</span>
                  <label>
                    {staking}M {webconfig.tokenName}
                  </label>
                </div>
                <div className="l-box-1-top-right">
                  <StorageChart stakingPer={stakingPer} />
                </div>
              </div>
            )}
            <div className="l-box-1-bottom">
              <TransactionTrend />
            </div>
          </div>
          <div className="l-box-2">
            <div className="l-box-2-1">
              <Blocks />
            </div>
            <div className="l-box-2-1">
              <Transactions />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Home);
