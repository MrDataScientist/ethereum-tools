import * as util from "util"
import * as ganache from "ganache-cli"
import * as Web3 from "web3"
import * as execa from "execa"

const options = {
  debug: true,
  mnemonic: "blue giraffe oxygen session milk foam camp poverty dwarf blossom curtain spoil",
  port: 7545,
  logger: console
}
const server = ganache.server(options)
const listen = util.promisify(server.listen)

const web3 = new Web3()

jest.setTimeout(10000)

describe("transfer-ether", () => {
  beforeAll(async () => {
    await listen(7545)
    web3.setProvider(new Web3.providers.HttpProvider("http://localhost:7545"))
  })

  afterAll(() => {
    server.close()
  })

  test("#example", async () => {
    const res = await execa.shell("node dist/index.js transfer-all-ether example")
    expect(res.stdout).toEqual(expect.stringContaining("0x7B38fec96a5696F8dF596FE7F148db1c47c8B49a"))
  })

  test("#start", async () => {
    let res = await execa.shell(
      "node dist/index.js transfer-all-ether --config config-examples/transfer-all-ether.json config"
    )
    console.log(res.stdout)
    expect(res.stdout).toEqual(expect.stringContaining("0x7B38fec96a5696F8dF596FE7F148db1c47c8B49a"))

    res = await execa.shell(
      "node dist/index.js transfer-all-ether --config config-examples/transfer-all-ether.json prepare"
    )
    console.log(res.stdout)
    expect(res.stdout).toEqual(expect.stringContaining("0x5bf6d7c41c910457d8D861C8F3bd0dF5C2f8ccb2"))

    res = await execa.shell(
      "node dist/index.js transfer-all-ether --config config-examples/transfer-all-ether.json start"
    )
    console.log(res.stdout)

    const balance = await web3.eth.getBalance("0x7B38fec96a5696F8dF596FE7F148db1c47c8B49a")
    console.log({ balance })
    expect(balance).toBe("299999496000000000000")
  })
})
