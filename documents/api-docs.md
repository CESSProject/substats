# API Doc


## Data dictionary

Get all dictionary list.

### Request URL

```
POST /api/dics/list
```
### Request Body

```
// no params
```

### Response JSON format as:

```
{
    "msg": "ok",
    "data": [
        {
            "id": 1,
            "name": "status",
            "about": null,
            "items": [
                {
                    "id": 1,
                    "category_id": 1,
                    "sort_id": 1,
                    "value": 1,
                    "label": "doing",
                    "about": null,
                    "color": "red",
                    "icon": null,
                    "add_time": "2022-07-21T07:58:18.000Z",
                    "update_time": "2022-07-21T07:58:18.000Z"
                },
                ......
            ]
        }
    ]
}
```


-------------------------------------------------


## Chain state query

Query state info from chain.

API as [https://testnet.cess.cloud/#/chainstate](https://testnet.cess.cloud/#/chainstate)

### Request URL

```
POST /api/storage/query
```
### Request Body

```
{
    "ac1": "timestamp",
    "ac2": "now"
}
```
or 

```
{
    "ac1": "system",
    "ac2": "eventCount"
}
```
or other chain api


### Response JSON as 

```
{
    "msg": "ok",
    "data":29
}
```


-------------------------------------------------




## Chain consts

Node const query

API as [https://testnet.cess.cloud/#/chainstate/constants](https://testnet.cess.cloud/#/chainstate/constants)

### Request URL

```
POST /api/chainStateConsts/consts
```
### Request Body

```
{
    "ac1": "system",
    "ac2": "blockWeights"
}
```

other ac1 and ac2 enable values as:

| ac1                | ac2                      |
|--------------------|--------------------------|
| system             | blockWeights             |
| transactionPayment | operationalFeeMultiplier |

or other chain api



### Response JSON as:

```
{
    "msg": "ok",
    "data": {
        "baseBlock": "5,000,000,000",
        "maxBlock": "2,000,000,000,000",
        "perClass": {
            "normal": {
                "baseExtrinsic": "125,000,000",
                "maxExtrinsic": "1,299,875,000,000",
                "maxTotal": "1,500,000,000,000",
                "reserved": "0"
            },
            "operational": {
                "baseExtrinsic": "125,000,000",
                "maxExtrinsic": "1,799,875,000,000",
                "maxTotal": "2,000,000,000,000",
                "reserved": "500,000,000,000"
            },
            "mandatory": {
                "baseExtrinsic": "125,000,000",
                "maxExtrinsic": null,
                "maxTotal": null,
                "reserved": null
            }
        }
    }
}
```


-------------------------------------------------



## Query list

Query list from database

### Request URL

```
POST /api/dbcommon/list

```

### Request Body

```
{
  "tableName": "block_info",
  "pageindex": 1,
  "pagesize": 10
}
```

The param tableName value as :

- block_account
- block_event
- block_info
- block_transaction
- dictionary
- dictionary_category
- miner
- miner_summary


### Response JSON as :

```
{
    "msg": "ok",
    "data": [
        {
            "id": 1813,
            "collateralAccounts": "cXjmjy7XsySUBGdbNaFXihuZGDuTvwPRF3dgkF58xFPgxaDpF",
            "collateralAccountCount": 1,
            ......
        }
        ......
    ],
    "dangerous": [],
    "pageindex": 1,
    "pagesize": 10,
    "total": 1813
}
```


-------------------------------------------------



## Query detail

Query detail from database

### Request URL

```
POST /api/dbcommon/detail

```

### Request Body

```
{
  "tableName": "block_info",
  "id": 1
}
```

The id is item id number.

The param tableName value as :

- block_account
- block_event
- block_info
- block_transaction
- dictionary
- dictionary_category
- miner
- miner_summary


### Response JSON

```
{
    "msg": "ok",
    "data": {
        "id": 1,
        "hash": "0xc0096358534ec8d21d01d34b836eed476a1c343f8724fa2153dc0725ad797a90",
        "signerAccount": null,
        "parentHash": "0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3",
        "blockHeight": 1,
        "txCount": null,
        "eventCount": null,
        "timestamp": 1590507378000
    }
}
```
