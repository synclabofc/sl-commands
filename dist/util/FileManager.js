"use strict";
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
    static import(path) {
        let file = require(path);
        return file?.default ? file.default : file;
    }
}
exports.FileManager = FileManager;
