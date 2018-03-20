import { isValidAddress, isValidPrivate, privateToAddress } from "ethereumjs-util"

export class EthereumUtils {
  public static checkPrivateKey = (address: string, privateKey: string): boolean => {
    const privateKeyBuff = Buffer.from(privateKey, "hex")
    if (!isValidAddress(address.toLowerCase())) return false
    if (!isValidPrivate(privateKeyBuff)) return false
    return (
      address.toLowerCase().replace("0x", "") ===
      privateToAddress(privateKeyBuff)
        .toString("hex")
        .toLowerCase()
    )
  }
}
