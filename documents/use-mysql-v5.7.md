
# If use mysql database

This system supports MySQL and sqlite3 databases. If npm start with a MySQL account config file, use MySQL else use sqlite3 database.

## 1. Versions

- mysql v5.7


## 2. Install database

- create a database with name "substats-w3f";
- run the sql file [database-init](./database-init.sql)
- make database config file and content as:
```javascript
{
  "connectionLimit": 10,
  "host": "127.0.0.1",
  "user": "substats",
  "password": "kZtRazdBsxy3d2zs",
  "port": 3306,
  "database": "substats"
}
```

## 3. Run

```bash
npm start ./mysql-config.json  # the last avg is mysql config file path
```