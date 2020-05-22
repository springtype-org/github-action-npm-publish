import {getInput} from "@actions/core";

export interface IActionInput {
    projectBuildDir: string;
    createTag: boolean;
    installBuildPackages: boolean;
}

export const getActionInput = (): IActionInput => {
    return {
        createTag: getInput("create_tag") === "true",
        projectBuildDir: getInput("project_build_dir") || "dist",
        installBuildPackages: getInput("install_build_packages")  === "true",
    }
}

