const common = require("./common");

test("test common function getYYYYMMDD", async () => {
  let str = common.getYYYYMMDD("2023-1-4 14:23:12");
  expect(str).toBe(20230104);
});

test("test common function getDateDir", async () => {
  let str = common.getDateDir("2023-1-4 14:23:12");
  expect(str).toBe("/2023/01/04/");
});

test("test common function timestr", async () => {
  let str = common.timestr("MM-dd hh:mm:ss", "2023-1-4 14:23:12");
  expect(str).toBe("01-04 14:23:12");
});

test("test common function getExtname", async () => {
  let str = common.getExtname("./fdsa/fdsa.png?fd-f#sawcdsa2432");
  expect(str).toBe(".png");
});

test("test common function log", async () => {
  let str = common.log(1, 2, 3);
  expect(str).toBe(undefined);
});
test("test common function log", async () => {
  let str = common.log(1, 2, 3);
  expect(str).toBe(undefined);
});
test("test common function err", async () => {
  let str = common.err(1, 2, 3);
  expect(str).toBe(undefined);
});

test("test common function sub", async () => {
  let str = common.subtext("abcd", "a", "d");
  expect(str).toBe("bc");
});

test("test common function subtextArr", async () => {
  let str = common.subtextArr("abcd,fdsalkfda,a3232dfldsaafd", "a", "d");
  expect(str).toEqual(["bc", "lkf", "3232", "f"]);
});

test("test common function relaceAll", async () => {
  let str = common.relaceAll("aaaaa", "a", "d");
  expect(str).toEqual("ddddd");
});

test("test common function url_encode", async () => {
  let str = common.url_encode("/aaaaa-fda=+fdsa");
  expect(str).toEqual("/aaaaa-fda=%2Bfdsa");
});

test("test common function formatEntity", async () => {
  let entity = { a: undefined, b: 1, c: "", d: {}, e: "aaa" };
  common.formatEntity(entity);
  expect(entity).toEqual({ b: 1, e: "aaa" });
});

test("test common function getFiles", async () => {
  let files = common.getFiles("./");
  expect(Array.isArray(files)).toBe(true);
});

test("test common function random", async () => {
  let number = common.random(3, 100);
  expect(number >= 3 && number <= 100).toBe(true);
});

test("test common function randomStr", async () => {
  let number = common.randomStr(3, 100);
  expect(number.length > 0).toBe(true);
});

test("test common function sleep", () => {
  let a = 1;
  common.sleep(1000, true).then((t) => {
    a = 2;
    expect(a).toBe(2);
  });
});

test("test common function clone", () => {
  let entity1 = { a: 1, b: 2 };
  let entity2 = common.clone(entity1);
  expect(entity1).toEqual(entity2);
});

test("test common function isEmpty", () => {
  let entity1 = {};
  let result = common.isEmpty(entity1);
  expect(result).toEqual(true);
});

test("test common function getMoneyFloat", () => {
  let result = common.getMoneyFloat(6.24);
  expect(result).toEqual(6.24);
});

test("test common function createTimestamp", () => {
  let result = common.createTimestamp();
  expect(isNaN(result)).toEqual(false);
});

test("test common function raw", () => {
  let result = common.raw({ a: 1, b: 2, c: 3 });
  expect(result).toEqual("a=1&b=2&c=3");
});
test("test useTime function", () => {
  common.useTime("test", 1);
  setTimeout((tt) => {
    let t = common.useTime("test");
    expect(t > 99).toEqual(true);
  }, 100);
});
