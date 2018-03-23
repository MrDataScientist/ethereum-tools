import { CommandModule, Arguments } from "yargs"
import { EthereumUtils } from "../utils/EthereumUtils"

const handler = async (yargs: Arguments) => {
  const { address, privateKey } = yargs
  const result = EthereumUtils.checkPrivateKey(address, privateKey)
  console.log("address: " + address)
  console.log("privateKey: " + privateKey)
  console.log("valid: " + result)
}

export const CheckPrivateKeyModule: CommandModule = {
  command: "check-private-key <address> <privateKey>",
  handler
}
