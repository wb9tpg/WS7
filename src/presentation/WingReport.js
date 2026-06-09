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

export default class Report extends Table {
  constructor(fileName) {
    super(fileName)
    logger.debug('Report class instance created')

    // console.log(`Report constructor ${fileName}`)
  }
}
