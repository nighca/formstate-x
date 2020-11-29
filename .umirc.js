import { readFileSync } from 'fs'

const style = readFileSync('./public/style.css', { encoding: 'utf-8' })

export default {
  mode: 'site',
  title: 'FORMSTATE-X',
  logo: '/logo.svg',
  favicon: '/favicon.ico',
  outputPath: 'doc/dist',
  styles: [style],
  navs: [
    {
      title: 'API',
      path: '/api',
    },
    {
      title: 'Adapter',
      path: '/adapter',
    },
    {
      title: 'GitHub',
      path: 'https://github.com/umijs/dumi',
    },
  ],
  // ssr: {},
  exportStatic: {}
}
