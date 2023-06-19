import mongoose from 'mongoose';
import SLHandler from '..';

const results = {
  99: 'Uninitialized',
  0: 'Disconnected',
  1: 'Connected',
  2: 'Connecting',
  3: 'Disconnecting',
};

export class Mongo {
  constructor(
    public handler: SLHandler,
    public mongoUri: string,
    public dbOptions = {},
  ) {}

  async connect() {
    const options = {
      keepAlive: true,
      ...this.dbOptions,
    };

    await mongoose.connect(this.mongoUri, options);

    const { connection } = mongoose;
    const state = results[connection?.readyState] || 'Unknown';
    this.handler.emit('databaseConnected', connection, state);
  }

  static getConnection() {
    return mongoose.connection;
  }
}
