<h1 align="center">github-action-npm-publish</h1>

> This GitHub Action automates the process of publishing npm packages. It simplifies the workflow for JavaScript and TypeScript projects by integrating seamlessly with your CI/CD pipeline. With this action, you can automatically publish your npm package whenever changes are pushed to your repository, ensuring that your package is always up-to-date with the latest commits.

<h2 align="center">User Stories</h2>

1. As a developer, I want to automate the npm publishing process to save time and reduce manual errors.
2. As a developer, I want to ensure that my npm package is published whenever changes are pushed to the main branch.

<h2 align="center">Features</h2>

- ✅ Automates npm package publishing
- ✅ Integrates seamlessly with GitHub Actions workflows
- ✅ Supports scoped packages
- ✅ Configurable to run on specific branches or tags
- ✅ Securely handles npm authentication
- ✅ Provides detailed logs for troubleshooting
- ✅ Supports both JavaScript and TypeScript projects
- ✅ Easily configurable via `npmrc` settings

<h2 align="center">Example Usage</h2>

<h3 align="center">Setup</h3>

1. **Create a GitHub Workflow File**:
   Add a new YAML file in `.github/workflows/` (e.g., `publish.yml`):

   ```yaml
   name: Publish to npm

   on:
     push:
       branches:
         - main

   jobs:
     publish:
       runs-on: ubuntu-latest

       steps:
         - name: Checkout code
           uses: actions/checkout@v2

         - name: Setup Node.js
           uses: actions/setup-node@v2
           with:
             node-version: '14'

         - name: Install dependencies
           run: npm install

         - name: Publish to npm
           uses: your-username/github-action-npm-publish@v1
           with:
             authToken: ${{ secrets.NPM_AUTH_TOKEN }}
             registry: 'https://registry.npmjs.org/'
   ```

2. **Set Up npm Authentication**:
   Store your npm authentication token as a secret in your GitHub repository settings. Go to `Settings > Secrets` and add a new secret named `NPM_AUTH_TOKEN` with your npm token.

<h3 align="center">Using the Action</h3>

- **Publishing**:
  The action will automatically publish your package to npm whenever you push changes to the `main` branch (or any other branch you configure).

```yaml
- name: Publish to npm
  uses: your-username/github-action-npm-publish@v1
  with:
    authToken: ${{ secrets.NPM_AUTH_TOKEN }}
    registry: 'https://registry.npmjs.org/'
```

<h2 align="center">Configuration</h2>

- **authToken**: The npm authentication token. Store it securely in GitHub secrets.
- **registry**: The npm registry URL (default: `https://registry.npmjs.org/`).

<h2 align="center">Troubleshooting</h2>

- Ensure that the `NPM_AUTH_TOKEN` secret is correctly set in your GitHub repository.
- Verify that the workflow file is correctly configured and located in the `.github/workflows/` directory.
- Check the action logs in the GitHub Actions tab for detailed error messages and troubleshooting steps.

<h2 align="center">Support</h2>

For any issues or feature requests, please open an issue on the [GitHub repository](https://github.com/your-username/github-action-npm-publish/issues).

---

This action simplifies and automates the npm publishing process, ensuring that your packages are always up-to-date with minimal manual intervention.