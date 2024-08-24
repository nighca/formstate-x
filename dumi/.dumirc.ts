import path from 'path'
import { defineConfig } from 'dumi'

const repo = 'formstate-x'

export default defineConfig({
  title: 'FORMSTATE-X',
  themeConfig: {
    name: 'formstate-x',
    logo: `/${repo}/logo.svg`,
    nav: [
      // null,
      {
        title: 'GitHub',
        link: 'https://github.com/qiniu/formstate-x',
      },
    ],
  },
  favicons: [`/${repo}/favicon.svg`],
  outputPath: `dist/${repo}`,
  // mode: 'site',
  hash: true,
  // Because of using GitHub Pages
  base: `/${repo}/`,
  publicPath: `/${repo}/`,
  alias: {
    'formstate-x': path.join(__dirname, 'src')
  },
  styles: [`.__dumi-default-navbar-logo { color: #454d64 !important; }`],
  // more config: https://d.umijs.org/config
})