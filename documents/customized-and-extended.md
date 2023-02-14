
# How to customized and extended components

目前我们的源码默认作为polkadot链的区块链浏览器，你也可以修改成其它链的浏览器，具体操作如下：

## 1. 修改后端服务RPC节点链接

This project supports most of the chain of polkadot ecosystem. You can switch as long as you modify the RPC node address in the configuration file :

[/webconfig.js](https://github.com/CESSProject/substats/blob/master/webconfig.js)

And node RPC url config at :<br /> <https://github.com/CESSProject/substats/blob/a20719f77624a3f2658a3562cf041192500b7a89/webconfig.js#L13>

## 2. Clear database table

``` bash
npm run reset
```

## 3. 修改前端UI

前端UI需要修改主色调，LOGO等
当然也可以扩展现有组件

源码位于 /ui/src/目录下

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

#### a. 修改主色调

当前主色调为：#e6007a

你可以在这个文件中修改成其它颜色

[/ui/src/index.less#L11](https://github.com/CESSProject/substats/blob/master/ui/src/index.less#L11)

#### b. 更换LOGO

修改以下logo图片文件：
```bash
/ui/public/favicon.ico
/ui/public/img/logo.png
/ui/public/img/u218.png
```
#### c. 修改链名称

链名称配置文件：
```bash
# /ui/src/webconfig.js
export default { 
    name:"Polkadot", # blockchain name
    tokenName:'DOT'  # token name
 };
```
把名称修改成对应链的名称即可

#### d. 修改components

components位于以下文件夹：
```bash
/ui/src/components
```
你可以根据你的想法随心欲的修改，当然，前提是需要有一定的前端基础。


## 4. Build frond-end project.

修改完上面这些后，需要重新build才能生效

```bash
cd uid && npm run build
//or 
npm run build:ui
```


## 5. Run

```bash
npm start
```

## 6. View

Open the page in browser:  [http://localhost:8080/]([http://localhost:8080/])

