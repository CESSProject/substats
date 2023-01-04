const copy = require("./copy");

test("test the copy function", async () => {
  let dal = {    
    findById: (id)=>{
        return [{id:1}]
    },
    insert:(entity)=>{
        return {
            msg:"ok",id:1
        }
    }
  };
  let req={    
    body:{
        id:1
    }
  };
  let res = {
    json: (result) => {
      expect(result.id).toBe(1);
    },
  };
  await copy({ msg: "" }, dal, req, res);
});
