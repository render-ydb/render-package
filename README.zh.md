# render-package

<p>
<a href="https://www.npmjs.com/package/@x.render/render-package" target="__blank"><img src="https://img.shields.io/npm/v/@x.render/render-package" alt="NPM version" /></a>

<a href="https://www.npmjs.com/package/@x.render/render-package" target="__blank"><img src="https://img.shields.io/npm/dm/%40x.render%2Frender-package" alt="NPM Downloads" /></a>

</p>

[英文文档](./README.md)

## 介绍

下载 node pacakge 到指定位置

## 使用

```sh
npm i @x.render/render-package -S
```

```javascript
const Package = require("@x.render/render-package");
const package = new Package(options);
```

### 选项

| 名称      | 描述         | 类型   | 必填 | default  |
| --------- | ------------ | ------ | ---- | -------- |
| version   | 包版本       | string | 否   | latest   |
| pkgName   | 包名称       | string | 是   | null     |
| storePath | 包的存储目录 | string | 否   | packages |

### 使用示例

下面是一些使用示例

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
