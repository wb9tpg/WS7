/**
 * @file main.js is the root file for this application
 * @author Gary Mitchell
 */

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
report.buildReport()

/**
 *
 * @param {string} xxx
 */
function me(xxx) {
  console.log('hello')
}
