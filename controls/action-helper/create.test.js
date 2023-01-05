const create = require("./create");

test("test the create function", async () => {
  let dal = {
    columns:[{
        column_name:'test'
    }],
    insert:(entity)=>{
        return {
            msg:"ok",id:1
        }
    }
  };
  let req={
    body:{
        test:1
    }
  };
  let res = {
    json: (result) => {
      expect(result.id).toBe(1);
    },
  };
  await create({ msg: "" }, dal, req, res);
});
