import chalk from 'chalk';
const { log } = console;

export class Logger {
  /**
   * @param {string} hex - The HEX code
   */
  static hex(hex: string) {
    return chalk.hex(hex);
  }

  /**
   * @param {string} hex - The HEX code
   */
  static bgHex(hex: string) {
    return chalk.bgHex(hex);
  }

  /**
   * @param {string} hex - The HEX code
   * @param {string} prefix - The [PREFIX]
   */
  static create(hex: string, prefix: string) {
    return chalk.white('[') + Logger.hex(hex)(prefix) + chalk.white(']');
  }

  /**
   * @param {string[]} ...args - Anything you want to log with warn as prefix
   */
  static warn(...args: any[]) {
    log(Logger.create('#ffffcc', 'WARN'), ...args);
  }

  /**
   * @param {string[]} ...args - Anything you want to log with error as prefix
   */
  static error(...args: any[]) {
    log(Logger.create('#f64747', 'ERROR'), ...args);
  }

  /**
   * @param {string[]} ...args - Anything you want to log with success as prefix
   */
  static success(...args: any[]) {
    log(Logger.create('#93faa5', 'SUCCESS'), ...args);
  }

  /**
   * @param {string} tag - The [PREFIX], it can be whatever you want
   * @param {string} hex - The HEX code
   */
  static custom(tag: string, hex: string, ...args: any[]) {
    log(Logger.create(hex, tag), ...args);
  }

  /**
   * @param {string} tag - The [PREFIX], it can be whatever you want
   * @param {string[]} ...args - Anything you want to log with the provided tag as prefix
   */
  static tag(tag: string, ...args: any[]) {
    log(Logger.create('#6bb9f0', tag), ...args);
  }
}
