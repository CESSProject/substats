# Components introduction


### The system mainly includes the following components:

- 1. Database reset component

- 2. Blockchain data synchronization component

- - 2.1. On-chain data reading subassembly

- - 2.2. Block data processing sub-component

- - 2.3. Block data saving subcomponent

- 2. Database adapter component

- 3. Front-end API components




These components are part of the whole project. They cannot be run separately except for the database reset component and the blockchain data synchronization component.

These components are described below

### 1. Database reset component


Source code directory:/app/db batch/truncate block list. js

Operation method:



``` javascript

npm run reset

// or

node ./ app/db-batch/truncate-block-list.js

```



Function introduction: clear the local database, including block information table, transaction record table, events record table, account list table, and finally shrink the database idle space



### 2. Blockchain data synchronization component



Source code directory:/app/sync-block/

Operation method:



``` javascript

npm run app

// or

node ./ app/index.js

```

Function introduction: Get the original block data from the blockchain, synchronize the block information, process and save it to the database. The specific sub-components are as follows:


##### 2.1. Block data acquisition component

Source code directory:/app/sync-block/hain-querier/

Operation method: cannot run independently

Function introduction: obtain block original data from the blockchain and synchronize block information


##### 2.2. Block data processing component

Source code directory:/app/sync block/data process/

Operation method: cannot run independently

Function description: process the synchronized block data, and analyze the block information metadata, transaction list, events, account, etc


##### 2.3. Block data saving component

Source code directory:/app/sync block/data store/

Operation method: cannot run independently

Function introduction: save the processed data in 2.2 to the database for front-end query and display.

### 5. Front-end API components

Source code directory:/app/controls/

Run method: cannot run independently. You can use tools such as postman to send HTTP requests. For details, see the API documentation:/ document/api-docs.md

Function description: API components provided by the front end can obtain data through http requests.