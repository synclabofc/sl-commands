import mongoose, { Connection } from 'mongoose';
import Events from './enums/Events';
import BlueyCommands from '.';

const results: {
	[name: number]: string;
} = {
	0: 'Disconnected',
	1: 'Connected',
	2: 'Connecting',
	3: 'Disconnecting',
};

export default async (
	handler: BlueyCommands,
	mongoPath: string,
	dbOptions = {}
) => {
	const options = {
		keepAlive: true,
		...dbOptions,
	};
	await mongoose.connect(mongoPath, options);

	const { connection } = mongoose;
	const state = results[connection.readyState] || 'Unknown';
	handler.emit(Events.DATABASE_CONNECTED, connection, state);
};

export const getMongoConnection = (): Connection => {
	return mongoose.connection;
};
