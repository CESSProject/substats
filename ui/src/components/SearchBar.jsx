/*
 * @Description:
 * @Autor: fage
 * @Date: 2022-07-26 14:52:51
 * @LastEditors: lanmeng656 lanmeng656@google.com
 * @LastEditTime: 2023-02-02 14:31:09
 * @description: about
 * @author: chenbinfa
 */
import React, { useState, useEffect } from "react";
import {
  Button,
  Col,
  DatePicker,
  Table,
  Input,
  Row,
  Select,
  message,
  Modal,
} from "antd";
import {
  SearchOutlined,
  RedoOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import storageAJAX from "@services/storage";
import _ from "lodash";
import moment from "moment";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const { Option } = Select;
const { Search } = Input;
let ignore = false;

const SearchBar = ({ className }) => {
  const [keyword, setKeyword] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchType, setSearchType] = useState("All");
  const [loading, setLoading] = useState(false);
  const [space, setSpace] = useState({
    used: 0,
    idle: 0,
    total: 0,
    totalGiB: 0,
  });
  const navigate = useNavigate();

  async function getStore() {
    if (ignore || loading) return;
    setLoading(true);
    let result = await storageAJAX({ ac1: "sminer", ac2: "totalServiceSpace" });
    if (result.msg != "ok") {
      setLoading(false);
      return;
    }
    const used = result.data;
    if (ignore) {
      setLoading(false);
      return;
    }
    result = await storageAJAX({ ac1: "sminer", ac2: "totalIdleSpace" });
    setLoading(false);
    if (result.msg != "ok") {
      return;
    }
    const idle = result.data;
    if (ignore) return;
    const total = used + idle;
    const totalGiB = total / 1073741824;
    console.log("totalGiB", totalGiB);
    setSpace({
      used,
      idle,
      total,
      totalGiB,
    });
  }

  useEffect(() => {
    ignore = false;
    getStore();
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    let pathArr = window.location.pathname.split("/");
    if (pathArr.length == 3) {
      let type = pathArr[1];
      let v = pathArr[2];
      if (type == "block") {
        type = "Block";
      } else if (type == "transfer") {
        type = "Transfer";
      } else if (type == "account") {
        type = "Account";
      } else {
        type = "All";
      }
      setSearchType(type);
      setKeyword(v);
    }
  }, []);

  const onSearch = (e) => {
    if (e.code && e.code == "Enter" && e.target.value) {
      setKeyword(e.target.value);
    }
    let type = getSearchType();
    setSearchType(type);
    let url = "/" + type.toLowerCase() + "/" + keyword;
    navigate(url);
  };
  const getSearchType = () => {
    let type = "Transfer";
    if (keyword.indexOf("cX") == 0) {
      type = "Account";
    } else if (keyword.length < 15 && !isNaN(keyword)) {
      type = "Block";
    }
    return type;
  };
  const onChangeType = (value) => {
    setSearchType(value);
  };
  const onChangeKeyword = (e) => {
    setKeyword(e.target.value);
  };

  const getPrice = (store, type) => {
    let v = 1000 + (store * 10000) / space.totalGiB;
    if (type == 2) {
      v = v / store;
    }
    return v.toFixed(2) + "  DOT";
  };

  return (
    <div className={className}>
      <div className="search-content">
        <div className="big-title block">
          <div className="big-title-txt block">
            The Polkadot Blockchain Explorer
          </div>
        </div>
        <Search
          className="search-box"
          placeholder="Block Height/Transaction Hash/Account"
          onSearch={onSearch}
          onPressEnter={onSearch}
          allowClear
          value={keyword}
          bordered={false}
          width="100%"
          onChange={onChangeKeyword}
          style={{
            borderRadius: "10px",
            border: "1px solid #ddd",
            backgroundColor: "#fff",
            overflow: "hidden",
            width: "100%",
          }}
          id="searchInput"
          size="large"
        />
      </div>
    </div>
  );
};

export default React.memo(styled(SearchBar)`
  background-color: #e6007a;
  width: 100%;
  display: block;
  overflow: hidden;
  .search-content {
    width: 70%;
    display: block;
    overflow: hidden;
    margin: 50px auto;
    max-width: 710px;
  }
  @media screen and (max-width: 900px) {
    .top-price-btn {
      position: relative !important;
      width: 100% !important;
      margin: 20px auto 0;
      padding: 5px 10px;
    }
  }
  .search-box {
    max-width: 700px;
  }
  .big-title {
    font-family: "Microsoft YaHei";
    .big-title-txt {
      font-size: 23px;
      color: #fff;
      font-weight: bold;
      line-height: 50px;
    }
  }
  .ant-input-group-addon button {
    border: none !important;
    color: rgb(69 148 255) !important;
  }
`);
