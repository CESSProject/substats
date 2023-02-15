/*
 * @Description:
 * @Autor: fage
 * @Date: 2022-07-26 14:52:51
 * @LastEditors: lanmeng656 lanmeng656@google.com
 * @LastEditTime: 2023-02-14 17:19:32
 * @description: about
 * @author: chenbinfa
 */
import React, { useState, useEffect } from "react";
import _ from "lodash";
import moment from "moment";
import styled from "styled-components";
import { Line } from "@ant-design/plots";
import queryDB from "@services/queryDB";
import "@ant-design/flowchart/dist/index.css";
import Column from "./Column";
import webconfig from "@/webconfig";
let ignore = false;

const SearchBar = ({ className, space }) => {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [lastItem, setLastItem] = useState({});

  async function ajax() {
    let params = {
      tableName: "trend",
      pagesize: 7,
      pageindex: 1,
      filter: [
        {
          column: "catId",
          sign: "=",
          values: [2],
        },
      ],
      sorter: [
        {
          column: "id",
          order: "desc",
        },
      ],
    };
    let result = await queryDB.list(params);    
    let max = result.data.sort((t1, t2) => t2.dataValue - t1.dataValue)[0]
      .dataValue;
    let min = result.data.sort((t1, t2) => t1.dataValue - t2.dataValue)[0]
      .dataValue;
    console.log("max", max);
    console.log("min", min);
    result.data.sort((t1, t2) => (t1.id - t2.id));
    let lastItem = result.data[result.data.length-1];
    let lastItem2 = result.data[result.data.length-2];
    let lastPer=((lastItem.dataValue-lastItem2.dataValue)/lastItem2.dataValue)*100;
    lastItem.per=lastPer.toFixed(2);
    setLastItem(lastItem);
    return result.data.map((t) => {
      console.log("t.dataValue", t.dataValue);
      let per = ((t.dataValue - min) / (max - min)) * 100;
      let p = (((per + 20) / 120) * 100).toFixed(2);
      return {
        time: t.dateStr+'*'+t.id,
        v: t.dataValue,
        p,
      };
    });
  }

  useEffect(() => {
    ignore = false;
    async function run() {
      if (ignore) return;
      setLoading(true);
      let result = await ajax();
      setLoading(false);
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
    data: list,
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
      <div className="box-title">Overview</div>
      <div className="box1">
        <div className="box1-left">
          <div className="block">{webconfig.name} / USDT</div>
          <span className="block">{lastItem.dataValue}</span>
          <label className="block">{lastItem.per}%</label>
        </div>
        <div className="box1-right">
          <Column list={list} />
        </div>
      </div>
    </div>
  );
};

export default React.memo(styled(SearchBar)``);
