/**
 * Error code enumeration for genshin-manager
 */
export enum ErrorCode {
  // Validation errors (1xxx)
  GmValidation = 'GM1001',

  // Asset errors (2xxx)
  GmAssetNotFound = 'GM2001',
  GmAssetFormat = 'GM2002',

  // TextMap errors (3xxx)
  GmTextMapFormat = 'GM3001',
  GmTextMapHashNotFound = 'GM3002',

  // Network errors (4xxx)
  GmNetwork = 'GM4001',
  GmNetworkBodyNotFound = 'GM4002',

  // ExcelBin errors (5xxx)
  GmExcelBinNotLoaded = 'GM5001',
  GmExcelBinPropertyNotFound = 'GM5002',

  // Content errors (6xxx)
  GmAnnNotFound = 'GM6001',
  GmDataConsistency = 'GM6002',

  // General errors (9xxx)
  GmGeneral = 'GM9001',
}
