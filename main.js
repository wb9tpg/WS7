import logger from './src/classes/LoggerService.js'
import WingReport from './src/presentation/WingReport.js'
import {
  helloWorld,
  generateManifestTable,
  generate4ColumnCfgTable,
  generate5ColumnCfgTable,
} from './src/utils/tableFormatters.js'
logger.info('Wing Snap Report Generator started')

const report = new WingReport('Console.json')
helloWorld()

let s = report.snap

// console.table(generate4ColumnCfgTable(s, ''))
console.dir(generate5ColumnCfgTable(s, 'mon', { nested: false }))
// generate4ColumnCfgTable(s, 'mtr', { nested: true })
