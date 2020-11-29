import { join } from 'path'
import { promises as fs } from 'fs'

async function lsRecursively(path: string): Promise<string[]> {
  const stat = await fs.stat(path)
  if (stat.isFile()) return [path]
  if (!stat.isDirectory()) return []
  const entries = await fs.readdir(path)
  const entryPaths = entries.map(entry => join(path, entry))
  const entryResults = await Promise.all(entryPaths.map(lsRecursively))
  return entryResults.reduce((result, entryResult) => [ ...result, ...entryResult ])
}

async function process(filePath: string) {
  const content = await fs.readFile(filePath, { encoding: 'utf-8' })
  const escaped = content
    .replace(/\\*\</g, '&lt;')
    .replace(/\>/g, '&gt;')
  const extensionAdjusted = escaped
    .replace(/README\.md/g, '')
    .replace(/(\w+)\.md/g, '$1')
  await fs.writeFile(filePath, extensionAdjusted)
}

async function main(apiDocPath: string) {
  const docFiles = await lsRecursively(apiDocPath)
  await Promise.all(docFiles.map(docFile => process(docFile)))
  console.log(`${docFiles.length} files processed.`)
}

main('./docs/api')
