const MyKeyring = require("./keyring");
const myKeyring = new MyKeyring();

test("toHexString", () => {
  const str = myKeyring.toHexString([1, 2, 3]);
  // console.log(str);
  expect(str.length > 1).toBe(true);
});
test("getPublicKeyFromAccountId", async () => {
  const publicKey = await myKeyring.getPublicKeyFromAccountId(
    "cXh5StobuVP4B7mGH9xn8dSsDtXks4qLAou8ZdkZ6DbB6zzxe"
  );
  // console.log(publicKey);
  expect(publicKey.length > 50 && publicKey.indexOf("0x") == 0).toBe(true);
});
