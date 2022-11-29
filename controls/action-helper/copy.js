/*
 * @Description: 
 * @Autor: fage
 * @Date: 2022-07-11 15:11:36
 * @LastEditors: fage
 * @LastEditTime: 2022-07-11 17:22:08
 */

module.exports = async function (ret, dal, req, res) {
    try {
        let id=parseInt(req.body.id);
        let tmp=await dal.findById(id);
        if(tmp&&tmp.length){
            let entity=tmp[0];
            delete entity.add_time;
            delete entity.id;
            for(let k in req.body){
                if(k=='id'||k=='way'||k=='action') continue;
                entity[k]=req.body[k];
            }
            ret=await dal.insert(entity);
        }else{
            ret.msg='record not found.';
        }
    } catch (e) {
        ret.msg = 'error';
        ret.err = e;
    }
    if ((typeof req.cb).toLocaleLowerCase() == 'function') {
        req.cb(ret.id);
    }
    res.json(ret);
}