import * as yargs from "yargs"
import { CheckPrivateKeyModule } from "./modules/CheckPrivateKeyModule"
import { ParseTxModule } from "./modules/ParseTxModule"
import { SignTxModule } from "./modules/SignTxModule"
import { EncodeInputModule } from "./modules/EncodeInputModule"
import { DecodeInputModule } from "./modules/DecodeInputModule"
import { CheckRpcModule } from "./modules/CheckRpcModule"
import { GetBalanceModule } from "./modules/GetBalanceModule"

yargs
  .usage("usage: $0 <command>")
  .command(CheckPrivateKeyModule)
  .command(ParseTxModule)
  .command(SignTxModule)
  .command(EncodeInputModule)
  .command(DecodeInputModule)
  .command(CheckRpcModule)
  .command(GetBalanceModule)

yargs
  .demandCommand(
    1,
    "Commands: check-private-key, parse-tx, sign-tx, encode-input, decode-input, check-rpc, get-balance\n"
  )
  .help()
  .wrap(80)
  .strict()
  .parse()
