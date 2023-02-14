/*
 * @Description:
 * @Autor: fage
 * @Date: 2022-07-26 17:49:48
 * @LastEditors: lanmeng656 lanmeng656@google.com
 * @LastEditTime: 2023-02-13 19:53:29
 * @description: about
 * @author: chenbinfa
 */
import React, { useRef, useState, useEffect } from "react";
import {
  DatePicker,
  Input,
  InputNumber,
  Menu,
  Modal,
  Button,
  Tooltip,
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
  Form,
  Collapse,
  Empty,
  Spin,
} from "antd";
import {
  CaretUpOutlined,
  DownCircleOutlined,
  UpCircleOutlined,
  DeleteOutlined,
  SwapRightOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import _ from "lodash";
import { useNavigate, useParams, NavLink } from "react-router-dom";
import queryDB from "@services/queryDB";
import { formatArr } from "@/utils/format-show-type";
import moment from "moment";
import copy from "copy-to-clipboard";
import BreadcrumbBar from "@/components/BreadcrumbBar";
import MList from "@/components/mobile/MList";

const { Option } = Select;
const { Column, ColumnGroup } = Table;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Panel } = Collapse;
let runCount = 0;
let dics = [];

function Main({ className }) {
  const { q } = useParams();
  const [loading, setLoading] = useState(false);
  const [blockHeight, setBlockHeight] = useState(q);
  const [blockDetail, setBlockDetail] = useState({});
  const [columns, setColumns] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [events, setEvent] = useState([]);
  const [tabKey, setTabKey] = useState("t");
  const [transactionColumns, setTransactionColumns] = useState([]);
  const [eventColumns, setEventColumns] = useState([]);

  if (!q) {
    return message.error("blockHeight is not found");
  } else {
    if (q != blockHeight) {
      setBlockHeight(q);
    }
  }
  if (document.getElementById("searchInput")) {
    document.getElementById("searchInput").value = blockHeight;
  }
  console.log("blockHeight", blockHeight);

  //query block info
  useEffect(async () => {
    const params = {
      tableName: "block_info",
      pageindex: 1,
      pagesize: 1,
      filter: [
        {
          column: "blockHeight",
          sign: "=",
          values: [blockHeight],
        },
      ],
    };
    let result = await queryDB.list(params);
    if (result.msg != "ok") {
      return message.info(result.err || result.msg);
    }
    setBlockDetail(result.data[0]);
  }, [blockHeight]);

  //query block events and transactions
  useEffect(async () => {
    setLoading(true);
    let params = {
      tableName: "block_event",
      pageindex: 1,
      pagesize: 10000,
      filter: [
        {
          column: "blockHeight",
          sign: "=",
          values: [blockHeight],
        },
      ],
    };
    let result = await queryDB.list(params);
    if (result.msg != "ok") {
      setLoading(false);
      return message.info(result.err || result.msg);
    }
    const events = result.data;
    events.forEach((t) => (t.key = t.id));
    setEvent(events);
    params = {
      tableName: "block_transaction",
      pageindex: 1,
      pagesize: 10000,
      filter: [
        {
          column: "blockHeight",
          sign: "=",
          values: [blockHeight],
        },
      ],
    };
    result = await queryDB.list(params);
    if (result.msg != "ok") {
      setLoading(false);
      return message.info(result.err || result.msg);
    }
    result.data.forEach((tx) => {
      tx.key = tx.id;
      tx.events = events.filter((ev) => ev.txId == tx.id);
    });
    setTransactions(result.data);
    setLoading(false);
  }, [blockHeight]);

  //make event columns
  useEffect(async () => {
    const columnsArr = [
      {
        title: "Event ID",
        dataIndex: "blockHeight",
        key: "blockHeight",
        width: "20%",
        showType: "tpl",
        tpl: (text, record) => {
          return record.blockHeight + "-" + record.index;
        },
      },
      {
        title: "Typy",
        dataIndex: "method",
        key: "method",
        width: "30%",
        showType: "text",
      },
      {
        title: "Action",
        dataIndex: "section",
        key: "section",
        width: "30%",
        showType: "text",
      },
      {
        title: "Time",
        dataIndex: "timestamp",
        key: "timestamp",
        width: "20%",
        showType: "datetime",
      },
    ];
    formatArr(columnsArr);
    setEventColumns(columnsArr);
  }, []);

  //make Transaction Columns
  useEffect(async () => {
    const columnsArr = [
      {
        title: "Hash",
        dataIndex: "hash",
        width: "15%",
        showType: "copy",
      },
      {
        title: "Method",
        dataIndex: "method",
        width: "15%",
        render: (text, record, index) => {
          return record.section + "." + text;
        },
      },
      {
        title: "Status",
        dataIndex: "status",
        width: "8%",
        render: (text, record, index) => {
          return text === "success" ? (
            <span className="green">
              <CheckCircleOutlined /> {text}
            </span>
          ) : (
            <span className="red">
              <ExclamationCircleOutlined /> {text}
            </span>
          );
        },
      },
      {
        title: "Signer",
        dataIndex: "signer",
        width: "15%",
        textWrap: "word-break",
        ellipsis: true,
        showType: "copy",
      },
      {
        title: "DestAccount",
        dataIndex: "destAccount",
        width: "15%",
        textWrap: "word-break",
        ellipsis: true,
        showType: "copy",
      },
      {
        title: "Amount",
        dataIndex: "amount",
        width: "12%",
        showType: "currency-qianfen",
      },
      {
        title: "Time",
        dataIndex: "timestamp",
        width: "15%",
        showType: "datetime",
      },
    ];
    formatArr(columnsArr);
    setTransactionColumns(columnsArr);
  }, []);

  return (
    <div className={className}>
      <BreadcrumbBar currPageName="Block detail" />
      <Spin spinning={loading}>
        <div className="content">
          <h1>Block#{blockHeight}</h1>
          <div className="con-top">
            <div className="con-left">
              <div className="line-block line-1">
                <div className="mini-block">
                  <div>Block</div>
                  <label>#{blockHeight}</label>
                </div>
                <div className="mini-block">
                  <div>Transactions</div>
                  <label>{transactions.length}</label>
                </div>
                <div className="mini-block">
                  <div>Events</div>
                  <label>{events.length}</label>
                </div>
              </div>
              <div className="line-block line-2">
                <div className="long-block">
                  <div>Transaction Hash</div>
                  <label>{blockDetail.hash}</label>
                </div>
              </div>
            </div>
            <div className="con-right">
              <div className="line-block line-1">
                <div className="mini-block">
                  <div>Block Time</div>
                  <label>32 secs ago</label>
                </div>
                <div className="mini-block">
                  <div>Timestamp</div>
                  <label>{blockDetail.timestamp}</label>
                </div>
                <div className="mini-block">
                  <div>Status</div>
                  <label style={{ color: "green" }}>
                    Comfirmed <CheckCircleOutlined />
                  </label>
                </div>
              </div>
              <div className="line-block line-2">
                <div className="long-block">
                  <div>Parent Hash</div>
                  <label className="main-font">{blockDetail.parentHash}</label>
                </div>
              </div>
            </div>
          </div>
          <div className="con-bottom"></div>
        </div>
      </Spin>
      <div className="tab-box">
        <div className="tab-title">
          <span
            onClick={() => setTabKey("t")}
            className={tabKey == "t" ? "curr" : ""}
          >
            Extrinsics
          </span>
          <span
            onClick={() => setTabKey("e")}
            className={tabKey == "e" ? "curr" : ""}
          >
            Events
          </span>
        </div>
        {tabKey == "t" ? (
          <div className="tab-con">
            <Spin spinning={loading}>
              <Card
                title={"Extrinsics(" + transactions.length + ")"}
                style={{ marginTop: 10 }}
              >
                {transactions.length == 0 ? (
                  <Empty />
                ) : (
                  <div className="block-list-box block">
                    <Table
                      columns={transactionColumns}
                      expandable={{
                        // expandIcon: ({ expanded, onExpand, record }) =>
                        //   expanded ? (
                        //     <UpCircleOutlined size={40}
                        //       onClick={(e) => onExpand(record, e)}
                        //     />
                        //   ) : (
                        //     <DownCircleOutlined size={40}
                        //       onClick={(e) => onExpand(record, e)}
                        //     />
                        //   ),
                        expandedRowRender: (record) => {
                          return (
                            <Collapse accordion>
                              {record.events.map((ev, i) => {
                                return (
                                  <Panel
                                    header={ev.section + "." + ev.method}
                                    key={i}
                                  >
                                    <pre>
                                      {JSON.stringify(
                                        JSON.parse(ev.data),
                                        null,
                                        2
                                      )}
                                    </pre>
                                  </Panel>
                                );
                              })}
                            </Collapse>
                          );
                        },
                        rowExpandable: (record) => record.events.length > 0,
                      }}
                      dataSource={transactions}
                    />
                  </div>
                )}
              </Card>
            </Spin>
          </div>
        ) : (
          <div className="tab-con">
            <Spin spinning={loading}>
              <Card
                title={"Events(" + events.length + ")"}
                style={{ marginTop: 10 }}
              >
                {events.length == 0 ? (
                  <Empty />
                ) : (
                  <div className="block-list-box block">
                    <Table
                      columns={eventColumns}
                      expandable={{
                        expandedRowRender: (record) => {
                          if (!record.data) {
                            return "";
                          }
                          return (
                            <pre>
                              {JSON.stringify(JSON.parse(record.data), null, 2)}
                            </pre>
                          );
                        },
                      }}
                      dataSource={events}
                    />
                  </div>
                )}
              </Card>
            </Spin>
          </div>
        )}
      </div>
    </div>
  );
}

export default styled(Main)`
  display: block;
  overflow: hidden;
  .content {
    display: flex;
    flex-flow: column nowrap;
    h1 {
      font-size: 20px;
      width: 100%;
    }
    .con-top {
      width: 100%;
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      .con-left,
      .con-right {
        width: 49.5%;
        display: flex;
        flex-flow: column nowrap;
        .line-block {
          display: flex;
          flex-flow: row nowrap;
          justify-content: space-between;
          margin-bottom: 20px;
          .mini-block {
            width: 32%;
            height: 140px;
            display: block;
            overflow: hidden;
            background-color: #fff;
            padding: 14px;
            padding-top: 21px;
            div {
              display: block;
              font-size: 14px;
            }
            label {
              display: block;
              font-size: 21px;
              font-weight: bold;
            }
          }
          .long-block {
            width: 100%;
            background-color: #fff;
            display: block;
            overflow: hidden;
            padding: 24px 10px;
            div {
              display: block;
              font-size: 14px;
              line-height: 30px;
            }
            label {
              display: block;
              font-size: 18px;
              font-weight: bold;
            }
          }
        }
      }
      .con-right {
      }
    }
    .con-bottom {
      width: 100%;
      display: block;
    }
  }
  .table-content {
    background-color: #fff;
    .ant-descriptions-header {
      margin-bottom: 0 !important;
      padding: 10px;
    }
  }
  pre {
    background-color: #000;
    color: #fff;
    padding: 20px;
  }
  .block-list-box {
    position: relative;
    padding: 4px 10px;
    display: block;
    width: 100%;
    line-height: 27px;
    .block {
      clear: both;
      line-height: 32px;
    }
    .one-transaction {
      border-bottom: 1px solid #eee;
      padding: 20px 0;
      .trx-info,
      .trx-events {
        display: block;
        overflow: hidden;
        margin-bottom: 5px;
      }
      @media screen and (min-width: 901px) {
        .trx-info {
          display: block;
          overflow: hidden;
          float: left;
          width: 40%;
          margin-bottom: 0px;
        }
        .trx-events {
          display: block;
          overflow: hidden;
          float: right;
          width: 59%;
          margin-bottom: 0px;
        }
      }
    }
    .left-name {
      color: #aaa;
      float: left;
      width: 35%;
      text-align: right;
      padding-right: 10px;
      max-width: 200px;
    }
    .right-value {
      label {
        color: green;
        padding-left: 10px;
      }
    }
  }
  .tab-box {
    display: block;
    overflow: hidden;
    .tab-title {
      display: block;
      overflow: hidden;
      color: #aaa;
      .curr {
        color: var(--theme-color);
      }
      span {
        padding: 20px;
        padding-left: 0;
        font-size: 22px;
        font-weight: bold;
        cursor: pointer;
      }
    }
  }
  @media screen and (max-width: 901px) {
    .tab-box {
      display: none;
    }
    .con-top {
      display: block !important;
      clear: both !important;
      width: 100% !important;
      .con-left,
      .con-right {
        display: block !important;
        clear: both !important;
        width: 100% !important;
      }
    }
    .content .con-top .con-left .line-block .mini-block label,
    .content .con-top .con-right .line-block .mini-block label {
      font-size: 18px !important;
      word-break: break-all;
      word-wrap: break-word;
    }
    .content .con-top .con-left .line-block .long-block label,
    .content .con-top .con-right .line-block .long-block label {
      font-size: 18px !important;
      word-break: break-all;
      word-wrap: break-word;
    }    
  }
`;
