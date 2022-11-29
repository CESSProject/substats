# Test guide

## Tool 
Jest is Created by Facebook,  It is currently the dominant testing framework.
This project also uses the Jest framework for unit testing.

## Config

You can edit the config file [/jest.config.js](/jest.config.js).

```javascript
module.exports = {
  collectCoverage: false,
  collectCoverageFrom: [ "controls/**/*", "util/*", "bll/*"],
  testTimeout: 90000,
};

```

## How to start：

### 1. Install package
```javascript
npm i
```
### 2. Run test

```javascript
npm run test
```