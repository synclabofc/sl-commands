import FeatureManager from '../managers/FeatureManager';
import { s } from '@sapphire/shapeshift';
import { Client } from 'discord.js';
import SLHandler from '..';

function checkNumber(value: unknown): asserts value is number {
  s.number.parse(value);
}

export type FeatureFunction = (ctx: {
  client: Client;
  handler: SLHandler;
}) => any;

export type TimedFunction = {
  timedFunction: FeatureFunction;
  interval: number;
};

export class Feature {
  /**
   * Will executed once when the handler starts
   *
   * @param initFunction - The function which will be executed
   */
  setInit(initFunction: FeatureFunction) {
    FeatureManager.registerFunction(initFunction);

    return this;
  }

  /**
   * Adds a new timed function which will be executed according to the provided interval
   *
   * @param timedFunction - The function which will be executed
   * @param interval - How much time to wait before running again in milliseconds
   */
  addTimed(timedFunction: FeatureFunction, interval: number) {
    checkNumber(interval);

    FeatureManager.registerFunction({ timedFunction, interval });

    return this;
  }
}
