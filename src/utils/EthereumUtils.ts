import * as fakeEthTx from "ethereumjs-tx/fake"
import BigNumber from "bignumber.js"
import { isValidAddress, isValidPrivate, privateToAddress, bufferToHex } from "ethereumjs-util"

export class EthereumUtils {
  public static checkPrivateKey = (address: string, privateKey: string): boolean => {
    const privateKeyBuff = Buffer.from(privateKey, "hex")
    if (!isValidAddress(address.toLowerCase())) return false
    if (!isValidPrivate(privateKeyBuff)) return false
    return (
      address.toLowerCase().replace("0x", "") ===
      privateToAddress(privateKeyBuff)
        .toString("hex")
        .toLowerCase()
    )
  }

  public static parseRawTx = (rawTx: string) => {
    const tx = new fakeEthTx(rawTx)
    return {
      value: new BigNumber(bufferToHex(tx.value)).toString(10),
      gasLimit: new BigNumber(bufferToHex(tx.gasLimit)).toString(10),
      gasPrice: new BigNumber(bufferToHex(tx.gasPrice)).toString(10),
      nonce: new BigNumber(bufferToHex(tx.nonce)).toString(10),
      from: bufferToHex(tx.from),
      to: bufferToHex(tx.to),
      data: bufferToHex(tx.data)
    }
  }
}
