import type { CodegenConfig } from '@graphql-codegen/cli'

const gateway = process.env.OPTIMIZELY_GRAPH_GATEWAY || 'https://cg.optimizely.com/content/v2'
const singleKey = process.env.OPTIMIZELY_GRAPH_SINGLE_KEY || ''

const config: CodegenConfig = {
  schema: [
    {
      [`${gateway}?auth=${singleKey}`]: {
        headers: { 'Content-Type': 'application/json' },
      },
    },
  ],
  generates: {
    '__generated/graphql.ts': {
      documents: 'src/**/*.graphql',
      plugins: ['typescript', 'typescript-operations'],
      config: { avoidOptionals: false },
    },
    '__generated/sdk.ts': {
      documents: 'src/**/*.graphql',
      plugins: ['typescript', 'typescript-generic-sdk'],
      config: { documentMode: 'string', rawRequest: false },
    },
    '__generated/schema.json': {
      plugins: ['introspection'],
    },
  },
}

export default config
