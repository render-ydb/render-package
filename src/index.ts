import path = require('path');
import fse = require('fs-extra');
// @ts-ignore
import npminstall = require('npminstall');
import { log } from '@x.render/render-node-utils';
import { USER_HOME_PATH } from '@x.render/render-node-utils/lib/constant';
import getNpmPkgLatestVersion = require('@x.render/render-node-utils/lib/getNpmPkgLatestVersion');
import pathExists = require('path-exists');

interface Options {
  version?: string;
  pkgName: string;
  storePath?: string;
  registry?: string;
}

class Package {
  version?: string;
  pkgName: string;
  storePath?: string;
  pkgPath?: string;
  registry?: string;
  constructor(
    options: Options = {
      pkgName: '',
    },
  ) {
    this.version = options.version || 'latest';
    this.pkgName = options.pkgName;
    this.storePath = options.storePath || 'packages';
    this.registry = options.registry || 'https://registry.npmjs.org';
  }

  async prepare() {
    if (this.version === 'latest') {
      this.version = await this.getNpmPkgLatestVersion();
    }
    this.pkgPath = path.resolve(USER_HOME_PATH, this.storePath);
    fse.ensureDir(this.pkgPath);
  }

  async getNpmPkgLatestVersion() {
    return await getNpmPkgLatestVersion(this.pkgName, this.registry);
  }

  async install(version?: string) {
    await this.prepare();
    version = version || this.version;
    if (await this.isLocalPkgExist(version)) {
      log.debug(
        'the current version package already exists, no download operation be executed.',
      );
      return;
    }
    await this.deleteOldVersionPkg();

    await npminstall({
      root: this.pkgPath,
      storeDir: path.resolve(this.pkgPath, this.pkgName),
      pkgs: [
        {
          name: this.pkgName,
          version,
        },
      ],
    });
  }

  async canUpdated() {
    const latestVersion = await this.getNpmPkgLatestVersion();
    if (latestVersion === this.version) {
      return null;
    }
    if (await this.isLocalPkgExist(latestVersion)) {
      return null;
    }
    return latestVersion;
  }

  async isLocalPkgExist(version?: string) {
    return pathExists.sync(await this.localPkgPath(version));
  }

  async update() {
    await this.prepare();
    const latestVersion = await this.canUpdated();

    if (latestVersion) {
      await this.install(latestVersion);
    }
  }

  async deleteOldVersionPkg() {
    fse.emptyDirSync(path.resolve(this.pkgPath, this.pkgName));
  }

  async localPkgPath(version: string) {
    await this.prepare();
    let { pkgName } = this;

    // handing package paths with '@' symbols
    if (pkgName.startsWith('@')) {
      pkgName = pkgName.replace(/\//g, '_');
    }
    return path.resolve(
      this.pkgPath,
      this.pkgName,
      `_${pkgName}@${version || this.version}@${this.pkgName}`,
    );
  }

  async getPkgCachePath() {
    if (await this.isLocalPkgExist(this.version)) {
      return await this.localPkgPath(this.version);
    }
  }
}

export = Package;
