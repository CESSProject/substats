
# How to customize and extend components

Substats source code is based on polkadot. Developers can modify the code to get data from other chains.

## 1. Modify the RPC node address

This project supports most of the chain of polkadot ecosystem. Developers can modify the RPC node address in the configuration file:

[/webconfig.js](https://github.com/CESSProject/substats/blob/master/webconfig.js)

RPC url config :<br /> <https://github.com/CESSProject/substats/blob/a20719f77624a3f2658a3562cf041192500b7a89/webconfig.js#L13>

## 2. Modify the token price address
<https://github.com/CESSProject/substats/blob/a20719f77624a3f2658a3562cf041192500b7a89/webconfig.js#L24>


## 3. Clean the database

``` bash
npm run reset
```

## 4. Modify UI

The main color and the logo could be modified.
At the same times, the components could be extended.

The source code in /ui/src/

```bash
├──ui/
    ├── build/                # dist dir
    ├── package.json          # package.json file
    ├── public/               # statics file
    └── src/                  # source code file
        ├── components        # all components file
        ├── services          # api services
        └── views             # jsx pages
```

#### a. Modify the main color

The main color: #e6007a

You can modify the color in this file

[/ui/src/index.less#L14](https://github.com/CESSProject/substats/blob/master/ui/src/index.less#L14)

#### b. Modify the project LOGO

Modify the logo image：
```bash
/ui/public/favicon.ico
/ui/public/img/logo.png
/ui/public/img/u218.png
```
#### c. Configure the name of chain

Configure the name of chain in this file：
```bash
# /ui/src/webconfig.js
export default { 
    name:"Polkadot", # blockchain name
    tokenName:'DOT'  # token name
 };
```
#### d. Modify components

```bash
/ui/src/components
```
If you are familiar with front-end development, you can modify components according to your needs.


## 4. build

After modification, you need to build with the npm

```bash
npm run build:ui
```


## 5. Run

```bash
npm start
```

## 6. Open the page

Open the page in browser:  [http://localhost:8080/]([http://localhost:8080/])

