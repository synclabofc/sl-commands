import boxen from 'boxen';
import chalk from 'chalk';
import { readFileSync } from 'fs';
import latestPackage from 'latest-version';
import { join } from 'path';
import SemVer from 'semver';

async function lookForUpdates() {
  const { version } = JSON.parse(
    readFileSync(join(__dirname, '..', 'package.json'), 'utf8'),
  );

  const currentVersion = version.replace(/[^0-9.]/g, '');
  const latestVersion = await latestPackage('sl-commands');

  if (SemVer.lt(currentVersion, latestVersion)) {
    console.log(
      boxen(
        `Update available ${chalk.dim(currentVersion)} → ${chalk.green(
          latestVersion,
        )}\nRun ${chalk.cyan('npm i sl-commands@latest')} to update`,
        {
          borderColor: 'cyanBright',
          title: 'sl-commands',
          align: 'center',
          padding: 1,
          margin: 1,
        },
      ),
    );
  }
}

export default lookForUpdates;
