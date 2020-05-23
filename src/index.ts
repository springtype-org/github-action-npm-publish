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

        const lines = [`//registry.npmjs.org/:_authToken=${mergedInput.authToken}`,
            `_auth=${mergedInput.authToken}`,
            'email=bot@github-action-npm-publish.com',
            'always-auth=true'];

        writeFileSync('/home/runner/.npmrc', lines.join('\n'))


        await exec(`npm publish ${mergedInput.projectBuildDir} --access public`);

        if (mergedInput.createTag) {
            await createTag(mergedInput, packageVersion.currentPackageVersion);
        }

    } catch (error) {
        setFailed(error.message);
    }
})();
