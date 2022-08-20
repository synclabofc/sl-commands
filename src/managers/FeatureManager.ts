import { FeatureFunction, TimedFunction } from '../structures'

class FeatureManager {
	readonly initFunctions: FeatureFunction[] = []
	readonly timedFunctions: TimedFunction[] = []

	registerFunction(featureFunction: FeatureFunction | TimedFunction) {
		if (typeof featureFunction === 'function') {
			this.initFunctions.push(featureFunction)
		} else if ('timedFunction' in featureFunction) {
			this.timedFunctions.push(featureFunction)
		}
	}
}

export = new FeatureManager()
