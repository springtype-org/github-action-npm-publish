import fetch from 'node-fetch';
import { join } from 'path';
import { existsSync, readFileSync } from 'fs';
import { IActionInput } from './get-action-input';
import { IGithubEnvironment } from './get-github-input';

interface PackageInfo {
  name: string;
  version: string;
}
export interface PackageVersion {
  currentPackageVersion: string;
  publishedVersions: Array<string>;
}

export const download = async <Response>(
  url: string,
  settings = { method: 'GET' }
) => {
  const response = await fetch(url, settings);
  return (await response.json()) as Promise<Response>;
};

export const getPackageInfo = async (
  mergedInput: IActionInput & IGithubEnvironment
): Promise<PackageInfo> => {
  const packageJsonPath = join(mergedInput.projectBuildDir, `package.json`);

  if (!existsSync(packageJsonPath)) {
    throw new Error(
      `Missing package json in project build directory (${packageJsonPath}).`
    );
  }

  return JSON.parse(
    readFileSync(packageJsonPath).toString('utf8')
  ) as PackageInfo;
};

export const getPackageVersion = async (
  packageInfo: PackageInfo
): Promise<PackageVersion> => {
  const publishedVersions: Array<string> = await download<{ versions: {} }>(
    `https://registry.npmjs.org/${packageInfo.name}`
  )
    .then((value) => value.versions || {})
    .then((versions) => Object.keys(versions));

  return {
    currentPackageVersion: packageInfo.version,
    publishedVersions,
  };
};

export const getPackageScope = (packageInfo: PackageInfo): string | null => {
  const { name: packageName } = packageInfo;
  if (packageName.startsWith('@')) {
    const endIndex = packageName.indexOf('/', 1);
    return endIndex !== -1 ? packageName.slice(0, endIndex) : null;
  }
  return null;
};
