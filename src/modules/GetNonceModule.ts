import * as fs from "fs-extra"
import { CommandModule, Arguments } from "yargs"
import { EthereumUtils } from "../utils/EthereumUtils"
import { CommonUtils } from "../utils/CommonUtils"

const getAddresses = (addresses: string, file?: string) => {
  if (addresses) return addresses.trim().split(",")
  if (file) {
    if (!fs.existsSync(file)) {
      CommonUtils.printFatal("Can't find file: " + file)
    }
    return fs
      .readFileSync(file, "utf8")
      .split("\n")
      .map(x => x.trim())
      .filter(x => x)
  } else {
    CommonUtils.printFatal("There are no addresses to check. Use [addresses] or --file option.")
  }

  return []
}

const getRpc = (rpc: string) => {
  return rpc || process.env.ETHEREUM_TOOLS_NODE
}

const handler = async (yargs: Arguments) => {
  const rpc = getRpc(yargs.rpc)
  const addresses = getAddresses(yargs.addresses, yargs.file)
  if (!rpc) {
    CommonUtils.printFatal("rpc server is not defined. Use --rpc option or set ETHEREUM_TOOLS_NODE evn")
    return
  }

  console.log(`Getting nonces (${rpc})...\n`)

  for (const address of addresses) {
    const res = await EthereumUtils.rpcGetNonce(rpc, address)
    console.log(address + " / " + (res.nonce || res.error))
  }
  CommonUtils.printGreen("\nDone!")
}

export const GetNonceModule: CommandModule = {
  command: "get-nonce [addresses]",
  builder: {
    rpc: {
      type: "string"
    },
    file: {
      type: "string"
    }
  },
  handler
}
