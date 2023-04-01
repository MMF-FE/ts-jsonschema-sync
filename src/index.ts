import * as TJS from 'typescript-json-schema'
import * as path from 'path'
import * as glob from 'glob'

const compilerOptions: TJS.CompilerOptions = {
    strictNullChecks: false,
    skipLibCheck: true,
    skipDefaultLibCheck: true,
    allowJs: true,
    strict: false,
    downlevelIteration: true,
}

const jsGenMap = new Map<string, TJS.JsonSchemaGenerator>()

/**
 * 取实例
 * @param rootPath
 * @returns
 */
function getJsGen(rootPath: string): TJS.JsonSchemaGenerator {
    const gen = jsGenMap.get(rootPath)
    if (gen) {
        return gen
    }

    const includeFiles = glob.sync(path.join(rootPath, '**/*.ts'))
    const program = TJS.getProgramFromFiles(
        includeFiles,
        compilerOptions,
        rootPath
    )

    const jsGen = TJS.buildGenerator(program, {
        required: true,
    })
    if (!jsGen) {
        throw new Error('init error')
    }
    jsGenMap.set(rootPath, jsGen)

    return jsGen
}

export function clearDefinitions(schema: any) {
    if (!schema.definitions) {
        return schema
    }
    const clone = JSON.parse(JSON.stringify(schema))
    const definitions = clone.definitions
    delete clone.definitions
    const json = JSON.stringify(clone, null, 2)
    const keys = Object.keys(definitions)
    const defJons: string[] = []
    const hasKeys: string[] = []
    for (const key of keys) {
        let isHas = json.includes(key)

        if (!isHas) {
            for (const j of defJons) {
                if (j.includes(key)) {
                    isHas = true
                    break
                }
            }
        }

        if (isHas) {
            hasKeys.push(key)
            defJons.push(JSON.stringify(definitions[key], null, 2))
        }
    }

    keys.forEach((key) => {
        if (!hasKeys.includes(key)) {
            delete definitions[key]
        }
    })

    return {
        ...schema,
        definitions: hasKeys.length > 0 ? definitions : undefined,
    }
}

export interface Options {
    rootPath: string
    namespace?: string
}

export function getTypeNames(options: Options) {
    const { namespace = 'API' } = options
    const jsGen = getJsGen(options.rootPath)

    const types = jsGen
        .getUserSymbols()
        .filter((v) => v.startsWith(namespace + '.'))

    return types
}

function getDefinition<T = string>(name: T, options: Options) {
    const jsGen = getJsGen(options.rootPath)
    if (!jsGen) {
        return {}
    }

    let schema: TJS.Definition

    switch (name) {
        case 'number':
        case 'boolean':
        case 'string':
            schema = {
                type: String(name),
            }
            break

        default:
            schema = jsGen.getSchemaForSymbol(String(name), true) || {}
    }

    schema = clearDefinitions(schema)

    return schema
}

export interface SchemaObject {
    schema?: TJS.Definition
    components?: {
        [schema: string]: TJS.Definition
    }
}

// 缓存
const schemaObjectCache = new Map<string, SchemaObject>()

/**
 * 返回一个完整的 schema 定义
 * @param name
 * @param options
 * @returns
 */
export function getSchemaObject<T = string>(
    name: T,
    options: Options,
    cache = true
): SchemaObject {
    const cacheKey = String(name)
    if (cache) {
        const so = schemaObjectCache.get(cacheKey)
        if (so) return so
    }
    const { namespace = 'API' } = options
    const jsGen = getJsGen(options.rootPath)
    if (!jsGen) {
        return {}
    }

    if (String(name).endsWith('[]')) {
        const n = String(name)
        const sName = n.replace('[]', '') as T
        const res = getSchemaObject<T>(sName, options)

        const so = {
            schema: {
                type: 'array',
                items: res.schema,
            },
            components: res.components,
        }
        schemaObjectCache.set(cacheKey, so)
        return so
    }

    const schema = getDefinition<T>(name, options)

    if (schema.$schema) {
        delete schema.$schema
    }

    let components: {
        [schema: string]: TJS.Definition
    } = {}

    const namespaceReq = new RegExp(`#\/components\/schemas\/${namespace}.`, 'g')

    if (schema.definitions) {
        components = JSON.parse(
            JSON.stringify(schema.definitions)
                .replace(/\#\/definitions\//g, '#/components/schemas/')
                .replace(
                    namespaceReq,
                    '#/components/schemas/'
                )
        )
        delete schema.definitions

        const data = JSON.stringify(schema)
            .replace(/\#\/definitions\//g, '#/components/schemas/')
            .replace(namespaceReq, '#/components/schemas/')

        let schemaData = JSON.parse(data)

        if (schemaData.type === 'object') {
            const typeName = String(name)
                .replace(namespace + '.', '')
                .replace(/\./g, '')
            components[typeName] = schemaData
            schemaData = {
                $ref: `#/components/schemas/${typeName}`,
            }
        }

        Object.keys(components).forEach((key) => {
            if (key.indexOf(namespace + '.') === 0) {
                const newKey = key
                    .replace(namespace + '.', '')
                    .replace(/\./g, '')
                const component = components[key]
                if (component.type === 'object' && component.properties) {
                    Object.keys(component.properties).forEach((k) => {
                        // @ts-ignore
                        const props = component.properties[k]
                        if (
                            // @ts-ignore
                            props.type === 'array' &&
                            // @ts-ignore
                            props.items &&
                            // @ts-ignore
                            typeof props.items.$ref === 'string'
                        ) {
                            // @ts-ignore
                            props.items.$ref = String(props.items.$ref).replace(
                                /\./g,
                                ''
                            )
                        }
                    })
                }
                components[newKey] = component
                delete components[key]
            }
        })

        const so = {
            schema: schemaData,
            components,
        }
        schemaObjectCache.set(cacheKey, so)
        return so
    } else if (String(name).startsWith(namespace + '.')) {
        const schemaName = String(name)
            .replace(namespace + '.', '')
            .replace(/\./g, '')
        const refName = `#/components/schemas/${schemaName}`

        components[schemaName] = schema

        const so = {
            schema: {
                $ref: refName,
            },
            components,
        }
        schemaObjectCache.set(cacheKey, so)
        return so
    }

    const so = {
        schema,
        components,
    }
    schemaObjectCache.set(cacheKey, so)
    return so
}
