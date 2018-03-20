import * as yargs from "yargs"
import { CheckPrivateKeyModule } from "./modules/CheckPrivateKeyModule"

yargs.command(CheckPrivateKeyModule)

yargs
  .demandCommand()
  .help()
  .parse()
