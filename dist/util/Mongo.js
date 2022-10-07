"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mongo = void 0;
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
const results = {
    99: 'Uninitialized',
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting',
};
class Mongo {
    handler;
    mongoUri;
    dbOptions;
    constructor(handler, mongoUri, dbOptions = {}) {
        this.handler = handler;
        this.mongoUri = mongoUri;
        this.dbOptions = dbOptions;
    }
    async connect() {
        const options = {
            keepAlive: true,
            ...this.dbOptions,
        };
        await mongoose_1.default.connect(this.mongoUri, options);
        const { connection } = mongoose_1.default;
        const state = results[connection?.readyState] || 'Unknown';
        this.handler.emit('databaseConnected', connection, state);
    }
    static getConnection() {
        return mongoose_1.default.connection;
    }
}
exports.Mongo = Mongo;
