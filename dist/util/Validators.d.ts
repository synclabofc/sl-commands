import { HandlerOptions, SLPermission } from '../types';
import messages from '../messages.json';
export declare class Validators {
    static stringCheck(value: unknown, errorMessage?: string, error?: ErrorConstructor, allowEmpty?: boolean): asserts value is string;
    static booleanCheck(value: unknown, errorMessage?: string, error?: ErrorConstructor): asserts value is boolean;
    static permissionsCheck(value: unknown, errorMessage?: string, error?: ErrorConstructor, allowEmpty?: boolean): asserts value is SLPermission[];
    static functionCheck(value: unknown, errorMessage?: string, error?: ErrorConstructor): asserts value is Function;
    static handlerOptionsCheck(value: unknown): asserts value is HandlerOptions;
    static messagesCheck(value: unknown): asserts value is typeof messages;
}
