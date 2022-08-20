import { FeatureFunction, TimedFunction } from '../structures'

class FeatureManager {
	readonly timedFunctions: TimedFunction[] = []
	readonly initFunctions: FeatureFunction[] = []

	registerFunction(featureFunction: TimedFunction | FeatureFunction) {
		if (typeof featureFunction === 'function') {
			this.initFunctions.push(featureFunction)
		} else if ('callback')

		this.timedFunctions.push(featureFunction)
	}
}

export = new FeatureManager()