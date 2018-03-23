import * as fakeEthTx from "ethereumjs-tx/fake"
import * as Tx from "ethereumjs-tx"
import BigNumber from "bignumber.js"
import * as abi from "web3-eth-abi"
import * as abiDecoder from "abi-decoder"
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

  public static parseTx = (rawTx: string) => {
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

  public static signTx = (tx: {
    from: string
    nonce: number
    gasPrice: string
    gasLimit: number
    value?: string
    to?: string
    privateKey: string
    data?: string
    chainId?: number
  }) => {
    const nonce = "0x" + new BigNumber(tx.nonce).toString(16)
    const gasPrice = "0x" + new BigNumber(tx.gasPrice).toString(16)
    const gasLimit = "0x" + new BigNumber(tx.gasLimit).toString(16)
    const txParams: any = {
      from: tx.from,
      nonce,
      gasPrice,
      gasLimit,
      to: tx.to,
      chainId: tx.chainId || 1,
      value: tx.value ? "0x" + new BigNumber(tx.value).toString(16) : "0x00"
    }
    if (tx.to) txParams.to = tx.to
    if (tx.data) txParams.data = tx.data
    const signedTx = new Tx(txParams)
    signedTx.sign(Buffer.from(tx.privateKey, "hex"))
    const serializedTx = signedTx.serialize()
    return "0x" + serializedTx.toString("hex")
  }

  public static encodeFunctionCall = ({ jsonInterface, parameters }: { jsonInterface: object; parameters: string[] }) =>
    abi.encodeFunctionCall(jsonInterface, parameters)

  public static decodeInput = ({ jsonInterface, input }: { jsonInterface: object; input: string }) => {
    abiDecoder.addABI(jsonInterface)
    return abiDecoder.decodeMethod(input)
  }
}
