import { CommandModule, Arguments } from "yargs"
import { EthereumUtils } from "../utils/EthereumUtils"

const handler = async (yargs: Arguments) => {
  const { address, password, keystorePath } = yargs
  const privateKey = EthereumUtils.getPrivateKeyFromKeystore(address, password, keystorePath)
  console.log("privateKey", privateKey)
}

export const GetPrivateKeyFromKeystoreModule: CommandModule = {
  command: "get-private-key-from-keystore <address> <password> <keystorePath>",
  handler
}
