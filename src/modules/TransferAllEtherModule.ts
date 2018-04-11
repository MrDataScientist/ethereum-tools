import * as path from "path"
import * as fs from "fs-extra"
import BigNumber from "bignumber.js"
import { CommandModule, Arguments } from "yargs"
import { CommonUtils } from "../utils/CommonUtils"
import { EthereumUtils } from "../utils/EthereumUtils"

const WORK_FILE = "ethereum-utils.transfer-all-ether.work.json"

interface Config {
  recipient: string
  gasPrice: string
  accounts: Array<{ address: string; privateKey: string }>
  rpcServers: string
  workDir: string
}

interface Work {
  nonce: any
  balance: any
}

const doConfig = async (configPath: string) => {
  const config: Config = await CommonUtils.readFileAsJsonOrFatal(configPath)
  console.log("\nConfig:\n")
  console.log(config)

  console.log("\nCheck private keys...")
  for (const account of config.accounts) {
    const ok = EthereumUtils.checkPrivateKey(account.address, account.privateKey)
    console.log(account.address + " / " + ok)
    if (!ok) CommonUtils.printFatal("Private key is wrong! " + account.address)
  }

  console.log("\nCheck rpc servers...")
  for (const rpcServer of config.rpcServers.split(",n")) {
    const res = await EthereumUtils.rpcGetBlockNumber(rpcServer)
    console.log(rpcServer + " / " + (res.error || res.blockNumber))
  }
}

const doPrepare = async (configPath: string) => {
  const config: Config = await CommonUtils.readFileAsJsonOrFatal(configPath)
  const rpcServer = config.rpcServers.split(",")[0]
  const work: { nonce: any; balance: any } = { nonce: {}, balance: {} }
  console.log("\nPrepare nonce...")
  for (const account of config.accounts) {
    const res = await EthereumUtils.rpcGetNonce(rpcServer, account.address)
    console.log(account.address + " / " + res.nonce)
    if (res.error) {
      CommonUtils.printRed("Wrong nonce! " + res.error)
      process.exit(0)
    }
    work.nonce[account.address] = res.nonce
  }

  console.log("\nPrepare balance...")
  for (const account of config.accounts) {
    const res = await EthereumUtils.rpcGetBalance(rpcServer, account.address)

    if (res.error) {
      CommonUtils.printRed("Wrong balance! " + res.error)
      process.exit(0)
    } else {
      console.log(account.address + " / " + res.balance + " / " + EthereumUtils.toEther(res.balance!) + " Ether")
    }
    work.balance[account.address] = res.balance
  }

  fs.writeFileSync(path.join(config.workDir, WORK_FILE), JSON.stringify(work, null, 2))
}

const doExample = () => {
  const config = CommonUtils.readFileAsJsonOrFatal(
    path.join(__dirname, "../../config-examples/transfer-all-ether.json")
  )
  console.log("\nConfig example:\n")
  console.log(config)
}

const transferAllEtherFromAccount = async (
  account: { address: string; privateKey: string },
  nonce: number,
  balance: string,
  config: Config
) => {
  console.log("\nTransfer all Ether from " + account.address)
  const gasFee = new BigNumber(config.gasPrice).multipliedBy(21000).toFixed()
  const value = new BigNumber(balance!).minus(gasFee).toFixed()
  if (new BigNumber(value).isLessThanOrEqualTo(0)) {
    console.log(account.address + " don't have enough ether to transfer")
    return
  }
  const rawTx = EthereumUtils.signTx({
    from: account.address,
    privateKey: account.privateKey,
    nonce,
    gasPrice: config.gasPrice,
    gasLimit: 21000,
    to: config.recipient,
    value
  })
  await Promise.all(config.rpcServers.split(",").map(server => sendTx(server, rawTx)))
}

const doStart = async (configPath: string) => {
  const config: Config = await CommonUtils.readFileAsJsonOrFatal(configPath)
  const work: Work = await CommonUtils.readFileAsJsonOrFatal(path.join(config.workDir, WORK_FILE))
  await Promise.all(
    config.accounts.map(account =>
      transferAllEtherFromAccount(account, work.nonce[account.address], work.balance[account.address], config)
    )
  )
}

const sendTx = async (server: string, rawTx: string) => {
  const res = await EthereumUtils.rpcSendRawTransaction(server, rawTx)
  console.log(server + " / " + (res.hash || res.error))
}

const handler = async (yargs: Arguments) => {
  const { config, command } = yargs
  if (command === "example") {
    await doExample()
  } else if (command === "config") {
    await doConfig(config)
  } else if (command === "prepare") {
    await doPrepare(config)
  } else if (command === "start") {
    await doStart(config)
  } else {
    CommonUtils.printFatal("Unknown command: " + command + ", valid commands: example, config, prepare, start")
  }
  CommonUtils.printGreen("\nDone!")
}

export const TransferAllEtherModule: CommandModule = {
  command: "transfer-all-ether  <command>",
  builder: {
    config: {
      type: "string"
    }
  },
  handler
}
