import { Client } from 'discord.js';
import { existsSync } from 'fs';
import SLCommands from '.';
import { glob } from 'glob';

class FeatureHandler {
	constructor(handler: SLCommands, dir: string) {
		if (!dir) return;

		if (!existsSync(dir)) {
			handler.logger.error(`The directory '${dir}' does not exists.`);
			return;
		}

		try {
			this.load(handler, dir);
		} catch (e) {
			handler.logger.error(`Ocurred an error while loading features.\n`, e);
		}
	}

	private load(handler: SLCommands, dir: string) {
		let { client } = handler;
		dir += '/**/*{.ts,.js}';

		let files = glob.sync(dir);

		for (let file of files) {
			let feature: (
				client: Client,
				handler: SLCommands,
				...args: any[]
			) => any = require(file)?.default;

			if (feature) feature(client, handler);
		}

		if (handler.log) {
			handler.logger.tag('FEATURES', `Loaded ${files.length} features.`);
		}
	}
}

export = FeatureHandler;
