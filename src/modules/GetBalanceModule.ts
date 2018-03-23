import { CommandModule, Arguments } from "yargs"
import { EthereumUtils } from "../utils/EthereumUtils"

const handler = async (yargs: Arguments) => {
  const { rawTx } = yargs
  console.log("rawTx: " + rawTx)
  const tx = EthereumUtils.parseTx(rawTx)
  console.log({ tx })
}

export const GetBalanceModule: CommandModule = {
  command: "get-balance <addresses>",
  handler
}
