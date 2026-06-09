// @ts-check
// ┌────────────────────────────────────────────────────────┐
// │                      1. SNAP TIER                      │
// │  Reads file ➔ Holds raw JSON ➔ Zero formatting/logic   │
// └───────────────────────────┬────────────────────────────┘
//                             ▼
// ┌────────────────────────────────────────────────────────┐
// │                     2. TABLES TIER                     │
// │  Filters, matches ae_data + ce_data ➔ Outputs arrays   │
// └───────────────────────────┬────────────────────────────┘
//                             ▼
// ┌────────────────────────────────────────────────────────┐
// │                     3. REPORT TIER                     │
// │  Pure presentation ➔ Loops over tables ➔ Prints layout │
// └────────────────────────────────────────────────────────┘

import logger from './LoggerService.js'
import WingSnap from '../snaps/WingSnap.js'
import { helloWorld } from '../utils/tableFormatters.js'
import METADATA_DICTIONARY from '../../data/json/labels.json' with { type: 'json' }

/**
 * @class WingTable
 * @description convert from objects into tables built to print
 */
class WingTable extends WingSnap {
  /**
   * build the constructor
   * @param {string} fileName
   */
  constructor(fileName) {
    super(fileName)
    logger.debug('Table class instance created')
  }
}

export default WingTable
