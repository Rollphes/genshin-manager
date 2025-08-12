# Genshin Manager

<div align="center">
	<p>
		<a href="https://www.npmjs.com/package/genshin-manager"><img src="https://img.shields.io/npm/v/genshin-manager.svg?maxAge=3600" alt="npm version" /></a>
		<a href="https://www.npmjs.com/package/genshin-manager"><img src="https://img.shields.io/npm/dt/genshin-manager.svg?maxAge=3600" alt="npm downloads" /></a>
		<a href="https://github.com/Rollphes/genshin-manager/actions/workflows/github-code-scanning/codeql"><img src="https://github.com/Rollphes/genshin-manager/actions/workflows/github-code-scanning/codeql/badge.svg"/></a>
        <a href="https://github.com/Rollphes/genshin-manager/actions/workflows/reviewdog.yaml"><img src="https://github.com/Rollphes/genshin-manager/actions/workflows/reviewdog.yaml/badge.svg"/></a>
    	<a href="https://github.com/Rollphes/genshin-manager/blob/main/LICENCE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg"/></a>
	</p>
</div>

## Overview

A comprehensive Node.js library for accessing Genshin Impact game data through Enka.Network API and official data sources. Build powerful applications with complete character showcases, weapon stats, artifacts, materials, and real-time player data.

**Note: This is a third-party library and not affiliated with Enka.Network or miHoYo.**

## ✨ Key Features

- 🎮 **Complete Game Data Access** - Characters, weapons, artifacts, materials, monsters, and more
- 🔄 **Real-time Player Data** - Fetch showcases from Enka.Network with caching
- 🌐 **Multi-language Support** - 13 languages including EN, JP, CN, KR, and more
- 🗄️ **Intelligent Caching** - Automatic asset management with scheduled updates
- 📱 **Game Notices** - Official announcements and events
- 🎨 **Rich Media Assets** - Character portraits, weapon icons, artifact images
- 🛡️ **Type-Safe** - Full TypeScript support with comprehensive type definitions
- ⚡ **Performance Optimized** - Smart caching and efficient data structures

## Installation

### System Requirements

- Node.js 18 or newer
- Internet connection for initial setup

### Basic Installation

```bash
npm install genshin-manager
```

### Installation Options

#### Install with specific language

```bash
npm install genshin-manager --download-language="JP"
```

#### Install with all languages

```bash
npm install genshin-manager --download-language="ALL"
```

#### Install without cache (if you already have cache files)

```bash
npm install genshin-manager --nocache=true
```

### Supported Languages

`EN`, `RU`, `VI`, `TH`, `PT`, `KR`, `JP`, `ID`, `FR`, `ES`, `DE`, `CHT`, `CHS`

## Quick Start

### Basic Setup

```javascript
const { Client } = require('genshin-manager')

// Initialize the client
const client = new Client()
await client.deploy()

console.log('Genshin Manager is ready!')
```

### Fetch Player Data from Enka.Network

```javascript
const { Client, EnkaManager } = require('genshin-manager')

const client = new Client()
await client.deploy()

const enkaManager = new EnkaManager()
const playerData = await enkaManager.fetchAll(800802278) // Replace with valid UID

console.log(`Player: ${playerData.playerDetail.nickname}`)
console.log(`Level: ${playerData.playerDetail.level}`)
console.log(`Characters: ${playerData.characterDetails.length}`)
```

### Access Character Information

```javascript
const { Client, CharacterInfo } = require('genshin-manager')

const client = new Client({ defaultLanguage: 'EN' })
await client.deploy()

// Get character by ID
const ayaka = new CharacterInfo(10000002) // Kamisato Ayaka
console.log(ayaka.name)      // "Kamisato Ayaka"
console.log(ayaka.element)   // "Cryo"
console.log(ayaka.rarity)    // 5

// Search by name
const zhongliIds = CharacterInfo.getCharacterIdByName("Zhongli")
const zhongli = new CharacterInfo(zhongliIds[0])
```

### Access Weapon Information

```javascript
const { Client, Weapon } = require('genshin-manager')

const client = new Client({ defaultLanguage: 'EN' })
await client.deploy()

// Create weapon instance
const weapon = new Weapon(13501, 90, true, 5) // Staff of Homa, Level 90, Ascended, R5
console.log(weapon.name)           // "Staff of Homa"
console.log(weapon.stats)          // Array of weapon stats
console.log(weapon.skillName)      // "Reckless Cinnabar"
```

## Advanced Configuration

### Multi-language Support

```javascript
const { Client, CharacterInfo } = require('genshin-manager')

const client = new Client({
  defaultLanguage: 'EN',
  downloadLanguages: ['EN', 'JP', 'KR']
})
await client.deploy()

const hutao = new CharacterInfo(10000046)
console.log(hutao.name) // "Hu Tao"

// Switch language dynamically
await client.changeLanguage('JP')
console.log(hutao.name) // "胡桃"
```

### Custom Cache Configuration

```javascript
const { Client } = require('genshin-manager')

const client = new Client({
  assetCacheFolderPath: './my-cache',
  autoFetchLatestAssetsByCron: '0 2 * * 1', // Update every Monday at 2 AM
  autoCacheImage: true,
  showFetchCacheLog: true
})
await client.deploy()
```

### Event Handling

```javascript
const { Client, ClientEvents, EnkaManagerEvents } = require('genshin-manager')

const client = new Client()

// Listen for cache updates
client.on(ClientEvents.BEGIN_UPDATE_CACHE, (version) => {
  console.log(`Updating cache for game version: ${version}`)
})

client.on(ClientEvents.END_UPDATE_CACHE, (version) => {
  console.log(`Cache updated successfully for version: ${version}`)
})

await client.deploy()
```

## Asset Management

### Game Data Cache

Game data is sourced from [Dimbreath/AnimeGameData](https://gitlab.com/Dimbreath/AnimeGameData) and includes:

- Character data and stats
- Weapon information and refinements
- Artifact sets and properties
- Material data
- Monster information
- Localized text in 13 languages

### Automatic Updates

```javascript
const { Client } = require('genshin-manager')

const client = new Client({
  // Auto-update every Wednesday at midnight (default)
  autoFetchLatestAssetsByCron: '0 0 0 * * 3',

  // Auto-fix corrupted files
  autoFixTextMap: true,
  autoFixExcelBin: true,

  // Cache images and audio
  autoCacheImage: true,
  autoCacheAudio: true
})
await client.deploy()
```

### Manual Cache Updates

```javascript
const { Client } = require('genshin-manager')

const client = new Client({ showFetchCacheLog: true })
await client.deploy() // This will update the cache if new data is available
```

## Game Notices and Announcements

```javascript
const { Client, NoticeManager, NoticeManagerEvents } = require('genshin-manager')

const client = new Client()
await client.deploy()

const noticeManager = new NoticeManager('en', 300000) // English, update every 5 minutes

// Listen for new notices
noticeManager.on(NoticeManagerEvents.ADD_NOTICE, (notice) => {
  console.log(`New notice: ${notice.title}`)
})

await noticeManager.update()

// Access notices
noticeManager.notices.forEach((notice) => {
  console.log(`${notice.title} - ${notice.eventDuration}`)
})
```

## Examples and Documentation

### More Examples

Check out the [examples directory](https://github.com/Rollphes/genshin-manager/tree/main/examples) for:

- Character showcase applications
- Weapon comparison tools
- Notice monitoring systems
- Multi-language implementations

### Full Documentation

📖 **[Complete API Documentation](https://rollphes.github.io/genshin-manager/index.html)**

### Handbooks

The library includes comprehensive handbooks for each supported language:

- Character IDs and names
- Skill information
- Constellation data
- And more game entities

## API Reference

### Core Classes

| Class | Description |
|-------|-------------|
| `Client` | Main entry point for the library |
| `EnkaManager` | Handles Enka.Network API interactions |
| `NoticeManager` | Manages game announcements |
| `CharacterInfo` | Character data and information |
| `Weapon` | Weapon stats and properties |
| `Artifact` | Artifact data and set bonuses |
| `Material` | Game materials and items |
| `Monster` | Enemy data and stats |

### Data Sources

- **Enka.Network API**: Real-time player and character data
- **Dimbreath/AnimeGameData**: Comprehensive game data repository
- **Official API**: Official game announcements and notices
- **Asset Servers**: Character images, weapon icons, and audio files

## Requirements

- **Node.js**: Version 18.0.0 or higher
- **Platform**: Cross-platform (Windows, macOS, Linux)
- **Internet**: Required for initial setup and API requests

## License

This project is licensed under the [MIT License](https://github.com/Rollphes/genshin-manager/blob/main/LICENCE).

## Contributing

Contributions are welcome! Please read the [contributing guidelines](https://github.com/Rollphes/genshin-manager#contributing) and submit pull requests to help improve the library.

## Changelog

View the [release history and changelog](https://github.com/Rollphes/genshin-manager/releases) for detailed information about updates and new features.

## Support

- 🐛 **Issues**: [GitHub Issues](https://github.com/Rollphes/genshin-manager/issues)
- 📖 **Documentation**: [API Documentation](https://rollphes.github.io/genshin-manager/)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/Rollphes/genshin-manager/discussions)
