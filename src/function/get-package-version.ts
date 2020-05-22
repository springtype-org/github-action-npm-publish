import {join} from "path";
import {existsSync, readFileSync} from "fs";
import {IActionInput} from "./get-action-input";
import {IGithubEnvironment} from "./get-github-input";
import {exec} from "./promise-action-exec";

interface PackageInfo {
    name: string;
    version: string
}
export interface PackageVersion {
    currentPackageVersion: string;
    publishedVersions: Array<string>;
}

export const getPackageVersion = async (mergedInput: IActionInput & IGithubEnvironment):Promise<PackageVersion> => {
    const packageJsonPath = join(mergedInput.projectBuildDir, `package.json`);

    if (!existsSync(packageJsonPath)) {
        throw new Error(`Missing package json in project build directory (${packageJsonPath}).`)
    }

    const packageInfo = JSON.parse(readFileSync(packageJsonPath).toString('utf8')) as PackageInfo;

    const publishedVersions = JSON.parse(await exec(`npm show ${packageInfo.name} versions`).then(v => v.stdout.trim().replace(/'/g,'"')));

    return {
        currentPackageVersion: packageInfo.version,
        publishedVersions,
    }
}