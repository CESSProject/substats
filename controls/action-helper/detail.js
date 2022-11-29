"use strict";

module.exports =async function(ret, dal, req, res) {
    let id=req.body.id||req.query.id;
    if(!id){
        ret.msg='id no exist';
        res.json(ret);
        return false;
    }
    const admins = global.webconfig.admins;
    const regions = global.webconfig.region;
    const bigareas = global.webconfig.bigareas;
    const products = global.webconfig.products;
    const mallproducts = global.webconfig.mallproducts;
    try {
        ret.data = await dal.findById(id);
        if(!ret.data||ret.data.length==0){
            throw 'id not exist.'
        }
        let t=ret.data[0];
        if ('admin_id' in t) {
            let admin= admins.find(a => a.id == t.admin_id);
            if(admin){
                t.admin_avatar=admin.avatar;
                t.admin_name=admin.name;
            }
        }
        if ('to_admin_id' in t) {
            let admin = admins.find(a => a.id == t.to_admin_id);
            if(admin){
                t.owner_avatar=admin.avatar;
                t.owner_name=admin.name;
            }
        }
        if ('area_id' in t) {
            let r = regions.find(a => a.id == t.area_id);
            if (r) {
                t.area_name = r.name;
            }
        }
        if ('bigarea_id' in t) {
            let r = bigareas.find(a => a.id == t.bigarea_id);
            if (r) {
                t.bigarea_name = r.name;
            }
        }
        if ('product_id' in t) {
            let list=req.body.way.indexOf('mall_')!=-1?mallproducts:products;
            t.product = list.find(a => a.id == t.product_id);
        }
        if (t.product_ids && t.buy_counts) {
            let ids = t.product_ids.split(',').map(t => parseInt(t));
            let counts = t.buy_counts.split(',').map(t => parseInt(t));
            t.products = [];
            ids.forEach((a, i) => {
                let product = products.find(v => v.id == a);
                if(product){
                    product.buy_count = counts[i];
                    t.products.push(product);
                }
            });
        }
        if('province_id' in t){
            t.province_name ='湖南';
        }
        if('city_id' in t){
            t.city_name ='长沙';
        }
        ret.data=t;
    } catch (e) {
        ret.msg = 'error';
        ret.err = e;
    }
    if ((typeof req.cb).toLocaleLowerCase() == 'function') {
        req.cb(ret);
    }
    res.json(ret);
}
