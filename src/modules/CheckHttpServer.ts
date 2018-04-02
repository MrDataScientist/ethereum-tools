import { CommandModule, Arguments } from "yargs"
import { EthereumUtils } from "../utils/EthereumUtils"

const handler = async (yargs: Arguments) => {
  const { addresses } = yargs
  for (const address of addresses.split(",")) {
    const res = await EthereumUtils.rpcGetBlockNumber({ rpcServer: address })
    console.log(address + " / blockNumber: " + (res.error || res.blockNumber))
  }
}

export const CheckHttpServerModule: CommandModule = {
  command: "check-http-server <addresses>",
  handler
}
