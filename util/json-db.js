"use strict";
const fs=require("fs");
const path=require("path");
const dbPath=path.join(__dirname,"../data/");
let itemList={};
let privateFunInit=Symbol("privateFunInit");
let privateFunStore=Symbol("privateFunStore");
class db{
    constructor(tableName){
        this.tableName=tableName;
        this[privateFunInit]();
    }
    [privateFunInit](){
        if(itemList[this.tableName]) {
            console.log("init with cache.");
            return;
        }
        if(!fs.existsSync(dbPath+ this.tableName + ".json")){
            return;
        }
        let text=fs.readFileSync(dbPath + this.tableName + ".json","utf-8");
        itemList[this.tableName]=JSON.parse(text);
    }
    [privateFunStore](){
        if(itemList[this.tableName]) {
            if(!fs.existsSync(dbPath)){
                fs.mkdirSync(dbPath);
            }
            fs.writeFileSync(dbPath + this.tableName + ".json", JSON.stringify(itemList[this.tableName]));
        }
    }
    get totalTable(){
        if(itemList[this.tableName]) {
            return itemList[this.tableName];
        }
        else{
            return {maxid:0,rows:[]};
        }
    }
    get rowCount(){
        return this.totalTable.rows.length;
    }
    insert(entity){
        if(!itemList[this.tableName]){
            itemList[this.tableName]={maxid:0,rows:[]};
        }
        itemList[this.tableName].maxid++;
        entity.id=itemList[this.tableName].maxid;
        itemList[this.tableName].rows.push(entity);
        this[privateFunStore]();
    }
    update(entity){
        let index = this.totalTable.rows.findIndex(t=>t.id == entity.id);
        if (index == -1) {
            return false;
        }
        itemList[this.tableName].rows[index] = entity;
        this[privateFunStore]();
        return true;
    }
    getListByPager(pageIndex, pageSize,desc) {
        return db.pager(this.totalTable.rows,pageIndex, pageSize,desc);
    }
    getSingle(id){
        let index = this.totalTable.rows.findIndex(t=>t.id == id);
        if (index == -1) {
            return false;
        }
        return itemList[this.tableName].rows[index];
    }
    delete(id){
        let index = this.totalTable.rows.findIndex(t=>t.id == id);
        if (index == -1) {
            return false;
        }
        itemList[this.tableName].rows.splice(index, 1);
        this[privateFunStore]();
        return true;
    }
    static pager(rows,pageIndex, pageSize,desc){
        let count = rows.length;
        let startIndex = (pageIndex - 1) * pageSize;
        let endIndex = pageIndex * pageSize;
        if (endIndex > count) {
            endIndex = count;
        }
        let pageCount = parseInt(count / pageSize);
        if (pageCount < 1||count<=pageSize) {
            pageCount = 1;
        }
        else if ((count % pageSize) > 0) {
            pageCount++;
        }
        let tempArr=rows.slice(0);
        if(desc){
            tempArr.sort((t1,t2)=>{return t1.id<t2.id});
        }
        return {page_count: pageCount, record_count: count, item: tempArr.slice(startIndex, endIndex)};
    }
}
module.exports=db;