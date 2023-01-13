# Test guide

## Tool of jest
Jest is Created by Facebook,  It is currently the dominant testing framework.
This project also uses the Jest framework for unit testing.

## Config

You can edit the config file [/jest.config.js](/jest.config.js).

```javascript
module.exports = {
  collectCoverage: true, //make a coverage
  collectCoverageFrom: [ "controls/**/*", "util/*", "bll/*", "dal/*", "routes/*"], // test dir
  testTimeout: 90000, // run time out
};

```

## How to start：

### 1. Install package
```javascript
npm i
```
or 
```javascript
yarn
```

### 2. Run test

```javascript
npm run test
```
or 
```javascript
yarn run test
```