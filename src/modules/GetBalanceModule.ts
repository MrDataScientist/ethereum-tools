import { CommandModule, Arguments } from "yargs"
import { EthereumUtils } from "../utils/EthereumUtils"

const handler = async (yargs: Arguments) => {
  const { addresses } = yargs
  console.log({ addresses })
}

export const GetBalanceModule: CommandModule = {
  command: "get-balance <addresses>",
  builder: {
    server: {
      type: "string"
    }
  },
  handler
}
