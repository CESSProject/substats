# Review milestone 2 delivery list

| Number | Deliverable            | Specification                                                |
| ------ | ---------------------- | ------------------------------------------------------------ |
| 0a.    | License                | Apache 2.0 / GPLv3 / MIT / Unlicense                         |
| 0b.    | Documentation          | We will provide both **inline documentation** of the code and a basic **tutorial** that explains how to use the product, display and explain the function of each component. |
| 0c.    | Testing Guide          | Unit testing will be applied to ensure reliability. Documentation of tests and results will be provided. |
| 1a.    | Data Reading Module    | It contains on-chain data of blocks, addresses, transactions, events, miners. It supports network switching of Polkadot, Kusama and Rococo, for instance. |
| 1b.    | Data Processing Module | It includes synchronization for block information, miner information, account lists, on-chain power timing recording, transaction data statistics and sorting. |
| 1c.    | The API Module         | We will develop functional interfaces to return the results of data processing to front-end services in the form of a unified interface. The interface includes block information acquisition, historical statistical data acquisition, and the entire network computing power ranking. |
| 2a.    | API Documentation      | We will complete a backend API documentation explaining how the API interacts with the data. |
| 2b.    | Operation Manual       | We will write an operation manual explaining how data reading, how network switching and processing can be used. |


# Deliverables response

## 0a. License
The License file <https://github.com/CESSProject/substats/blob/master/LICENSE>

## 0b. Documentation

#### Inline documentation

We have added some annotations at the code file. Please check the code file.

#### Tutorial

- The tutorial :
> <https://github.com/CESSProject/substats/blob/master/README.md>

- The Component introduction document : 
> <https://github.com/CESSProject/substats/blob/master/documents/component-introduction.md>

## 0c. Testing Guide

The testing guide document :

 <https://github.com/CESSProject/substats/blob/master/documents/testing-guide.md>

## 1a. Data Reading Module 

The data reading module includes the reading data from the chain to the database, providing data for the front end.

#### Module of reading data from the chain to the database

When the system is running, we will run an program to obtain blockchain data.

Here is the directory

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
When running "npm start", the program will run synchronously.

The entry code of this program: 
<https://github.com/CESSProject/substats/blob/e130e6fe6d431bcd245bbedf1290ce6d4525d5e0/app.js#L22> and 
<https://github.com/CESSProject/substats/blob/e130e6fe6d431bcd245bbedf1290ce6d4525d5e0/app.js#L97>

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

This project supports most of the chain of Polkadot ecosystem. Users can switch network through modifying configuration. 

The RPC node address in the configuration file :

[/webconfig.js](https://github.com/CESSProject/substats/blob/master/webconfig.js)

And RPC node url config:

<https://github.com/CESSProject/substats/blob/a20719f77624a3f2658a3562cf041192500b7a89/webconfig.js#L13>

## 1b. Data Processing Module

> This module dir : /app/sync-block/data-process/

The functions of data processing module and the data reading module are associated. After reading the data on the chain, the data will be processed immediately and saved in the database. See 1a above.

## 1c. The API Module

#### Providing API data to the front end

This module in this directory below. 

```bash
├── controls/                                           #  The module' root directory
│   ├── param-helper.js                                 #  Request params handler
│   ├── action-helper/                                  #  Request action handler
│   ├── chain-state/                                    #  Get chain state info from chain rpc api
│   ├── public/                                         #  Public api handler
│   ├── queryDB/                                        #  Query the data from database
│   └── storage/                                        #  Query storage api from chain rpc api
│   └── chain-state/                                    #  Query chain states from chain rpc api
...
```
Example:

How to get the rank of account balance.

Request URL

```
POST /api/dbcommon/list
```
Request Body

```
{
  "tableName": "block_account",
  "sorter": [
    {
      "column": "amount",
      "order": "desc"
    }
  ],
  "pageindex": 1,
  "pagesize": 10
}
```

Response JSON

```javascript
{
    "msg": "ok",
    "data": [
        {
            "id": 225,
            "accountId": "16Xuv8TZpqSP9iSxquSJ9CQDfnJink7tFFNg8YYLqE5DiXkn",
            "amount": 2835425349163303400,
            "txCount": 0,
            "isMiner": 0
        }
        ...
    ],
    "dangerous": [],
    "pageindex": 1,
    "pagesize": 1,
    "total": 382
}
```

## 2a. API Documentation

Please read this document for the usage of  APIs :

<https://github.com/CESSProject/substats/blob/master/documents/api-docs.md>

## 2b. Operation Manual 

Operation Manual 
<https://github.com/CESSProject/substats/blob/master/README.md>

About the project
<https://github.com/CESSProject/substats/blob/master/documents/about-framework.md>