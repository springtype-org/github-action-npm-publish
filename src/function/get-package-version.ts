import fetch from "node-fetch"
import {join} from "path";
import {existsSync, readFileSync} from "fs";
import {IActionInput} from "./get-action-input";
import {IGithubEnvironment} from "./get-github-input";
import {warning} from "@actions/core";

interface PackageInfo {
    name: string;
    version: string
}
export interface PackageVersion {
    currentPackageVersion: string;
    publishedVersions: Array<string>;
}


export const download = async (url: string, settings = {method: 'GET'}) =>{
    const response = await fetch(url, settings);
    return await response.json();
}


export const getPackageVersion = async (mergedInput: IActionInput & IGithubEnvironment):Promise<PackageVersion> => {
    const packageJsonPath = join(mergedInput.projectBuildDir, `package.json`);

    if (!existsSync(packageJsonPath)) {
        throw new Error(`Missing package json in project build directory (${packageJsonPath}).`)
    }

    const packageInfo = JSON.parse(readFileSync(packageJsonPath).toString('utf8')) as PackageInfo;

    const publishedVersions: Array<string> = await download(`https://registry.npmjs.org/${packageInfo.name}`)
        .then(value => value.versions )
        .then(versions => Object.keys(versions));

    return {
        currentPackageVersion: packageInfo.version,
        publishedVersions,
    }
}