import * as yargs from "yargs"
import * as cliui from "cliui"
import { CheckPrivateKeyModule } from "./modules/CheckPrivateKeyModule"
import { ParseTxModule } from "./modules/ParseTxModule"
import { SignTxModule } from "./modules/SignTxModule"
import { EncodeInputModule } from "./modules/EncodeInputModule"
import { DecodeInputModule } from "./modules/DecodeInputModule"
import { GetBlockNumberModule } from "./modules/GetBlockNumberModule"
import { GetBalanceModule } from "./modules/GetBalanceModule"
import { GetNonceModule } from "./modules/GetNonceModule"
import { GetPrivateKeyFromKeystoreModule } from "./modules/GetPrivateKeyFromKeystore"
import { TransferEtherModule } from "./modules/TransferEtherModule"

const commands = [
  "check-private-key",
  "parse-tx",
  "sign-tx",
  "encode-input",
  "decode-input",
  "get-block-number",
  "get-balance",
  "get-nonce",
  "get-private-key-from-keystore",
  "transfer-ether"
]
const commandsUI = cliui()
commandsUI.div("Commands:")
commandsUI.div({ padding: [1, 0, 0, 1], text: commands.join("\n") + "\n" })

yargs
  .usage("usage: $0 <command>")
  .command(CheckPrivateKeyModule)
  .command(ParseTxModule)
  .command(SignTxModule)
  .command(EncodeInputModule)
  .command(DecodeInputModule)
  .command(GetBlockNumberModule)
  .command(GetBalanceModule)
  .command(GetNonceModule)
  .command(GetPrivateKeyFromKeystoreModule)
  .command(TransferEtherModule)

yargs
  .demandCommand(1, commandsUI.toString())
  .help()
  .wrap(80)
  .strict()
  .parse()
