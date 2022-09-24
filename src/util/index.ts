import { FileManager } from './FileManager'
import { Validators } from './Validators'
import { Logger } from './Logger'
import { Mongo } from './Mongo'

class Util {
	static FileManager = FileManager
	static Validators = Validators
	static Logger = Logger
}

export { FileManager, Validators, Logger, Mongo }
export default Util
