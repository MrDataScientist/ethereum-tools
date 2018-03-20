import { CommandModule, Arguments } from "yargs"
import { EthereumUtils } from "../utils/EthereumUtils"

const handler = async (yargs: Arguments) => {
  const { raw } = yargs
  const tx = EthereumUtils.parseRawTx(raw)
  console.log("raw: " + raw)
  console.log({ tx })
}

export const ParseRawTxModule: CommandModule = {
  command: "parse-raw-tx <raw>",
  describe: "desc bla bla",
  builder: {
    raw: {
      type: "string"
    }
  },
  handler
}
