# GitHub Action NPM-Publish

A Github Action to automatically get version of package.json and publish to npm.

## Usage

```yaml
name: Publish NPM-Package
on:
  push:
    branches:
      - master
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@master
      - name: Bump version and push tag
        uses: springtype-org/github-tag-action@master
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
```

### Inputs

- **github_token** _(required)_ - Required for permission to tag the repo. Usually `${{ secrets.GITHUB_TOKEN }}`.
- **create_tag** _(optional)_ - create a tag in git repository.