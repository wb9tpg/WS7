/**
 * @file main.js is the root file for this application
 * @author Gary Mitchell
 */

import logger from './src/classes/LoggerService.js'
import WingReport from './src/presentation/WingReport.js'
// import {
//   helloWorld,
//   generateManifestTable,
//   gen3ColJson,
//   gen4ColJson,
// } from './src/utils/tableFormatters.js'
logger.info('Wing Snap Report Generator started')

const report = new WingReport('Console.json')
// helloWorld()

let s = report.snap
report.buildReport()
report.generate('./public/pdfs/WingReport.pdf')

/**
 *
 * @param {string} xxx
 */
function me(xxx) {
  console.log('hello')
}
