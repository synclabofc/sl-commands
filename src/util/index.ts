import { FileManager } from './FileManager';
import { Logger } from './logger';
import { Mongo } from './mongo';
import { Validators } from './validators';

class Util {
  static FileManager = FileManager;
  static Validators = Validators;
  static Logger = Logger;
}

export { FileManager, Logger, Mongo, Validators };
export default Util;
