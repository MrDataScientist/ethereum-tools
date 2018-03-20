import chalk from "chalk"

export class CommonUtils {
  public static printRed = (value: string) => {
    console.log(chalk.red(value))
  }

  public static printGreen = (value: string) => {
    console.log(chalk.green(value))
  }
}
