import {setFailed, info} from "@actions/core";
import {getActionInput} from "./function/get-action-input";
import {getGithubInput} from "./function/get-github-input";
import {createTag} from "./function/create-tag";
import {getPackageVersion} from "./function/get-package-version";
import {exec} from "@actions/exec";

//IIFE ->  Immediately-invoked Function Expression
(async () => {
    try {
        const mergedInput = {...getActionInput(), ...getGithubInput()};

        let packageVersion = await getPackageVersion(mergedInput);

        if(packageVersion.publishedVersions.find(v => packageVersion.currentPackageVersion === v)){
            info(`Package already published ${packageVersion.currentPackageVersion}`)
            return;
        }

        await exec(`npm publish ${mergedInput.projectBuildDir}`);

        if (mergedInput.createTag) {
            await createTag(mergedInput, "version");
        }


    } catch (error) {
        setFailed(error.message);
    }
})();
