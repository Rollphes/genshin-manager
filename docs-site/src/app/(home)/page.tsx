import { Card, Cards } from 'fumadocs-ui/components/card'
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import {
  BookOpenIcon,
  CodeIcon,
  DatabaseIcon,
  GlobeIcon,
  PackageIcon,
  UsersIcon,
} from 'lucide-react'
import Link from 'next/link'
import type { ReactNode } from 'react'

const QUICK_START_CODE = `import { Client, Character } from 'genshin-manager'

const client = new Client({ defaultLanguage: 'EN' })
await client.deploy()

// Create a level 90, ascended, C6 Hu Tao
const hutao = new Character(10000046, 90, true, 6)

console.log(hutao.name)      // "Hu Tao"
console.log(hutao.element)   // "Pyro"
console.log(hutao.rarity)    // 5
console.log(hutao.weaponType) // "WEAPON_POLE"`

const ENKA_CODE = `import { EnkaManager } from 'genshin-manager'

const enkaManager = new EnkaManager()
const data = await enkaManager.fetchAll(800000001)

console.log(data.playerDetail.nickname)
console.log(data.playerDetail.level) // Adventure Rank
console.log(data.characterDetails.length) // Showcased characters`

export default function HomePage(): ReactNode {
  return (
    <main className="container max-w-[1100px] mx-auto">
      {/* Hero */}
      <div className="flex flex-col items-center text-center py-16 md:py-24">
        <h1 className="text-4xl font-bold md:text-5xl mb-4">Genshin Manager</h1>
        <p className="text-fd-muted-foreground text-lg max-w-xl mb-8">
          A comprehensive TypeScript library for Genshin Impact data management
        </p>
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          <Link
            href="/docs/guide/getting-started"
            className="inline-flex items-center gap-2 bg-fd-primary text-fd-primary-foreground px-4 py-2 rounded-md font-medium text-sm hover:bg-fd-primary/90 transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="/docs/api/client/client"
            className="inline-flex items-center gap-2 border border-fd-border px-4 py-2 rounded-md font-medium text-sm hover:bg-fd-accent transition-colors"
          >
            API Reference
          </Link>
        </div>

        {/* Install Command with Tabs */}
        <Tabs
          items={['npm', 'yarn', 'bun']}
          className="w-full max-w-md text-left"
        >
          <Tab value="npm">
            <DynamicCodeBlock lang="bash" code="npm install genshin-manager" />
          </Tab>
          <Tab value="yarn">
            <DynamicCodeBlock lang="bash" code="yarn add genshin-manager" />
          </Tab>
          <Tab value="bun">
            <DynamicCodeBlock lang="bash" code="bun add genshin-manager" />
          </Tab>
        </Tabs>
      </div>

      {/* Features */}
      <div className="py-12 border-t">
        <h2 className="text-2xl font-semibold text-center mb-8">Features</h2>
        <Cards>
          <Card
            icon={<UsersIcon />}
            title="Character Data"
            description="Access comprehensive character info including stats, skills, constellations, and materials."
          />
          <Card
            icon={<PackageIcon />}
            title="Weapon Stats"
            description="Get detailed weapon data with refinement effects and stat calculations."
          />
          <Card
            icon={<GlobeIcon />}
            title="Enka.Network"
            description="Fetch player data and builds directly from Enka.Network API."
          />
          <Card
            icon={<DatabaseIcon />}
            title="Asset Management"
            description="Automatic asset caching with image and audio file support."
          />
          <Card
            icon={<BookOpenIcon />}
            title="Game Notices"
            description="Access in-game announcements and event information."
          />
          <Card
            icon={<CodeIcon />}
            title="Type Safety"
            description="Full TypeScript support with strict types for reliable development."
          />
        </Cards>
      </div>

      {/* Quick Start */}
      <div className="py-12 border-t">
        <h2 className="text-2xl font-semibold text-center mb-4">Quick Start</h2>
        <p className="text-fd-muted-foreground text-center mb-8">
          Get started with just a few lines of code
        </p>

        <Tabs items={['Character Data', 'Player Profile']} className="mb-8">
          <Tab value="Character Data">
            <DynamicCodeBlock lang="ts" code={QUICK_START_CODE} />
          </Tab>
          <Tab value="Player Profile">
            <DynamicCodeBlock lang="ts" code={ENKA_CODE} />
          </Tab>
        </Tabs>
      </div>

      {/* Links */}
      <div className="py-12 border-t">
        <h2 className="text-2xl font-semibold text-center mb-8">
          Documentation
        </h2>
        <Cards>
          <Card
            href="/docs/guide/getting-started"
            title="Getting Started"
            description="Install and set up Genshin Manager in your project"
          />
          <Card
            href="/docs/guide/characters"
            title="Character Guide"
            description="Learn how to access character data and stats"
          />
          <Card
            href="/docs/guide/weapons"
            title="Weapon Guide"
            description="Access weapon information and upgrade materials"
          />
          <Card
            href="/docs/api/client/client"
            title="API Reference"
            description="Complete API documentation for all classes and types"
          />
        </Cards>
      </div>
    </main>
  )
}
