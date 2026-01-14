import { generateAllMasterTypes } from '@/utils/buildtime/generateTypesFromMaster'
import { generatedTypesFolderPath } from '@/utils/paths'

/**
 * Generate TypeScript types from all master files
 */
;(async () => {
  try {
    console.log('🚀 Starting type generation from master files...\n')

    const generatedFiles = await generateAllMasterTypes(
      generatedTypesFolderPath,
    )

    console.log('\n✅ Type generation completed successfully!')
    console.log(`📁 Output directory: ${generatedTypesFolderPath}`)
    console.log(`📄 Generated ${String(generatedFiles.length)} files`)
    process.exit(0)
  } catch (error) {
    console.error('❌ Error during type generation:', error)
    process.exit(1)
  }
})()
