import * as yargs from "yargs"
import { CheckPrivateKeyModule } from "./modules/CheckPrivateKeyModule"
import { ParseRawTxModule } from "./modules/ParseRawTxModule"

yargs.command(CheckPrivateKeyModule).command(ParseRawTxModule)

yargs
  .demandCommand()
  .help()
  .parse()
