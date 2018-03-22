import { CommandModule, Arguments } from "yargs"
import { CommonUtils } from "../utils/CommonUtils"
import { EthereumUtils } from "../utils/EthereumUtils"

interface Config {
  from: string
  privateKey: string
  to: string
  gasPrice: string
  gasLimit: number
  nonce: number
  data?: string
  value?: string
}

const parseOptions = (args: Arguments) => {
  const options = ["from", "privateKey", "to", "gasPrice", "gasLimit", "nonce", "data", "value"]
  const config: Config = CommonUtils.readConfigFile(args.configFile, options) as Config

  CommonUtils.checkRequiredOptionsWithFatal(config, ["from", "privateKey", "gasPrice", "gasLimit", "nonce"])
  console.log({ config })
  return config
}

const handler = async (args: Arguments) => {
  const config = parseOptions(args)
  const rawTx = EthereumUtils.signTx(config)
  console.log({ rawTx })
}

export const SignTxModule: CommandModule = {
  command: "sign-tx <configFile>",
  describe: "desc bla bla",
  handler
}
