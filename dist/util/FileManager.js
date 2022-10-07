"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileManager = void 0;
const fs_1 = require("fs");
class FileManager {
    static getAllFiles(path) {
        const files = (0, fs_1.readdirSync)(path, {
            withFileTypes: true,
        });
        let resFiles = [];
        for (const file of files) {
            if (file.isDirectory()) {
                resFiles = [...resFiles, ...this.getAllFiles(`${path}/${file.name}`)];
            }
            else if ((file.name.endsWith('.ts') || file.name.endsWith('.js')) &&
                !file.name.startsWith('!')) {
                resFiles.push(`${path}/${file.name}`);
            }
        }
        return resFiles;
    }
    static async import(path) {
        let file = await Promise.resolve().then(() => __importStar(require(path)));
        return file?.default ? file.default : file;
    }
}
exports.FileManager = FileManager;
