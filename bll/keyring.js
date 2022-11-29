/*
 * @Description:
 * @Autor: fage
 * @Date: 2022-07-11 17:32:07
 * @LastEditors: Jack Chen
 * @LastEditTime: 2022-07-11 20:35:33
 * @description: about
 * @author: Jack Chen @懒人码农
 */
const { Keyring } = require("@polkadot/api");

module.exports = class MyKeyring extends Keyring {
  constructor() {
    super({ type: "sr25519", ss58Format: 42 });
  }
  async getPublicKeyFromMnemonic(mnemonic) {
    const pair = this.createFromUri(mnemonic);
    return "0x" + this.toHexString(pair.publicKey);
  }
  async getPublicKeyFromAccountId(accountId) {
    const pair = this.addFromAddress(accountId);
    return "0x" + this.toHexString(pair.publicKey);
  }
  toHexString(arr) {
    return Array.from(arr, (i) => i.toString(16).padStart(2, "0")).join("");
  }
};
