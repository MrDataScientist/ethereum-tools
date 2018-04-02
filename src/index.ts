import * as yargs from "yargs"
import { CheckPrivateKeyModule } from "./modules/CheckPrivateKeyModule"
import { ParseTxModule } from "./modules/ParseTxModule"
import { SignTxModule } from "./modules/SignTxModule"
import { EncodeInputModule } from "./modules/EncodeInputModule"
import { DecodeInputModule } from "./modules/DecodeInputModule"
import { CheckHttpServerModule } from "./modules/CheckHttpServer"
import { GetBalanceModule } from "./modules/GetBalanceModule"

yargs
  .usage("usage: $0 <command>")
  .command(CheckPrivateKeyModule)
  .command(ParseTxModule)
  .command(SignTxModule)
  .command(EncodeInputModule)
  .command(DecodeInputModule)
  .command(CheckHttpServerModule)
  .command(GetBalanceModule)

yargs
  .demandCommand(1, "Commands: check-private-key, parse-tx, sign-tx, encode-input, decode-input, check-http-server, get-balance")
  .help()
  .wrap(80)
  .strict()
  .parse()
