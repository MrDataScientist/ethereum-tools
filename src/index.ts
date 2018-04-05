import * as yargs from "yargs"
import { CheckPrivateKeyModule } from "./modules/CheckPrivateKeyModule"
import { ParseTxModule } from "./modules/ParseTxModule"
import { SignTxModule } from "./modules/SignTxModule"
import { EncodeInputModule } from "./modules/EncodeInputModule"
import { DecodeInputModule } from "./modules/DecodeInputModule"
import { GetBlockNumberModule } from "./modules/GetBlockNumberModule"
import { GetBalanceModule } from "./modules/GetBalanceModule"
import { GetNonceModule } from "./modules/GetNonceModule"

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

yargs
  .demandCommand(
    1,
    "Commands: check-private-key, parse-tx, sign-tx, encode-input, decode-input, get-block-number, get-balance, get-nonce\n"
  )
  .help()
  .wrap(80)
  .strict()
  .parse()
