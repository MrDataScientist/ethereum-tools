import * as path from "path"
import * as fs from "fs-extra"
import { CommandModule, Arguments } from "yargs"
import { CommonUtils } from "../utils/CommonUtils"
import { EthereumUtils } from "../utils/EthereumUtils"

const WORK_FILE = "ethereum-utils.deploy-contract.work.json"

interface Config {
  from: string
  privateKey: string
  gasPrice: string
  gasLimit: number
  value?: string
  input: string
  rpcServers: string
  workDir: string
}

interface Work {
  nonce: number
}

const doConfig = async (configPath: string) => {
  const config: Config = await CommonUtils.readFileAsJsonOrFatal(configPath)
  console.log("\nConfig:\n")
  console.log(config)
  if (!EthereumUtils.checkPrivateKey(config.from, config.privateKey)) CommonUtils.printFatal("Private key is wrong!")

  console.log("\nCheck rpc servers...")
  for (const rpcServer of config.rpcServers.split(",n")) {
    const res = await EthereumUtils.rpcGetBlockNumber(rpcServer)
    console.log(rpcServer + " / " + (res.error || res.blockNumber))
  }
}

const doPrepare = async (configPath: string) => {
  const config: Config = await CommonUtils.readFileAsJsonOrFatal(configPath)
  console.log("\nPrepare nonce...")
  const res = await EthereumUtils.rpcGetNonce(config.rpcServers.split(",")[0], config.from)
  console.log(config.from + " / " + (res.error || res.nonce))
  if (res.error) {
    CommonUtils.printRed("Wrong nonce! " + res.error)
    process.exit(0)
  }
  const work = { nonce: res.nonce }
  fs.writeFileSync(path.join(config.workDir, WORK_FILE), JSON.stringify(work, null, 2))
}

const doExample = () => {
  const config = CommonUtils.readFileAsJsonOrFatal(path.join(__dirname, "../../config-examples/deploy-contract.json"))
  console.log("\nConfig example:\n")
  console.log(config)
}

const doStart = async (configPath: string) => {
  const config: Config = await CommonUtils.readFileAsJsonOrFatal(configPath)
  const work: Work = await CommonUtils.readFileAsJsonOrFatal(path.join(config.workDir, WORK_FILE))
  const rawTx = EthereumUtils.signTx({
    from: config.from,
    privateKey: config.privateKey,
    nonce: work.nonce,
    gasPrice: config.gasPrice,
    gasLimit: config.gasLimit,
    data: config.input,
    value: config.value
  })
  console.log({ rawTx })
  console.log("\nSend tx:")
  await Promise.all(config.rpcServers.split(",").map(server => sendTx(server, rawTx)))
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

export const DeployContractModule: CommandModule = {
  command: "deploy-contract  <command>",
  builder: {
    config: {
      type: "string"
    }
  },
  handler
}
