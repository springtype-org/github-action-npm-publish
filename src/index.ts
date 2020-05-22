import {info, setFailed} from "@actions/core";
import {getActionInput} from "./function/get-action-input";
import {getGithubInput} from "./function/get-github-input";
import {createTag} from "./function/create-tag";
import {getPackageVersion} from "./function/get-package-version";
import {exec} from "@actions/exec";
import {installPackages} from "./function/install-packages";
import {writeFileSync} from "fs";

//IIFE ->  Immediately-invoked Function Expression
(async () => {
    try {
        const mergedInput = {...getActionInput(), ...getGithubInput()};

        let packageVersion = await getPackageVersion(mergedInput);

        if (packageVersion.publishedVersions.find(v => packageVersion.currentPackageVersion === v)) {
            info(`Package already published ${packageVersion.currentPackageVersion}`)
            return;
        }

        await installPackages(mergedInput);

        //login
        //<npm-registry>:8080/:_authToken=$AUTH_TOKEN
        await exec(`env`);
        writeFileSync('.npmrc', `//registry.npmjs.org:8080/:_authToken=${mergedInput.authToken}`);
        await exec(`ls -lisha`);
        await exec(`cat .npmrc`);

        await exec(`npm publish ${mergedInput.projectBuildDir}`);

        if (mergedInput.createTag) {
            await createTag(mergedInput, packageVersion.currentPackageVersion);
        }

    } catch (error) {
        setFailed(error.message);
    }
})();
