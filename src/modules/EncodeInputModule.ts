import { CommandModule, Arguments } from "yargs"
import { EthereumUtils } from "../utils/EthereumUtils"
import { CommonUtils } from "../utils/CommonUtils"

interface Config {
  jsonInterface: {}
  parameters: string[]
}

const parseOptions = (args: Arguments) => {
  const options = ["jsonInterface", "parameters"]
  const config: Config = CommonUtils.readConfigFile(args.configFile, options) as Config

  CommonUtils.checkRequiredOptionsWithFatal(config, options)
  console.log({ config })
  return config
}

const handler = async (args: Arguments) => {
  const config = parseOptions(args)
  const encodedInput = EthereumUtils.encodeFunctionCall(config)
  console.log({ encodedInput })
}

export const EncodeInputModule: CommandModule = {
  command: "encode-input <configFile>",
  handler
}
