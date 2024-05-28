import { context, getOctokit } from '@actions/github';
import { debug } from '@actions/core';
import { IGithubEnvironment } from './get-github-input';
import { IActionInput } from './get-action-input';

export const createTag = async (
  mergedInput: IGithubEnvironment & IActionInput,
  currentTag: string
) => {
  const gitClient = getOctokit(mergedInput.token).rest.git;

  debug(`Pushing new tag to the repo`);
  const tagCreateResponse = await gitClient.createTag({
    ...context.repo,
    tag: currentTag,
    message: `Released version ${currentTag}`,
    object: mergedInput.sha,
    type: 'commit',
  });

  const tagSha = tagCreateResponse.data.sha;

  debug(`Pushing new tag to the repo`);
  await gitClient.createRef({
    ...context.repo,
    ref: `refs/tags/${currentTag}`,
    sha: tagSha,
  });
};
