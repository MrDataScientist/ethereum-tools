import { CommandModule, Arguments } from "yargs"
import { EthereumUtils } from "../utils/EthereumUtils"
import { CommonUtils } from "../utils/CommonUtils"

const handler = async (args: Arguments) => {
  const { contractAbiFile, input } = args
  const jsonInterface = CommonUtils.readFileAsJsonOrFatal(contractAbiFile)
  const decoded = EthereumUtils.decodeInput({ jsonInterface, input })
  console.log(decoded)
}

export const DecodeInputModule: CommandModule = {
  command: "decode-input <contractAbiFile> <input>",
  handler
}
