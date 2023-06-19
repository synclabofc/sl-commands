import { s } from '@sapphire/shapeshift';
import messages from '../messages.json';
import permissions from '../permissions.json';
import { HandlerOptions, SLPermission } from '../types';

export class Validators {
  static stringCheck(
    value: unknown,
    errorMessage = `Expected a string, got ${value} instead.`,
    Error: ErrorConstructor = TypeError,
    allowEmpty = true,
  ): asserts value is string {
    if (typeof value !== 'string') {
      throw new Error(errorMessage);
    }

    if (!allowEmpty && value.length === 0) {
      throw new Error(errorMessage);
    }
  }

  static booleanCheck(
    value: unknown,
    errorMessage = `Expected a boolean, got ${value} instead.`,
    Error: ErrorConstructor = TypeError,
  ): asserts value is boolean {
    if (typeof value !== 'boolean') {
      throw new Error(errorMessage);
    }
  }

  static permissionsCheck(
    value: unknown,
    errorMessage = `Expected a permission array, got ${value} instead.`,
    Error: ErrorConstructor = SyntaxError,
    allowEmpty = true,
  ): asserts value is SLPermission[] {
    if (!Array.isArray(value)) {
      throw new Error(errorMessage);
    }

    if (!allowEmpty && value.length === 0) {
      throw new Error(errorMessage);
    }

    if (!value.every((e) => Object.keys(permissions['en-us']).includes(e))) {
      throw new Error(errorMessage);
    }
  }

  static functionCheck(
    value: unknown,
    errorMessage = `Expected a function, got a ${value} instead.`,
    Error: ErrorConstructor = TypeError,
  ): asserts value is Function {
    if (typeof value !== 'function') {
      throw new Error(errorMessage);
    }
  }

  static handlerOptionsCheck(value: unknown): asserts value is HandlerOptions {
    try {
      s.object({
        messagesPath: s.string.optional,
        featuresDir: s.string.optional,
        commandsDir: s.string.optional,
        eventsDir: s.string.optional,
        botToken: s.string,
        testServersIds: s.string.or(s.array(s.string)).optional,
        botDevsIds: s.string.or(s.array(s.string)).optional,
        language: s.string.regex(
          new RegExp(`${Object.keys(permissions).join('|')}|auto`),
        ).optional,
        clientOptions: s.object({}).passthrough.optional,
        dbOptions: s.object({}).passthrough.optional,
        showWarns: s.boolean.optional,
        testOnly: s.boolean.optional,
        mongoUri: s.string.optional,
      }).parse(value);
    } catch {
      throw new (class SLHandlerOptionsError extends Error {})(
        `SLCommands > Invalid provided handler options.`,
      );
    }
  }

  static messagesCheck(value: unknown): asserts value is typeof messages {
    try {
      s.object(
        Object.fromEntries(
          Object.entries(messages).map(([key]) => [
            key,
            s.object({
              'pt-br': s.string.optional,
              'en-us': s.string.optional,
            }),
          ]),
        ),
      ).parse(value);
    } catch {
      throw new (class SLHandlerOptionsError extends Error {})(
        `SLCommands > Invalid provided messages json.`,
      );
    }
  }
}
