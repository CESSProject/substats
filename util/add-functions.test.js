require("./add-functions");
const arr = [5, 6, 2, 4, 2, 6];
const str = "   a b c d ";

test("test array unique function", async () => {
  let arr2 = arr.unique();
  expect(arr2).toEqual([5, 6, 2, 4]);
});

test("test array randSort function", async () => {
  let arr2 = arr.randSort();
  expect(arr2.length).toBe(6);
});

test("test string replaceAll function", async () => {
  let str2 = str.replaceAll(" ", "");
  expect(str2).toBe("abcd");
});

test("test string mytrim function", async () => {
  let str2 = str.mytrim();
  expect(str2).toBe("a b c d");
});

test("test string mysubstr function", async () => {
  let str2 = str.mysubstr("a", "d");
  expect(str2).toBe(" b c ");
});
