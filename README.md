## ts-jsonschema-sync

监测 ts 的 interface 定义，一有改动，同步生成 json schema。

Monitor the interface definition of ts and generate JSON schema synchronously once there is any modification.

## install

```
yarn add @yzfe/ts-jsonschema-sync
```

## use

```ts
import { getTypeNames, getSchemaObject } from '@yzfe/ts-jsonschema-sync'
import * as path from 'path'

const rootPath = path.join(__dirname, 'typings')

const types = getTypeNames({
    rootPath
})

console.log(types)

console.log(JSON.stringify(getSchemaObject(types[0], {
    rootPath
}), null, 2))
```
