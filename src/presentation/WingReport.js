// @ts-check
//  ┌────────────────────────────────────────────────────────┐
//  │                      1. SNAP TIER                      │
//  │  Reads file ➔ Holds raw JSON ➔ Zero formatting/logic │
//  └───────────────────────────┬────────────────────────────┘
//                              ▼
//  ┌────────────────────────────────────────────────────────┐
//  │                     2. TABLES TIER                     │
//  │  Filters, matches ae_data + ce_data ➔ Outputs arrays   │
//  └───────────────────────────┬────────────────────────────┘
//                              ▼
//  ┌────────────────────────────────────────────────────────┐
//  │                     3. REPORT TIER                     │
//  │  Pure presentation ➔ Loops over tables ➔ Prints layout │
//  └────────────────────────────────────────────────────────┘

import logger from '../classes/LoggerService.js'
import Table from '../classes/WingTable.js'
import {
  helloWorld,
  generateManifestTable,
  gen3ColJson,
  gen4ColJson,
} from '../utils/tableFormatters.js'
import { formatValueDisplay } from '../utils/reportFormatters.js'

export default class WingReport extends Table {
  /**
   * WingReport class constructor
   * @param {*} fileName - the snap file for this report
   */
  constructor(fileName) {
    super(fileName)
    logger.debug('Report class instance created')

    // console.log(`Report constructor ${fileName}`)
  }

  buildReport() {
    const con = { depth: 2 }
    // console.dir(generateManifestTable(this.snap), con)
    console.dir(gen3ColJson(this.snap, '', 'Audio Engine Settings', false), con)
    // console.table(gen4ColJson(this.snap, 'mon', { nested: false }))
    // console.dir(gen3ColTableJson(this.snap, 'solo', 'Solo Settings', true), con)
    // console.table(
    //   gen3ColJson(this.snap, 'rta', {
    //     title: 'Real Time Analyzer Settings',
    //     nested: true,
    //   })
    // )
    // console.table(
    //   gen3ColJson(this.snap, 'mtr', {
    //     title: 'Meter Settings',
    //     nested: true,
    //   })
    // )
    // console.table(
    //   gen3ColJson(this.snap, 'talk', {
    //     title: 'Talkback Settings',
    //     nested: false,
    //   })
    // )
    // console.table(gen4ColJson(this.snap, 'talk', { nested: true }))
    // console.table(
    //   gen3ColJson(this.snap, 'amix', {
    //     title: 'Automix Settings',
    //     nested: false,
    //   })
    // )
  }
}
