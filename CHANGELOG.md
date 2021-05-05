# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [3.0.2](https://github.com/gkadillak/redux-feature-data/compare/v3.0.1...v3.0.2) (2021-05-05)


### Bug Fixes

* **sagas:** don't cancel previous actions ([7094e5f](https://github.com/gkadillak/redux-feature-data/commit/7094e5fdc19875a5d54d3f2c090b952c4d8af37a))

### [3.0.1](https://github.com/gkadillak/redux-feature-data/compare/v3.0.0...v3.0.1) (2021-05-03)


### Bug Fixes

* **featureslice.ts:** merge fetched data ([acd5f76](https://github.com/gkadillak/redux-feature-data/commit/acd5f763ac2045e4608ae5ad6da7157cd470213c))

## [3.0.0](https://github.com/gkadillak/redux-feature-data/compare/v2.0.4...v3.0.0) (2021-04-21)


### ⚠ BREAKING CHANGES

* **featuresagas.ts:** Named params are now required for the public sagas

### Features

* **featuresagas.ts:** expose public sagas to be used with named params rather than actions ([f84525c](https://github.com/gkadillak/redux-feature-data/commit/f84525cc712e387f4cd517379c5067ab0f9c73a7))

### [2.0.4](https://github.com/gkadillak/redux-feature-data/compare/v2.0.2...v2.0.4) (2021-04-01)


### Bug Fixes

* **featuresagas.ts:** actually invoke the callback for the create entity action ([60bfe60](https://github.com/gkadillak/redux-feature-data/commit/60bfe60b60958f7710498fc5b225014bb9239c95))
* **featuresagas.ts:** allow format to include generators ([3541fcf](https://github.com/gkadillak/redux-feature-data/commit/3541fcf1b4dae485a6f93c06ff8932eb8bfef0ac))
* **featureslice.ts:** update deepmerge logic to concat arrays ([fcbbf8e](https://github.com/gkadillak/redux-feature-data/commit/fcbbf8e61f6eae0767aa4eb19332726804d71982))

### [2.0.3](https://github.com/gkadillak/redux-feature-data/compare/v2.0.2...v2.0.3) (2021-03-31)


### Bug Fixes

* **featuresagas.ts:** actually invoke the callback for the create entity action ([60bfe60](https://github.com/gkadillak/redux-feature-data/commit/60bfe60b60958f7710498fc5b225014bb9239c95))
* **featuresagas.ts:** allow format to include generators ([2657939](https://github.com/gkadillak/redux-feature-data/commit/265793929bc860fade8953b4632bf00d0d61f7cc))

### [2.0.2](https://github.com/gkadillak/redux-feature-data/compare/v2.0.1...v2.0.2) (2021-03-27)

### [2.0.1](https://github.com/gkadillak/redux-feature-data/compare/v2.0.0...v2.0.1) (2021-03-26)

## [2.0.0](https://github.com/gkadillak/redux-feature-data/compare/v1.0.7...v2.0.0) (2021-03-26)


### ⚠ BREAKING CHANGES

* **featureselectors.ts:** All selector callsites need to be updated

### Features

* **featureselectors.ts:** use named parameters for selectors ([3cf95c4](https://github.com/gkadillak/redux-feature-data/commit/3cf95c43004e835712a86b15ab7c3bcd5d822949))
