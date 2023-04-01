import { getTypeNames, getSchemaObject } from '../src'
import * as path from 'path'

const rootPath = path.join(__dirname, 'typings')

const types = getTypeNames({
    rootPath
})

console.log(types)

console.log(JSON.stringify(getSchemaObject(types[0], {
    rootPath
}), null, 2))
