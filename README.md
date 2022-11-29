# Substats (blockchain browser)

## 1. About
We have designed a set of explorer modular components for the Substrate ecosystem, which can be used by stakeholders (such as miners and storage users) and other users. Users can inquire about basic information in the network, such as space information, rankings, blocks, transactions, addresses, visual trend charts, etc. Substats is open-source and has flexible scalability in both network and its functionalities. Hence early-stage projects or individual developers can easily integrate our components based on their business needs. The data analysis module and custom components are the two core functions of Substats.

#### **Features**

● **On-chain data processing station**: A processing station is built between users and the blockchain network, which includes a cache (database) layer and a computing (data processing) layer. The cache layer is responsible for pulling the data on the chain to the local database for storage. The computing layer is responsible for processing the on-chain data in the database, so that it can be combined into more meaningful data for users, such as historical data statistics, network-wide computing power rankings, etc.

● **Convenient data display and retrieval**: Compared with reading blockchain network data through RPC nodes, it is more convenient and faster for the client's wxplorer to read directly in the database of the processing station built by Substats.

● **One-click construction**: Learn from the features of Polkadot.js App. The Substats framework only needs to configure a small amount of information to achieve one-click deployment and startup. Significantly reduce development costs.

● **Modular UI components**: The UI components of Substats are all decoupled, allowing developers to customize the development of UI components with low threshold.

● **Open source and security**: Substats only provides completely open source code, and is not responsible for replacing management and operation services. All services are deployed and operated by the project party, avoiding trust costs.

### More documents

- [about-system](./documents/about-system.md)
- [about-framework](./documents/about-framework.md)
- [api-docs](./documents/api-docs.md)
- [database-init](./documents/database-init.sql)
- [about-ui](./documents/about-ui.md)
- [about-components](./documents/about-components.md)
- [testing-guide](./documents/testing-guide.md)


## 2. Technology stack used

### 1) Node.js API

- Server:Express
- Database:Mysql
- Polkadot

### 2) frontend UI

- React
- Ant-design
- Ant-design/charts
- React-router-dom
- Styled-components
- Reduxjs/toolkit

## 3. Install guide

### 1) Install database
- create a database with name "substats-w3f";
- run the sql file [database-init](./documents/database-init.sql)
- make database config file and content as:
```
{
  "connectionLimit": 10,
  "host": "127.0.0.1",
  "user": "substats",
  "password": "Ni6eY85EXM6ZrMLG",
  "port": 3306,
  "database": "substats"
}
```
- edit the config file of "/webconfig.js" and change config path at the line 25

### 2) Install API server

```
npm install
// or
yarn install
```

### 3) Install frontend UI

```
cd ui
npm install
// or
yarn install
```

## 4. Run guide

### 1) Run API server

```
npm run start
// or
yarn run start
```
### 2) Run frontend UI

```
npm run start:ui
// or
yarn run start:ui
```

## 5. Project file structure

```
├── app/                #  timer app
├── package.json        #  package
├── bll/                # business
├── controls/           # control layer
├── dal/                # data Access Layer
├── routes/             # server routes
├── ui                  # web ui (react)
│   ├── build/          # builded file
│   ├── public/         # static asset
│   ├── src/            # react source code
├── .gitignore          # git ignore file
├── app.js              # server main
└── web.config          # server config
```

