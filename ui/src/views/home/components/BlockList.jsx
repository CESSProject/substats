/*
 * @Description:
 * @Autor: fage
 * @Date: 2022-07-26 14:52:51
 * @LastEditors: lanmeng656 lanmeng656@google.com
 * @LastEditTime: 2023-02-03 16:07:59
 * @description: about
 * @author: chenbinfa
 */
import React, { useState, useEffect } from "react";
import { ClockCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";
import _ from "lodash";
import moment from "moment";
import styled from "styled-components";
import {
  useNavigate,
  NavLink,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { formatDataSource } from "@/utils";

const Main = ({ className, list }) => {
  const navigate = useNavigate();
  if (!list) return "";
  list.forEach((t) => {
    t.timestamp_str = moment(t.timestamp).fromNow();
  });
  return (
    <div className={className}>
      {list.map((t, i) => {
        return (
          <div
            className="line"
            key={i}
            onClick={() => navigate("/block/" + t.blockHeight)}
          >
            <div className="line-left">
              <div>
                <b>Block#</b>
                <font className="main-font">{t.blockHeight}</font>
              </div>
              <div>
                <font className="main-font">{t.txCount}</font> Transcations{" "}
                <font className="main-font">{t.eventCount}</font> Events
              </div>
            </div>
            <div className="line-right">
              <span>
                <CheckCircleOutlined style={{ color: "green", fontSize: 20 }} />
              </span>
              <div>{t.timestamp_str}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default React.memo(styled(Main)`
  display: block;
  overflow: hidden;
  width: 100%;
  height: 446px;
  .line {
    display: block;
    overflow: hidden;
    width: 100%;
    border-bottom: 1px solid #eee;
    padding: 10px;
    cursor:pointer;
    .line-left {
      width: 70%;
      display: block;
      overflow: hidden;
      float: left;
      font-size: 14px;
      font {
        line-height: 27px;
        font-size: 12px;
      }
    }
    .line-right {
      width: 30%;
      display: block;
      overflow: hidden;
      float: right;
      text-align: right;
      font-size: 14px;
      font-weight: bold;
    }
  }
`);
