import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared'

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: 'Genshin Manager',
    },
    links: [
      {
        text: 'GitHub',
        url: 'https://github.com/Rollphes/genshin-manager',
        external: true,
      },
      {
        text: 'npm',
        url: 'https://www.npmjs.com/package/genshin-manager',
        external: true,
      },
    ],
  }
}
