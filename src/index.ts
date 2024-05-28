import { info, setFailed, setOutput } from '@actions/core';
import { getActionInput } from './function/get-action-input';
import { getGithubInput } from './function/get-github-input';
import { createTag } from './function/create-tag';
import {
  getPackageInfo,
  getPackageScope,
  getPackageVersion,
} from './function/get-package-version';
import { exec } from '@actions/exec';
import { installPackages } from './function/install-packages';
import { writeFileSync } from 'fs';

//IIFE ->  Immediately-invoked Function Expression
(async () => {
  try {
    const mergedInput = { ...getActionInput(), ...getGithubInput() };

    let packageInfo = await getPackageInfo(mergedInput);
    let packageVersion = await getPackageVersion(packageInfo);
    let packageScope = await getPackageScope(packageInfo);

    setOutput('currentVersion', packageVersion.currentPackageVersion);

    if (
      packageVersion.publishedVersions.find(
        (v) => packageVersion.currentPackageVersion === v
      )
    ) {
      info(`Package already published ${packageVersion.currentPackageVersion}`);
      setOutput('published', false);
      return;
    }

    await installPackages(mergedInput);

    const lines = [
      `//${mergedInput.registry.replace(/^https?:\/\//, '')}:_authToken=${
        mergedInput.authToken
      }`,
      'email=bot@github-action-npm-publish.com',
      'always-auth=true',
      `registry=${mergedInput.registry}`,
      ,
    ];

    if (packageScope !== null) {
      `${packageScope}:registry=${mergedInput.registry}`;
    }

    writeFileSync('/home/runner/.npmrc', lines.join('\n'));

    await exec(`npm publish ${mergedInput.projectBuildDir} --access public`);
    setOutput('published', true);

    if (mergedInput.createTag) {
      await createTag(mergedInput, packageVersion.currentPackageVersion);
    }
  } catch (error) {
    if (typeof error === 'string') {
      setFailed(error);
    } else if (error instanceof Error) {
      setFailed(error);
    }
  }
})();
