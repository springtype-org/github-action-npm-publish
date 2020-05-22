import {getInput} from "@actions/core";

export interface IActionInput {
    projectBuildDir: string;
    createTag: boolean;
    installBuildPackages: boolean;
    authToken: string;
}

export const getActionInput = (): IActionInput => {
    const missing: Array<string> = [];

    const authToken = getInput("auth_token");

    if (!authToken) {
        missing.push("auth_token");
    }

    if (missing.length > 0) {
        throw new Error(`Missing input ${missing.join(' ')}`);
    }

    return {
        authToken,
        createTag: getInput("create_tag") === "true",
        projectBuildDir: getInput("project_build_dir") || "dist",
        installBuildPackages: getInput("install_build_packages") === "true",
    }
}

