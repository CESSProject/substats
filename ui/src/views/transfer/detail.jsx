/*
 * @Description:
 * @Autor: fage
 * @Date: 2022-07-26 17:49:48
 * @LastEditors: chenbinfa
 * @LastEditTime: 2022-08-11 16:45:31
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
  UserOutlined,
  DownOutlined,
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
import webconfig from "@/webconfig";

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
  const [txHash, setTxHash] = useState(q);
  const [transactions, setTransactions] = useState([]);
  const [transactionColumns, setTransactionColumns] = useState([]);

  if (!q) {
    return message.error("transfer hash not found.");
  } else {
    if (q != txHash) {
      setTxHash(q);
    }
  }
  if (document.getElementById("searchInput")) {
    document.getElementById("searchInput").value = txHash;
  }
  useEffect(async () => {
    setLoading(true);
    let params = {
      tableName: "block_transaction",
      pageindex: 1,
      pagesize: 1,
      filter: [
        {
          column: "hash",
          sign: "=",
          values: [txHash],
        },
      ],
    };
    let result = await queryDB.list(params);
    if (result.msg != "ok") {
      setLoading(false);
      return message.info(result.err || result.msg);
    }
    const transfers = result.data;
    if (!transfers || transfers.length == 0) {
      setLoading(false);
      return message.info("transfer not found");
    }
    // load events
    params = {
      tableName: "block_event",
      pageindex: 1,
      pagesize: 10000,
      filter: [
        {
          column: "txId",
          sign: "=",
          values: [transfers[0].id],
        },
      ],
    };
    result = await queryDB.list(params);
    if (result.msg != "ok") {
      setLoading(false);
      return message.info(result.err || result.msg);
    }
    const events = result.data;
    transfers[0].events = events;
    setTransactions(transfers);
    setLoading(false);
  }, [txHash]);
  useEffect(async () => {
    const columnsArr = [
      {
        title: "Hash",
        dataIndex: "hash",
        width: "15%",
        textWrap: "word-break",
        ellipsis: true,
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
        title: "DestAccount",
        dataIndex: "destAccount",
        width: "15%",
        textWrap: "word-break",
        ellipsis: true,
        showType: "copy",
      },
      {
        title: "Amount(" + webconfig.tokenName + ")",
        dataIndex: "amount",
        width: "5%",
        showType: "currency-qianfen",
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
        title: "Signature",
        dataIndex: "signature",
        width: "15%",
        textWrap: "word-break",
        ellipsis: true,
        showType: "copy",
      },
      {
        title: "Time",
        dataIndex: "timestamp",
        width: "10%",
        showType: "datetime",
      },
      // {
      // 	title: "Events",
      // 	dataIndex: "events",
      // 	render: (text, record, index) => {
      // 		if (record.events.length == 0) {
      // 			return "";
      // 		}
      // 		return (
      // <Collapse accordion>
      // 	{record.events.map((ev, i) => {
      // 		return (
      // 			<Panel header={ev.section + "." + ev.method} key={i}>
      // 				<pre>{JSON.stringify(JSON.parse(ev.data), null, 2)}</pre>
      // 			</Panel>
      // 		);
      // 	})}
      // </Collapse>
      // 		);
      // 	}
      // }
    ];
    formatArr(columnsArr);
    setTransactionColumns(columnsArr);
  }, []);
  return (
    <div className={className}>
      <BreadcrumbBar currPageName="Transfer detail" />
      <Spin spinning={loading}>
        {transactions.length == 0 ? (
          <Empty />
        ) : (
          <div className="table-content">
            {transactions.map((trx, i) => {
              return (
                <Card title="Detail" key={i}>
                  <div className="table-content">
                    <Descriptions bordered column={1}>
                      {transactionColumns.map((t, index) => {
                        return trx[t.key] ? (
                          <Descriptions.Item
                            labelStyle={{ width: "20%" }}
                            label={t.title}
                            key={t.key}
                          >
                            {t.render
                              ? t.render(trx[t.key], trx, index)
                              : trx[t.key]}
                          </Descriptions.Item>
                        ) : (
                          ""
                        );
                      })}
                    </Descriptions>
                  </div>
                </Card>
              );
            })}
            {transactions[0].events.length > 0 ? (
              <Card title="Events">
                <div className="table-content">
                  <Collapse accordion>
                    {transactions[0].events.map((ev, i) => {
                      return (
                        <Panel header={ev.section + "." + ev.method} key={i}>
                          <pre>
                            {JSON.stringify(JSON.parse(ev.data), null, 2)}
                          </pre>
                        </Panel>
                      );
                    })}
                  </Collapse>
                </div>
              </Card>
            ) : (
              ""
            )}
          </div>
        )}
      </Spin>
    </div>
  );
}

export default styled(Main)`
  display: block;
  overflow: hidden;
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
`;
