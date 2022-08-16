import { FileManager } from '../util/files';
import SLHandler, { SLFeature } from '..'
import { Logger } from '../util/logger';
import { Collection } from 'discord.js'
import { existsSync } from 'fs'

class FeatureHandler {
	private _features = new Collection<string, SLFeature>()

	constructor(handler: SLHandler, dir: string) {
		if (!dir) return

		if (!existsSync(dir)) {
			Logger.error(`The directory '${dir}' does not exists.`)
			return
		}

		try {
			this.load(handler, dir)
		} catch (e) {
			Logger.error(`Ocurred an error while loading features.\n`, e)
		}
	}

	private load(handler: SLHandler, dir: string) {
		const files = FileManager.getAllFiles(dir)

		for (const file of files) {
			const feature: SLFeature = FileManager.import(file)

			if (feature && feature instanceof SLFeature) {
				feature.initFunction?.({ client: handler.client, handler })

				for (const { callback, interval } of feature.timeFunctions) {
					setInterval(() => {
						callback?.({ client: handler.client, handler })
					}, interval)
				}
			}
		}

		Logger.tag('FEATURES', `Loaded ${files.length} features.`)
	}

	/** The features collection */
	public get features() {
		return this._features
	}
}

export = FeatureHandler
