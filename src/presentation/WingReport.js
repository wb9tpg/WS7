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
  generate4ColumnCfgTable,
  generate5ColumnCfgTable,
} from '../utils/tableFormatters.js'

export default class Report extends Table {
  constructor(fileName) {
    super(fileName)
    logger.debug('Report class instance created')

    // console.log(`Report constructor ${fileName}`)
  }

  buildReport() {
    // manifest - the base keys that describe the file
    console.table(generateManifestTable(this.snap))
    // console.table(
    //   generate4ColumnCfgTable(this.snap, '', {
    //     title: 'Audio Engine Settings',
    //     nested: false,
    //   })
    // )
    // console.table(generate5ColumnCfgTable(this.snap, 'mon', { nested: false }))
    // console.table(
    //   generate4ColumnCfgTable(this.snap, 'solo', {
    //     title: 'Solo Settings',
    //     nested: true,
    //   })
    // )
    // console.table(
    //   generate4ColumnCfgTable(this.snap, 'rta', {
    //     title: 'Real Time Analyzer Settings',
    //     nested: true,
    //   })
    // )
    // console.table(
    //   generate4ColumnCfgTable(this.snap, 'mtr', {
    //     title: 'Meter Settings',
    //     nested: true,
    //   })
    // )
    // console.table(
    //   generate4ColumnCfgTable(this.snap, 'talk', {
    //     title: 'Talkback Settings',
    //     nested: false,
    //   })
    // )
    // console.table(generate5ColumnCfgTable(this.snap, 'talk', { nested: true }))
    // console.table(
    //   generate4ColumnCfgTable(this.snap, 'amix', {
    //     title: 'Automix Settings',
    //     nested: false,
    //   })
    // )
  }
}
