import latestPackage from 'latest-version'
import SemVer from 'semver'
import chalk from 'chalk'
import boxen from 'boxen'
import fs from 'fs'

export async function lookForUpdates() {
	const { version } = JSON.parse(
		fs.readFileSync(__dirname + '/../package.json') as unknown as string
	)

	const currentVersion = version.replace(/[^0-9.]/g, '') as string
	const latestVersion = await latestPackage('sl-commands')

	const updateAvailable = SemVer.lt(currentVersion, latestVersion)

	if (updateAvailable) {
		const msg = {
			updateAvailable: `Update available ${chalk.dim(
				currentVersion
			)} → ${chalk.green(latestVersion)}`,
			runUpdate: `Run ${chalk.cyan(`npm i sl-commands@latest`)} to update`,
		}

		console.log(
			boxen(`${msg.updateAvailable}\n${msg.runUpdate}`, {
				borderColor: 'cyanBright',
				title: 'sl-commands',
				align: 'center',
				padding: 1,
				margin: 1,
			})
		)
	}

	return
}
