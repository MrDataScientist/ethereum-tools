import * as fs from "fs-extra"
import * as R from "ramda"
import chalk from "chalk"

export class CommonUtils {
  public static printRed = (value: string) => {
    console.log(chalk.red(value))
  }

  public static printGreen = (value: string) => {
    console.log(chalk.green(value))
  }

  public static printFatal = (value: string) => {
    console.log(chalk.red(value))
    process.exit(1)
  }

  public static checkRequiredOptionsWithFatal(config: any, options: string[]) {
    for (const option of options) {
      if (!config[option]) {
        console.log(chalk.red(`Option '${option}' is required`))
        process.exit(1)
      }
    }
  }

  public static readConfigFile(path: string, options: string[]) {
    if (!fs.existsSync(path)) {
      CommonUtils.printFatal("Can't find config file: " + path)
    }
    try {
      const data = JSON.parse(fs.readFileSync(path, "utf8"))
      return R.pick(options)(data)
    } catch (err) {
      CommonUtils.printFatal("Parse config file error: " + err.message)
    }
  }

  public static readFileAsJsonOrFatal(path: string) {
    if (!fs.existsSync(path)) {
      CommonUtils.printFatal("Can't find file: " + path)
    }
    try {
      return JSON.parse(fs.readFileSync(path, "utf8"))
    } catch (err) {
      CommonUtils.printFatal(`Parse JSON error in file ${path}: ${err.message}`)
    }
  }
}
