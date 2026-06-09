//  ┌────────────────────────────────────────────────────────┐
//  │                      1. SNAP TIER                      │
//  │  Reads file ➔ Holds raw JSON ➔ Zero formatting/logic   │
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
import fs from 'fs'

export default class WingSnap {
  snapData = {}

  /**
   * Constructor called from Parent Table Class
   * @param {*} fileName
   */
  constructor(fileName) {
    this.#readFile(fileName) // read the file
    logger.debug('Snap class instance created')
    // console.dir(this.ae_data, { depth: 1, colors: true })
    // console.log(Object.hasOwn(this.snapData, 'ae_data'))
  }

  /**
   * Private Method to read the Snap File
   * @param {*} fileName
   */
  #readFile(fileName) {
    try {
      // read the file synchronously at a UTF-8 string
      const rawData = fs.readFileSync(fileName, 'utf8')

      // Parse the raw string into a JavaScript Object
      const snap = JSON.parse(rawData)
      this.snapData = snap
      logger.silly(
        `${Object.keys(snap).length} top level keys read from ${fileName}`
      )
    } catch (error) {
      console.error('Error reading or parsing file', error)
    }
    return this
  }
}
