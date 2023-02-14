/*
 * @Description:
 * @Autor: fage
 * @Date: 2022-07-26 14:52:51
 * @LastEditors: lanmeng656 lanmeng656@google.com
 * @LastEditTime: 2023-02-14 17:19:43
 * @description: about
 * @author: chenbinfa
 */
import React, { useState, useEffect } from "react";
import {
  Button,
  Col,
  Spin,
  DatePicker,
  Input,
  Row,
  Select,
  message,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import _ from "lodash";
import moment from "moment";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Line } from "@ant-design/plots";
import queryDB from "@services/queryDB";
import "@ant-design/flowchart/dist/index.css";
let ignore = false;

async function ajax() {
  let params = {
    tableName: "trend",
    pagesize: 10,
    pageindex: 1,
    filter:[
      {
        column: "catId",
        sign: "=",
        values: [1],
      },
    ],
    sorter:[{
      column:'dateStr',
      order:'desc'
    }]
  };
  let result = await queryDB.list(params);
  return result.data;
}

const SearchBar = ({ className, space }) => {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);

  useEffect(() => {
    ignore = false;
    async function run() {
      if (ignore) return;
      let result = await ajax();
      if (ignore) return;
      setList(result);
    }
    run();
    return () => {
      ignore = true;
    };
  }, []);
  const config = {
    height: 225,
    data:list,
    padding: "auto",
    xField: "dateStr",
    yField: "dataValue",
    // smooth: true,
    xAxis: {
      // type: 'timeCat',
      tickCount: 5,
    },
    color: "#e6007a",
    point: {
      size: 3,
      shape: "circular",
      style: {
        fill: "white",
        stroke: "#5B8FF9",
        lineWidth: 1,
      },
    },
    tooltip: {
      showMarkers: false,
    },
    state: {
      active: {
        style: {
          shadowBlur: 4,
          stroke: "#000",
          fill: "red",
        },
      },
    },
    interactions: [
      {
        type: "marker-active",
      },
    ],
  };

  return (
    <div className={className}>
      <div className="box-title block">Transaction Trend</div>
      <div className="box-con block">
        <Line {...config} />
      </div>
    </div>
  );
};

export default React.memo(styled(SearchBar)`
  padding: 0px;
  width: 100%;
  display: block;
  overflow: hidden;
  clear: both;
  background-color: rgba(51, 51, 51, 1);
  border-radius: 6px;
  margin-top: 20px;
  .block {
    display: block;
    overflow: hidden;
    clear: both;
  }
  .box-title {
    color: #fff;
    font-size: 22px;
    line-height: 47px;
    text-indent: 13px;
  }
  .box-con {
    background-color: #fff;
    border-radius: 6px;
    margin: 0 15px 15px;
    padding: 10px;
  }
`);
