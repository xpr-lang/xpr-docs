import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'XPR Language',
  description: 'Cross-language expression language for data pipelines',
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'Spec', link: '/spec/' },
      { text: 'API', link: '/api/' },
      { text: 'Playground', link: 'https://github.com/xpr-lang/xpr-playground' }
    ],
    sidebar: {
      '/guide/': [{ text: 'Getting Started', link: '/guide/' }],
      '/spec/': [{ text: 'Specification', link: '/spec/' }],
      '/api/': [
        { text: 'Overview', link: '/api/' },
        { text: 'JavaScript', link: '/api/javascript' },
        { text: 'Python', link: '/api/python' },
        { text: 'Go', link: '/api/go' }
      ]
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/xpr-lang' }]
  }
})
