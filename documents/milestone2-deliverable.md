# Review milestone 2 deliver list

| Number | Deliverable            | Specification                                                                                                                                                                                                                                                                           |
|--------|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 0a.    | License                | Apache 2.0 / GPLv3 / MIT / Unlicense                                                                                                                                                                                                                                                    |
| 0b.    | Documentation          | We will provide both **inline documentation** of the code and a basic **tutorial** that explains how to use the product, display and explain the function of each component.                                                                                                            |
| 0c.    | Testing Guide          | Unit testing will be applied to ensure reliability. Documentation of tests and results will be provided.                                                                                                                                                                                |
| 1a.    | Data Reading Module    | It contains on-chain data of blocks, addresses, transactions, events, miners. It supports network switching of Polkadot, Kusama and Rococo, for instance.                                                                                                                               |
| 1b.    | Data Processing Module | It includes synchronization for block information, miner information, account lists, on-chain power timing recording, transaction data statistics and sorting.                                                                                                                          |
| 1c.    | The API Module         | We will develop functional interfaces to return the results of data processing to front-end services in the form of a unified interface. The interface includes block information acquisition, historical statistical data acquisition, and the entire network computing power ranking. |
| 2a.    | API Documentation      | We will complete a backend API documentation explaining how the API interacts with the data.                                                                                                                                                                                            |
| 2b.    | Operation Manual       | We will write an operation manual explaining how data reading, how network switching and processing can be used.                                                                                                                                                                        |


# Deliverables response

## 0a. License
The License file <https://github.com/CESSProject/substats/blob/master/LICENSE>

## 0b. Documentation

#### Inline documentation

We have added a lot of code comments to the code. Please check the code file for details, such as [here](https://github.com/CESSProject/substats/blob/master/app.js), 
[here](https://github.com/CESSProject/substats/blob/master/controls/queryDB/common.js), , and so on.

#### Tutorial

- The tutorial :
> <https://github.com/CESSProject/substats/blob/master/README.md>

- The Component introduction document : 
> <https://github.com/CESSProject/substats/blob/documents/component-introduction.md>

## 0c. Testing Guide

The test guide document : <https://github.com/CESSProject/substats/blob/master/documents/testing-guide.md>

## 1a. Data Reading Module 

The data reading module includes the module that reads data from the chain to the database and the data provider that provides data for the front end

#### Module to read data from the chain to the database

When the system is running, we will run an application to obtain blockchain data from the chain. Here is the directory
```bash
├── app/                                                 #  The applications base directory
│   ├── index.js                                         #  Entry file
│   ├── init.js                                          #  Init config and connect to the chain rpc api
│   ├── db-batch/                                        #  Database batch operation tool
│       └── truncate-block-list.js                       #  Reset database tool
│   └── sync-block/                                      #  This is a application for synchronizing blockchain data to local database
│       ├── chain-queryer                                   #  Account handler
│       ├── data-process                                     #  Main application for synchronizing blockchain data as blocks, account, transactions, events.
│       └── data-store                           #  For show a block data to debug
...
```
When running "npm start", this program will also start with it.

The calling entry code of this program is here : 
<https://github.com/CESSProject/substats/blob/a20719f77624a3f2658a3562cf041192500b7a89/app.js#L22> and 
<https://github.com/CESSProject/substats/blob/a20719f77624a3f2658a3562cf041192500b7a89/app.js#L93>

If you need to run it separately, execute the following command

Reset the database

``` javascript
npm run reset
// or
node ./app/db-batch/truncate-block-list.js
```

Start sync block info
``` javascript
npm run app
// or
node ./app/index.js
```

#### Network switching configuration

This project supports most of the chain of polkadot ecosystem. You can switch as long as you modify the RPC node address in the configuration file :

[/webconfig.js](https://github.com/CESSProject/substats/blob/master/webconfig.js)

And node RPC url config at :<https://github.com/CESSProject/substats/blob/a20719f77624a3f2658a3562cf041192500b7a89/webconfig.js#L13>

## 1b. Data Processing Module

> This module dir : /app/sync-block/data-process/

The data processing module and the data reading module are put together. After reading the data on the chain, the data will be processed immediately and saved in the database. See 1a above.

## 1c. The API Module

#### Data provider providing data for the front end

This module is in this directory. Please see the following directory tree introduction

```bash
├── controls/                                           #  The module base directory
│   ├── param-helper.js                                 #  request params handler
│   ├── action-helper/                                  #  request action handler
│   ├── chain-state/                                    #  Get chain state info from chain rpc api
│   ├── public/                                         #  Public api handler
│   ├── queryDB/                                        #  Query the data from database
│   └── storage/                                        #  Query storage api from chain rpc api
│   └── chain-state/                                    #  Query chain states from chain rpc api
...
```

## 2a. API Documentation

Please read this document for the usage of these APIs : <https://github.com/CESSProject/substats/blob/master/documents/api-docs.md>

## 2b. Operation Manual 

Operation Manual 
<https://github.com/CESSProject/substats/blob/master/README.md>

About the project
<https://github.com/CESSProject/substats/blob/master/documents/about-framework.md>





