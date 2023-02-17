/*
 * @Description:
 * @Autor: fage
 * @Date: 2022-07-26 14:52:51
 * @LastEditors: lanmeng656 lanmeng656@google.com
 * @LastEditTime: 2023-02-03 15:48:50
 * @description: about
 * @author: chenbinfa
 */
import React, { useState, useEffect } from "react";
import { Button, Popover } from "antd";
import styled from "styled-components";

const SearchBar = ({ className, list }) => {
  const content = (item) => {
    return (
      <div>
        <p>{item.time}</p>
        <p>{item.v} USDT</p>
      </div>
    );
  };
  return (
    <div className={className}>
      {list.map((t,i) => {
        return (
          <Popover content={() => content(t)} key={i}>
            <span className="column" style={{height:t.p+'%'}}></span>
          </Popover>
        );
      })}
    </div>
  );
};

export default React.memo(styled(SearchBar)`
  padding: 0px;
  display: flex;
  align-items: flex-end;
  flex-direction: row;
  justify-content: space-around;
  height: 100%;
  width: 100%;
  .column {
    width: 12%;
    height: 60px;
    border-radius: 4px;
    display: block;
    background-color: #ffc7e4;
  }
  .column:hover {
    background-color: var(--theme-color);
  }
`);
