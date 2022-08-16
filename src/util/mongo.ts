import mongoose, { Connection } from 'mongoose'
import SLHandler from '..'

const results: {
	[name: number]: string
} = {
	0: 'Disconnected',
	1: 'Connected',
	2: 'Connecting',
	3: 'Disconnecting',
}

export const mongo = async (
	handler: SLHandler,
	mongoPath: string,
	dbOptions = {}
) => {
	const options = {
		keepAlive: true,
		...dbOptions,
	}
	await mongoose.connect(mongoPath, options)

	const { connection } = mongoose
	const state = results[connection.readyState] || 'Unknown'
	handler.emit('databaseConnected', connection, state)
}

export const getMongoConnection = (): Connection => {
	return mongoose.connection
}
