# render-package

<p>
<a href="https://www.npmjs.com/package/@x.render/render-package" target="__blank"><img src="https://img.shields.io/npm/v/@x.render/render-package" alt="NPM version" /></a>

<a href="https://www.npmjs.com/package/@x.render/render-package" target="__blank"><img src="https://img.shields.io/npm/dm/%40x.render%2Frender-package" alt="NPM Downloads" /></a>

</p>

[中文文档](./README.zh.md)

## Introduce

Download the node package to the specified location

## Usage

```sh
npm i @x.render/render-package -S
```

```javascript
const package = new Package(options);
```

### options

| name      | description               | type   | required | default  |
| --------- | ------------------------- | ------ | -------- | -------- |
| version   | package version           | string | no       | latest   |
| pkgName   | package name              | string | yes      | null     |
| storePath | Package storage directory | string | no       | packages |

### Usage examples

Here are some usage examples

```javascript
const package = new Package({
  version: "18.0.0",
  pkgName: "react",
  storePath: "packages",
});

// start download
await package.install();

// Get storage path
const pkgPath = await package.getPkgCachePath();
console.log(pkgPath); // such as: /Users/render/render-package/packages/react/_react@18.0.0@react

// update package
if (await package.canUpdated()) {
  await package.update();
  const pkgPath = await package.getPkgCachePath();
  console.log(pkgPath); // such as: /Users/render/render-package/packages/react/_react@18.2.0@react
}
```
