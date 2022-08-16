import { s } from '@sapphire/shapeshift'
import { Client } from 'discord.js'
import SLHandler from '..'

function checkNumber(value: unknown): asserts value is number {
	s.number.parse(value)
}

export type FeatureCallback = (ctx: {
	client: Client
	handler: SLHandler
}) => any

export class SLFeature {
	/**
	 * The initialization function
	 */
	readonly initFunction?: FeatureCallback

	/**
	 * The timed functions
	 */
	readonly timeFunctions: { callback: FeatureCallback; interval: number }[] = []

	/**
	 * Will executed once when the handler starts
	 *
	 * @param callback - The function which will be executed
	 */
	setInit(callback: FeatureCallback) {
		Reflect.set(this, 'initFunction', callback)

		return this
	}

	/**
	 * Adds a new timed function which will be executed according to the provided interval
	 *
	 * @param callback - The function which will be executed
	 * @param interval - How much time to wait before running again in milliseconds
	 */
	addTimed(callback: FeatureCallback, interval: number) {
		checkNumber(interval)

		this.timeFunctions.push({ callback, interval })

		return this
	}
}
