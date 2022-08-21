import { Dirent, readdirSync } from 'fs'

export class FileManager {
	static getAllFiles(path: string) {
		const files: Dirent[] = readdirSync(path, {
			withFileTypes: true,
		})

		let resFiles: string[] = []

		for (const file of files) {
			if (file.isDirectory()) {
				resFiles = [...resFiles, ...this.getAllFiles(`${path}/${file.name}`)]
			} else if (
				(file.name.endsWith('.ts') || file.name.endsWith('.js')) &&
				!file.name.startsWith('!')
			) {
				resFiles.push(`${path}/${file.name}`)
			}
		}

		return resFiles
	}

	static import(path: string) {
		let file = require(path)
		return file?.default ? file.default : file
	}
}
