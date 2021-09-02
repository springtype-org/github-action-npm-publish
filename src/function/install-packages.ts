import {IGithubEnvironment} from "./get-github-input";
import {IActionInput} from "./get-action-input";
import {join} from "path";
import {existsSync} from "fs";
import {info} from "@actions/core";
import {exec} from "./promise-action-exec";

export const installPackages = async (mergedInput: IGithubEnvironment & IActionInput) => {

    if (mergedInput.installBuildPackages) {
        if (existsSync(join(mergedInput.projectBuildDir, "package-lock.json"))) {
            info("Skip: already installed via npm")
            return;
        }

        if (existsSync(join(mergedInput.projectBuildDir, "yarn.lock"))) {
            info("Skip: already installed via yarn")
            return;
        }

        await exec(`npm --prefix ${mergedInput.projectBuildDir} install --production`);
    }
}