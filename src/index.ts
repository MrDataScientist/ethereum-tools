import * as yargs from "yargs"
import { CheckPrivateKeyModule } from "./modules/CheckPrivateKeyModule"
import { ParseRawTxModule } from "./modules/ParseRawTxModule"
import { SignTxModule } from "./modules/SignTx"

yargs
  .command(CheckPrivateKeyModule)
  .command(ParseRawTxModule)
  .command(SignTxModule)

yargs
  .demandCommand()
  .help()
  .parse()
