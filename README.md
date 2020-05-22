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

- **create_tag** _(optional)_ - create a tag in git repository default false.
- **project_build_dir** _(optional)_ - the destination folder for publishing default dist.
- **install_build_packages** _(optional)_ - install packages before publishing default false.