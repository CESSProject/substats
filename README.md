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

### Online preview
We have built browsers as sample with substats framework:

<https://polkadot.cess.cloud>

and 

<https://kusama.cess.cloud>

and

<https://moonbeam.cess.cloud>


## 2. Technology stack used

### a. Back-end Node.js webserver

- Web Server:Express
- Database:Mysql/SQLite3
- Polkadot.js


### b. Front-End UI

- React.js
- Ant-design
- Less

### c. Tool Versions

- node             v16.14+
- npm              v9.2.0+
- mysql            v5.7
- docker engine    v20.10+
- docker compose   v2.12+

## 3. Install guide

> Note : This system supports MySQL and sqlite3 databases. If you want to use mysql database,please read the document [use-mysql-v5.7.md](./documents/use-mysql-v5.7.md) .

### 1). Clone code

```bash
git clone https://github.com/CESSProject/substats.git
cd substats
```

### 2). Install node modules of web server.

```bash
npm install
```

>  The front-end source code dir is "/ui",If you have modified it,you need rebuild the front-end project, please read [this document](./ui/README.md) .

### 3). Config

This project supports most of the chain of polkadot ecosystem. You can switch as long as you modify the RPC node address in the configuration file :

[/webconfig.js](https://github.com/CESSProject/substats/blob/master/webconfig.js)

And node RPC url config at :<https://github.com/CESSProject/substats/blob/a20719f77624a3f2658a3562cf041192500b7a89/webconfig.js#L13>

## 4. Test guide

```bash
npm run test
```

## 5. Run guide

```bash
npm start
```

> It will listen on the port 8080

> Open the page in browser:  [http://localhost:8080/](http://localhost:8080/)


## 6. Project file structure

```bash
├── app/                # timer app
├── package.json        # package
├── bll/                # business
├── controls/           # control layer
├── dal/                # data access layer
├── routes/             # server routes
├── ui/                 # ui
├── .gitignore          # git ignore file
├── app.js              # server main
└── web.config          # server config
```
## 7. Docker guide

You can build docker image and then run it or run image by docker compose directly.

> To simplify the docker running environment, we use the sqlite database in docker.

#### a. Build docker image
* Docker Engine Version: 20.10+
* The latest `cesslab/substats:latest` image has been pushed to docker hub

```bash
git clone https://github.com/CESSProject/substats.git
cd substats
docker build -t cesslab/substats .
```

#### b. Run demo by docker compose
* Docker Compose version v2.12+
* Change work directory to project directory, then use cmd like bellow:

> It will listen on the port 8080

```bash

docker compose -f demo/docker-compose.yml up -d
# or other version docker compose
docker-compose -f demo/docker-compose.yml up -d

```
* Open [this page](http://localhost:8080) in browser