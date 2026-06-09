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
import METADATA_DICTIONARY from '../../data/json/labels.json' with { type: 'json' }

export default class WingTable extends WingSnap {
  constructor(fileName) {
    super(fileName)
    logger.debug('Table class instance created')
  }
}
