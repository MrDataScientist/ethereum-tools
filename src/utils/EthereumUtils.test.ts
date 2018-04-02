import * as path from "path"
import * as fs from "fs-extra"
import { EthereumUtils } from "./EthereumUtils"

describe("EthereumUtils", () => {
  test("checkPrivateKey", () => {
    expect(
      EthereumUtils.checkPrivateKey(
        "0x627306090abaB3A6e1400e9345bC60c78a8BEf57",
        "c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3"
      )
    ).toBe(true)
    expect(
      EthereumUtils.checkPrivateKey(
        "0x627306090abaB3A6e1400e9345bC60c78a8BEf57",
        "c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d1"
      )
    ).toBe(false)
  })

  test("signTx", () => {
    const config = JSON.parse(fs.readFileSync(path.join(__dirname, "../../test-data/sign-tx/config.json"), "utf8"))
    const rawTx = EthereumUtils.signTx(config)
    expect(rawTx).toBe(
      "0xf891038507aef40a008303d09094f17f52151ebef6c7334fad080c5704d77216b732881bc16d674ec80000a416c38b3c000000000000000000000000000000000000000000000000000000000000000025a07c59cb5f13f431756a7d2ea1ddac853863f099e3674b1ca92d16ce4628cea3c9a06e17517e307d1b82fa338b0511753bf02429a1eeebfb132223dc0692d23d7d5d"
    )
  })

  test("parseTx", () => {
    const tx = EthereumUtils.parseTx(
      "0xf891038507aef40a008303d09094f17f52151ebef6c7334fad080c5704d77216b732881bc16d674ec80000a416c38b3c000000000000000000000000000000000000000000000000000000000000000025a07c59cb5f13f431756a7d2ea1ddac853863f099e3674b1ca92d16ce4628cea3c9a06e17517e307d1b82fa338b0511753bf02429a1eeebfb132223dc0692d23d7d5d"
    )
    expect(tx).toEqual({
      data: "0x16c38b3c0000000000000000000000000000000000000000000000000000000000000000",
      from: "0x627306090abab3a6e1400e9345bc60c78a8bef57",
      gasLimit: "250000",
      gasPrice: "33000000000",
      nonce: "3",
      to: "0xf17f52151ebef6c7334fad080c5704d77216b732",
      value: "2000000000000000000"
    })
  })

  test("encodeFunctionCall", () => {
    const config = JSON.parse(fs.readFileSync(path.join(__dirname, "../../test-data/encode-input/config.json"), "utf8"))
    const encodedInput = EthereumUtils.encodeFunctionCall(config)
    expect(encodedInput).toBe(
      "0xa9059cbb000000000000000000000000627306090abab3a6e1400e9345bc60c78a8bef5700000000000000000000000000000000000000000000000001633c600f176000"
    )
  })

  test("decodeInput", () => {
    const jsonInterface = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../../test-data/decode-input/contract-abi.json"), "utf8")
    )
    const input = "0x55241077000000000000000000000000000000000000000000000000000000000000001f"
    const decoded = EthereumUtils.decodeInput({ jsonInterface, input })
    expect(decoded).toMatchObject({ name: "setValue", params: [{ value: "31" }] })
  })
})
