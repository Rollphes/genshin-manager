import { generateMasterFromJson } from '@/utils/generateMasterFromJson'
import fs from 'fs'
import path from 'path'

/**
 * Command line options interface
 */
interface CommandOptions {
  target?: string;
  force: boolean;
  help: boolean;
}

function parseArgs(): CommandOptions {
  const args = process.argv.slice(2);
  const options: CommandOptions = {
    target: undefined,
    force: false,
    help: false
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--target':
      case '-t':
        options.target = args[i + 1];
        i++;
        break;
      case '--force':
      case '-f':
        options.force = true;
        break;
      case '--help':
      case '-h':
        options.help = true;
        break;
    }
  }

  return options;
}

/**
 * Auto-discover and process multiple ExcelBinOutput files
 * @param excelBinOutputFolderPath - ExcelBinOutput folder path
 * @param force - Force overwrite flag
 * @returns Array of processing results
 */
function processAllAvailableFiles(excelBinOutputFolderPath: string, force = false): {
  fileName: string
  success: boolean
  totalObjects: number
  uniqueObjects: number
  skipped?: boolean
  error?: string
}[] {
  if (!fs.existsSync(excelBinOutputFolderPath))
    throw new Error(`cache directory not found: ${excelBinOutputFolderPath}`)

  const files = fs
    .readdirSync(excelBinOutputFolderPath)
    .filter((file) => file.endsWith('.json'))
    .map((file) => file.replace('.json', ''))

  console.log(`Number of files found: ${String(files.length)}`)
  console.log(
    'Processing targets:',
    files.slice(0, 5).join(', '),
    files.length > 5 ? `... and ${String(files.length - 5)} more` : '',
  )

  const results = []

  for (const fileName of files) {
    try {
      console.log(`\nProcessing: ${fileName}...`)
      const inputPath = path.join(excelBinOutputFolderPath, `${fileName}.json`)
      const result = generateMasterFromJson(inputPath, force)
      results.push({
        fileName,
        success: result.success,
        totalObjects: result.totalObjects,
        uniqueObjects: result.uniqueObjects,
        skipped: result.skipped,
      })
    } catch (error) {
      console.error(`❌ ${fileName}: ${String(error)}`)
      results.push({
        fileName,
        success: false,
        totalObjects: 0,
        uniqueObjects: 0,
        error: String(error),
      })
    }
  }

  return results
}

function showHelp(): void {
  console.log(`
Structural Master File Generator

Usage:
  npx tsx scripts/generate-structural-master.ts [OPTIONS]

Options:
  -t, --target <filename>    Process only the specified file (e.g., -t WeaponPromoteExcelConfigData)
  -f, --force               Force overwrite existing master files
  -h, --help                Show this help

Examples:
  npx tsx scripts/generate-structural-master.ts -t WeaponPromoteExcelConfigData
  npx tsx scripts/generate-structural-master.ts -f
  npx tsx scripts/generate-structural-master.ts --target CharacterExcelConfigData

Notes:
  - By default, processes all ExcelBinOutput files
  - Existing master files are protected (use -f to overwrite)
  `);
}

if (require.main === module) {
  const options = parseArgs();

  if (options.help) {
    showHelp();
    process.exit(0);
  }

  const excelBinOutputFolderPath = path.join(__dirname, '../cache/ExcelBinOutput');

  (async () => {
    try {
      if (options.target) {
        console.log(`🎯 Starting processing for ${options.target}...`);
        const inputPath = path.join(excelBinOutputFolderPath, `${options.target}.json`);
        const result = generateMasterFromJson(inputPath, options.force);

        if (result.success) {
          if (result.skipped) {
            console.log('\n⏭️  Existing file is protected, skipped.');
          } else {
            console.log('\n✅ Processing completed');
          }
        }
      } else {
        console.log('🚀 Starting auto-processing of all ExcelBinOutput files...\n');
        const results = processAllAvailableFiles(excelBinOutputFolderPath, options.force);

        console.log('\n=== Processing Results Summary ===');
        const successful = results.filter(r => r.success && !r.skipped);
        const skipped = results.filter(r => r.skipped);
        const failed = results.filter(r => !r.success);

        console.log(`✅ Successful: ${String(successful.length)} files`);
        if (skipped.length > 0) console.log(`⏭️  Skipped: ${String(skipped.length)} files`);
        if (failed.length > 0) console.log(`❌ Failed: ${String(failed.length)} files`);

        successful.forEach(r => {
          console.log(`  ✅ ${r.fileName}: ${String(r.totalObjects)} objects → ${String(r.uniqueObjects)} unique`);
        });

        if (skipped.length > 0) {
          console.log('\nSkipped files (can be overwritten with -f):');
          skipped.forEach(r => console.log(`  ⏭️  ${r.fileName}`));
        }

        if (failed.length > 0) {
          console.log('\nFailed files:');
          failed.forEach(r => console.log(`  ❌ ${r.fileName}: ${r.error || 'Unknown error'}`));
        }
      }
    } catch (error) {
      console.error('❌ Error:', error);
      process.exit(1);
    }
  })();
}