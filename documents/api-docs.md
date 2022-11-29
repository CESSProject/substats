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

### Response JSON

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
    "ac1": "fileBank",
    "ac2": "purchasedPackage"
}
```

ac1 and ac2 enable values


| ac1       | ac2              |
|-----------|------------------|
| fileBank  | purchasedPackage |
| timestamp | now              |
| fileBank  | fileIndexCount   |
| fileBank  | unitPrice        |
| fileBank  | members          |



### Response JSON

```
{
    "msg": "ok",
    "data": [
        {
            "tenancy": 1,
            "packageType": 3,
            "start": 234280,
            "deadline": 1098280,
            "state": "0x6e6f726d616c",
            "key": "cXiqEEbT38JCMRfX5NCm84WGF3M3Soxc3hVkJdDPuZGwXq8qe"
        },
        ......
    ]
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

ac1 and ac2 enable values


| ac1                | ac2                      |
|--------------------|--------------------------|
| system             | blockWeights             |
| timestamp          | miniumPeriod             |
| transactionPayment | operationalFeeMultiplier |
| sminer             | itemLimit                |



### Response JSON

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
  "tableName": "miner_summary",
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
- storage_power_trend


### Response JSON

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
  "tableName": "miner_summary",
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


### Response JSON

```
{
    "msg": "ok",
    "data": {
        "id": 1,
        "collateralAccounts": "cXf5twq4D6TmZ78nQkLymW5NJUF7awiAseXHsY6HJD7aY32Bm",
        "collateralAccountCount": 1,
        "beneficiaryAccount": "cXiD1Rz3XFPH4tDGMmMCScXR7a89iCEr4NDp5Kjyq2hRYN5g7",
        "collaterals": 2305843009213694000,
    }
}
```
