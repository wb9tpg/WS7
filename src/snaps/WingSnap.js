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
import { helloWorld } from '../utils/tableFormatters.js'

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
    // add the path to the file
    let fileNamePath = `./storage/wing-snaps/${fileName}`

    try {
      // read the file synchronously at a UTF-8 string
      const rawData = fs.readFileSync(fileNamePath, 'utf8')

      // Parse the raw string into a JavaScript Object
      const snap = JSON.parse(rawData)
      this.snapData = snap
      let keyValuePairCount = formatWithCommas(
        countNonObjectPairs(this.snapData)
      )
      logger.silly(`${keyValuePairCount} key-value pairs read from ${fileName}`)
    } catch (error) {
      logger.error(`Fatal Error reading ${fileNamePath}`)
      console.error('Error reading or parsing file', error)
    }
    return this
  }
}

/**
 * Count key-value pairs in a nested object,
 * excluding keys whose values are objects or arrays.
 *
 * @param {Object} obj - The JSON object to process
 * @returns {number} - Count of non-object key-value pairs
 */
function countNonObjectPairs(obj) {
  if (obj === null || typeof obj !== 'object') {
    return 0 // Not an object, nothing to count
  }

  let count = 0

  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue

    const value = obj[key]

    // Count only if value is NOT an object or array
    if (value === null || typeof value !== 'object') {
      count++
    }

    // If value is an object, recurse into it
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      count += countNonObjectPairs(value)
    }
  }

  return count
}

function formatWithCommas(num) {
  if (typeof num !== 'number' || isNaN(num)) {
    throw new Error('Input must be a valid number')
  }
  return num.toLocaleString('en-US') // Formats with commas for US locale
}
