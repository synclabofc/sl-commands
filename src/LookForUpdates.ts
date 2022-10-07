import packageJson from 'package-json'
import SemVer from 'semver'
import chalk from 'chalk'
import boxen from 'boxen'
import fs from 'fs'

export default async function lookForUpdates() {
	const { dependencies } = JSON.parse(
		fs.readFileSync('../package.json') as unknown as string
	)

	const currentVersion = dependencies['sl-commands'] as string
	const { version: latestVersion } = await packageJson('sl-commands')

	const updateAvailable = SemVer.lt(currentVersion, latestVersion as string)

	if (updateAvailable) {
		const msg = {
			updateAvailable: `Update available ${chalk.dim(
				currentVersion
			)} → ${chalk.green(latestVersion)}`,
			runUpdate: `Run ${chalk.cyan(`npm i sl-commands@latest`)} to update`,
		}

		console.log(
			boxen(`${msg.updateAvailable}\n${msg.runUpdate}`, {
				align: 'center',
				padding: 1,
				margin: 1,
			})
		)
	}
}
