# GenshinManager

<div align="center">
	<p>
		<a href="https://www.npmjs.com/package/genshin-manager"><img src="https://img.shields.io/npm/v/genshin-manager.svg?maxAge=3600" alt="npm version" /></a>
		<a href="https://www.npmjs.com/package/genshin-manager"><img src="https://img.shields.io/npm/dt/genshin-manager.svg?maxAge=3600" alt="npm downloads" /></a>
		<a href="https://github.com/Rollphes/genshin-manager/actions/workflows/github-code-scanning/codeql"><img src="https://github.com/Rollphes/genshin-manager/actions/workflows/github-code-scanning/codeql/badge.svg"/></a>
        <a href="https://github.com/Rollphes/genshin-manager/actions/workflows/eslint.yaml"><img src="https://github.com/Rollphes/genshin-manager/actions/workflows/eslint.yaml/badge.svg"/></a>
    	<a href="https://github.com/Rollphes/genshin-manager/blob/main/LICENCE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg"/></a>
	</p>
</div>

## Overview

A Node.js Enka.network and Genshin Data wrapper for Genshin Impact

**This is NOT the source code of Enka.Network or its API.**

### Description

- User Data and Character Stats using EnkaNetwork.
- All Characters and All Weapons Data. (Including More Advanced Info, such as Skill Attributes and Weapon Refinements.)
- Cache Updater for the new update of Genshin Impact.
- Easily instantiated using id

## Installation

**Node.js 18 or newer is required.**

Install genshin-manager including genshin cache data.(download EN TextMap by default.)

```sh-session
npm install genshin-manager
```

You can specify which TextMap to download during installation.('ALL' can also be specified).

```sh-session
npm install genshin-manager --download-language="JP"
```

If you have already moved the cache to another folder, you can also install without downloading the cache.

```sh-session
npm install genshin-manager --nocache=true
```

## About Genshin Cache Data

Genshin cache data is from [Dimbreath/AnimeGameData](https://gitlab.com/Dimbreath/AnimeGameData).

This data contains data of characters, weapons, materials, and more structure information of Genshin Impact.

You can change your cache directory.

```js
const { Client } = require('genshin-manager')

// Change the directory to store cache data.
// Default directory is node_modules/genshin-manager/cache.
const client = new Client({ assetCacheFolderPath: './cache' })
await client.deploy()
```

### Updating

You can update your genshin cache data.

```js
const { Client } = require('genshin-manager')

// showFetchCacheLog is true by default
const client = new Client({ showFetchCacheLog: true })
await client.deploy()
```

Also, you can activate auto cache updater.

```js
const { Client } = require('genshin-manager')

// autoFetchLatestAssetsByCron is "0 0 0 * * 3" by default
// By default, it runs every Wednesday at 00:00:00
// downloadLanguages is All TextMap by default
const client = new Client({
  downloadLanguages: ['EN', 'JP'],
  autoFetchLatestAssetsByCron: '0 0 0 * * 3',
})
await client.deploy()

// deactivate
const client = new Client({ autoFetchLatestAssetsByCron: undefined })
await client.deploy()
```

### Also Feature

Images can be cached.

```js
const { Client } = require('genshin-manager')

// autoCacheImage is true by default
const client = new Client({ autoCacheImage: true })
await client.deploy()
```

Automatically fixes defects in TextMap when they occur.

```js
const { Client } = require('genshin-manager')

// autoFixTextMap is true by default
const client = new Client({ autoFixTextMap: true })
await client.deploy()
```

# How to use

## Fetching Enka Data

[EnkaManager#fetch](https://rollphes.github.io/genshin-manager/classes/EnkaManager.html#fetch)

```js
const { Client, EnkaManager } = require('genshin-manager')

// Loading cache
const client = new Client()
await client.deploy()

const enkaManager = new EnkaManager()

const enkaData = await enkaManager.fetch(800802278)
console.log(enkaData.uid)
console.log(enkaData.playerInfo)
console.log(enkaData.avatarInfoList)
console.log(enkaData.nextShowCaseDate)
```

## Genshin Character from characterId

[Character](https://rollphes.github.io/genshin-manager/classes/Character.html)

```js
const { Client, Character } = require('genshin-manager')

// Loading cache
const client = new Client({ defaultLanguage: 'JP' })
await client.deploy()

const character = new Character(10000002)
// print character name in language "jp"
console.log(character.name) // output: 神里綾華
```

## Genshin Weapon from characterId

[Weapon](https://rollphes.github.io/genshin-manager/classes/Weapon.html)

```js
const { Client, Weapon } = require('genshin-manager')

// Loading cache
const client = new Client({ defaultLanguage: 'JP' })
await client.deploy()

const weapon = new Weapon(13501)
// print weapon name in language "jp"
console.log(weapon.name) // output: 護摩の杖
```

examples will be added in the future.

For more information, please check [Documentation](https://rollphes.github.io/genshin-manager/index.html).

You can see the changelog [here](https://github.com/Rollphes/genshin-manager/releases).
