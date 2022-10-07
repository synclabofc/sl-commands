import chalk from 'chalk';
export declare class Logger {
    /**
     * @param {string} hex - The HEX code
     */
    static hex(hex: string): chalk.Chalk;
    /**
     * @param {string} hex - The HEX code
     */
    static bgHex(hex: string): chalk.Chalk;
    /**
     * @param {string} hex - The HEX code
     * @param {string} prefix - The [PREFIX]
     */
    static create(hex: string, prefix: string): string;
    /**
     * @param {string[]} ...args - Anything you want to log with warn as prefix
     */
    static warn(...args: any[]): void;
    /**
     * @param {string[]} ...args - Anything you want to log with error as prefix
     */
    static error(...args: any[]): void;
    /**
     * @param {string[]} ...args - Anything you want to log with success as prefix
     */
    static success(...args: any[]): void;
    /**
     * @param {string} tag - The [PREFIX], it can be whatever you want
     * @param {string} hex - The HEX code
     */
    static custom(tag: string, hex: string, ...args: any[]): void;
    /**
     * @param {string} tag - The [PREFIX], it can be whatever you want
     * @param {string[]} ...args - Anything you want to log with the provided tag as prefix
     */
    static tag(tag: string, ...args: any[]): void;
}
