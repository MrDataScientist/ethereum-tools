import axios from "axios"
import * as fakeEthTx from "ethereumjs-tx/fake"
import * as Tx from "ethereumjs-tx"
import BigNumber from "bignumber.js"
import * as WebSocket from "ws"
import * as abi from "web3-eth-abi"
import * as abiDecoder from "abi-decoder"
import { isValidAddress, isValidPrivate, privateToAddress, bufferToHex } from "ethereumjs-util"

const TIMEOUT = 5000

axios.defaults.timeout = TIMEOUT

let rpcIdCounter = 1

const rpcCall = async (url: string, method: string, params: any[]): Promise<{ result?: string; error?: string }> => {
  rpcIdCounter += 1
  const data = {
    jsonrpc: "2.0",
    method,
    id: rpcIdCounter,
    params
  }
  return url.startsWith("http") ? httpRpcCall(url, data) : wsRpcCall(url, data)
}

const httpRpcCall = async (url: string, data: any): Promise<{ result?: string; error?: string }> => {
  try {
    const res = await axios.post(url, data)
    if (res.data && res.data.error) return { error: res.data.error.message }
    if (res.data && res.data.result) return { result: res.data.result }
    return { error: "unknown error" }
  } catch (err) {
    return { error: err.message }
  }
}

const wsRpcCall = async (url: string, data: any): Promise<{ result?: string; error?: string }> => {
  return new Promise(resolve => {
    const timeout = setTimeout(() => resolve({ error: "timeout" }), TIMEOUT)
    try {
      const ws = new WebSocket(url)
      ws.on("open", () => {
        ws.send(JSON.stringify(data))
      })
      ws.on("message", (message: string) => {
        clearTimeout(timeout)
        ws.close()
        try {
          const res = JSON.parse(message)
          if (res.error) resolve({ error: res.error.message })
          else if (res.result) resolve({ result: res.result })
          else resolve({ error: "unknown error" })
        } catch (err) {
          resolve({ error: err.message })
        }
      })
      ws.on("error", err => resolve({ error: err.message }))
    } catch (err) {
      clearTimeout(timeout)
      resolve({ error: err.message })
    }
  })
}

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

  public static rpcGetBlockNumber = async (rpcServer: string): Promise<{ blockNumber?: number; error?: string }> => {
    const res = await rpcCall(rpcServer, "eth_blockNumber", [])
    if (res.result) return { blockNumber: new BigNumber(res.result).toNumber() }
    else return { error: res.error }
  }

  public static rpcGetBalance = async (
    rpcServer: string,
    address: string
  ): Promise<{ balance?: string; error?: string }> => {
    const res = await rpcCall(rpcServer, "eth_getBalance", [address, "latest"])
    if (res.result) return { balance: new BigNumber(res.result).toFixed() }
    else return { error: res.error }
  }

  public static rpcGetNonce = async (
    rpcServer: string,
    address: string
  ): Promise<{ nonce?: number; error?: string }> => {
    const res = await rpcCall(rpcServer, "eth_getTransactionCount", [address, "latest"])
    if (res.result) return { nonce: new BigNumber(res.result).toNumber() }
    else return { error: res.error }
  }

  public static toEther = (value: string) => new BigNumber(value).dividedBy("1000000000000000000").toFixed()

  public static toGwei = (value: string) => new BigNumber(value).dividedBy("1000000000").toFixed()
}
