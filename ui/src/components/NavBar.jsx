/*
 * @Description:
 * @Autor: fage
 * @Date: 2022-07-19 16:25:33
 * @LastEditors: lanmeng656 lanmeng656@google.com
 * @LastEditTime: 2023-02-01 15:06:31
 * @description: about
 * @author: chenbinfa
 */
/**
 * @author fage
 * @Date: 2022-4-8
 */

import styled from "styled-components";
import _ from "lodash";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import { NavLink, useNavigate, use, useLocation } from "react-router-dom";
import { Menu } from "antd";
import React, { useRef, useState, useEffect } from "react";
import {
  HomeOutlined,
  UserOutlined,
  DownOutlined,
  DeleteOutlined,
  LoginOutlined,
  ApartmentOutlined,
  AppstoreAddOutlined,
  SwapOutlined,
  DatabaseOutlined,
  WalletOutlined,
} from "@ant-design/icons";

const navBtn = [
  {
    path: "/",
    name: "Home",
    icon: <HomeOutlined />,
  },
  {
    path: "/block/",
    name: "Blocks",
    icon: <AppstoreAddOutlined />,
  },
  {
    path: "/transfer/",
    name: "Transactions",
    icon: <SwapOutlined />,
  },
  {
    path: "/account/",
    name: "Accounts",
    icon: <WalletOutlined />,
  },
];

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const items = [
  getItem(
    "HOME",
    "/",
    <img width={18} src={process.env.PUBLIC_URL + "/img/home.png"} />
  ),
  getItem(
    "CHAIN",
    "chain",
    <img width={18} src={process.env.PUBLIC_URL + "/img/tech.png"} />,
    [
      getItem("Blocks", "/block/"),
      getItem("Transactions", "/transfer/"),
      getItem("Accounts", "/account/"),
    ]
  ),
];

function Header({ className }) {
  const navigate = useNavigate();
  let location = useLocation();
  const [selKey, setSelKey] = useState("/");
  const onClick = ({ key, keyPath, domEvent }) => {
    // console.log("click ", item, key, keyPath, domEvent);
    if (key) {
      navigate(key);
    }
  };

  useEffect(() => {
    // console.log(location);
    let p = location.pathname;
    if (p.indexOf("/block/") == 0) {
      p = "/block/";
    } else if (p.indexOf("/transfer/") == 0) {
      p = "/transfer/";
    } else if (p.indexOf("/account/") == 0) {
      p = "/account/";
    }
    setSelKey(p);
  }, [location]);

  return (
    <div className={className}>
      <div
        className="abs-header"
        style={{ height: document.body.clientHeight }}
      >
        <div className="header-content">
          <span className="logo-txt">
            <NavLink to="/">
              <img width={170} src={process.env.PUBLIC_URL + "/img/logo.png"} />
            </NavLink>
          </span>
          <Menu
            onClick={onClick}
            style={{
              width: 210,
              border: "none",
              backgroundColor: "#fff",
            }}
            defaultOpenKeys={["chain"]}
            selectedKeys={[selKey]}
            mode="inline"
            items={items}
          />
        </div>
        <a
          className="nav-bottom-link"
          href="https://substats.cess.cloud/"
          target="_blank"
        >
          Powered by Substats
        </a>
      </div>
    </div>
  );
}

export default styled(Header)`
  display: block;
  overflow: hidden;
  position: relative;
  top: 0;
  .abs-header {
    display: block;
    overflow: hidden;
    width: 250px;
    height: 100%;
    line-height: 30px;
    background-color: #fff;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 999;
    padding: 10px;
    .ant-menu-sub.ant-menu-inline {
      background-color: #fff !important ;
    }
    .ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected {
      background-color: rgba(51, 51, 51, 1) !important ;
      color: #fff;
      border-radius: 6px;
      height: 54px;
      line-height: 54px;
    }
    .header-content {
      a {
        color: #333;
        text-decoration: none;
        padding-right: 0px;
        font-size: 17px;
      }
      padding: 0 0px;
      display: block;
      overflow: hidden;
      text-align: left;
      color: #333;
      span a {
        display: block;
        overflow: hidden;
        clear: both;
        padding: 0 10px;
      }
    }
    .logo-txt {
      background-color: #fff;
      display: block;
      padding: 10px 10px 17px;
      a {
        font-size: 24px;
      }
    }
    .nav-bottom-link {
      width: 160px;
      display: block;
      overflow: hidden;
      position: absolute;
      left: 20px;
      bottom: 30px;
      text-align: left;
      background-color: #7352ce;
      color: #fff;
	  text-align: center;
	  border-radius: 8px;
    }
  }
`;
