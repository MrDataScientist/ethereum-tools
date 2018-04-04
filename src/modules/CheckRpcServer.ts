import { CommandModule, Arguments } from "yargs"

import { EthereumUtils } from "../utils/EthereumUtils"
import { CommonUtils } from "../utils/CommonUtils"

const handler = async (yargs: Arguments) => {
  const { urls } = yargs
  console.log("Check blockNumber for ethereum nodes...\n")
  for (const url of urls.split(",")) {
    const res = await EthereumUtils.rpcGetBlockNumber({ rpcServer: url })
    console.log(url + " / " + (res.error || res.blockNumber))
  }
  CommonUtils.printGreen("\nDone!")
}

export const CheckRpcServerModule: CommandModule = {
  command: "check-rpc-server <urls>",
  handler
}
