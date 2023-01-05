# Substats (blockchain browser)

## 1. About
We have designed a set of explorer modular components for the Substrate ecosystem, which can be used by stakeholders (such as miners and storage users) and other users. Users can inquire about basic information in the network, such as space information, rankings, blocks, transactions, addresses, visual trend charts, etc. Substats is open-source and has flexible scalability in both network and its functionalities. Hence early-stage projects or individual developers can easily integrate our components based on their business needs. The data analysis module and custom components are the two core functions of Substats.

#### **Features**

● **On-chain data processing station**: A processing station is built between users and the blockchain network, which includes a cache (database) layer and a computing (data processing) layer. The cache layer is responsible for pulling the data on the chain to the local database for storage. The computing layer is responsible for processing the on-chain data in the database, so that it can be combined into more meaningful data for users, such as historical data statistics, network-wide computing power rankings, etc.

● **Convenient data display and retrieval**: Compared with reading blockchain network data through RPC nodes, it is more convenient and faster for the client's wxplorer to read directly in the database of the processing station built by Substats.

● **One-click construction**: Learn from the features of Polkadot.js App. The Substats framework only needs to configure a small amount of information to achieve one-click deployment and startup. Significantly reduce development costs.

● **Open source and security**: Substats only provides completely open source code, and is not responsible for replacing management and operation services. All services are deployed and operated by the project party, avoiding trust costs.

### More documents

- [about-framework](./documents/about-framework.md)
- [api-docs](./documents/api-docs.md)
- [database-init](./documents/database-init.sql)
- [testing-guide](./documents/testing-guide.md)




## 2. Technology stack used

### a. Node.js API

- Web Server:Express
- Database:Mysql/SQLite3
- Polkadot.js

### b. Tool Versions

- node         v16.14+
- npm          v9.2.0+
- mysql        v5.7
- docker       v2.12+

## 3. Install guide

> Note : This system supports MySQL and sqlite3 databases. If npm start with a MySQL account config file, use MySQL else use sqlite3 database.

### 1). Install database if use mysql
- create a database with name "substats-w3f";
- run the sql file [database-init](./documents/database-init.sql)
- make database config file and content as:
```javascript
{
  "connectionLimit": 10,
  "host": "127.0.0.1",
  "user": "substats",
  "password": "Ni6eY85EXM6ZrMLG@",
  "port": 3306,
  "database": "substats"
}
```

### 2). Install API server

```bash
git clone https://github.com/CESSProject/substats.git
cd substats
npm install // or yarn
```


## 4. Test guide

```bash
npm run test
```

## 5. Run guide

### 1). Run API server

```bash
npm start  //will use the sqlite3 database.

// or run whith custom database config file
npm start ./mysql-config.json    //will use the mysql database.
```

> It will listen on the port 8080

> Note : If npm start with a MySQL account config file, use MySQL , else use the sqlite3 database.


## 6. Inspect the system status
Open the page in browser: 

[http://localhost:8080/system-status.html]([http://localhost:8080/system-status.html])


## 7. Project file structure

```bash
├── app/                #  timer app
├── package.json        #  package
├── bll/                # business
├── controls/           # control layer
├── dal/                # data Access Layer
├── routes/             # server routes
├── .gitignore          # git ignore file
├── app.js              # server main
└── web.config          # server config
```
## 8. Docker guide

You can build docker image and then run it or run image by docker compose directly.

#### 1. Build docker image
* Docker Engine Version: 20.10+
* The latest `cesslab/substats:latest` image has been pushed to docker hub
```bash
git clone https://github.com/CESSProject/substats.git
cd substats
docker build -t cesslab/substats .
```
#### 2. Run demo by docker compose
* Docker Compose version v2.12+
* Change work directory to project directory, then use cmd like bellow:

> It will listen on the port 8080

```bash
docker compose -f demo/docker-compose.yml up -d
```
* Open [this page](http://localhost:8080/system-status.html) in browser
