import { CommandModule, Arguments } from "yargs"

import { EthereumUtils } from "../utils/EthereumUtils"
import { CommonUtils } from "../utils/CommonUtils"

const handler = async (yargs: Arguments) => {
  const { urls } = yargs
  console.log("Get blockNumber for ethereum nodes...\n")
  for (const url of urls.split(",")) {
    const res = await EthereumUtils.rpcGetBlockNumber(url)
    console.log(url + " / " + (res.error || res.blockNumber))
  }
  CommonUtils.printGreen("\nDone!")
}

export const GetBlockNumberModule: CommandModule = {
  command: "get-block-number <urls>",
  handler
}
