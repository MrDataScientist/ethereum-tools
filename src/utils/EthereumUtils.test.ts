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
})
