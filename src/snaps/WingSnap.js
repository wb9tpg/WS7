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

/**
 * @class WingSnap
 * @description process Behringer Wing Snap Files
 */
export default class WingSnap {
  /**
   * @constructor for WingSnap class
   * @param {*} fileName - reads the filename into this.snap
   * @description reads in this json formatted snap
   */
  constructor(fileName) {
    this.snap = readSnapFile(fileName)
    logger.debug('Snap class instance created')
    // console.dir(this.ae_data, { depth: 1, colors: true })
    // console.log(Object.hasOwn(this.snapData, 'ae_data'))
  }
}

/**
 * @function readSnapFile
 * @description Reads in the Snap file which is a JSON formatted file
 * @param {string} fileName - filename and type
 * @returns {Object} snap - json snap data
 * @throws will throw an error if unable to read file
 */
function readSnapFile(fileName) {
  let fileNamePath = `./storage/wing-snaps/${fileName}`
  let snap = {}

  try {
    // read the file synchronously at a UTF-8 string
    const rawData = fs.readFileSync(fileNamePath, 'utf8')

    // Parse the raw string into a JavaScript Object
    snap = JSON.parse(rawData)

    let keyValuePairCount = formatWithCommas(countNonObjectPairs(snap))
    logger.silly(`${keyValuePairCount} key-value pairs read from ${fileName}`)
  } catch (error) {
    logger.error(`Fatal Error reading ${fileNamePath}`)
    console.error('Error reading or parsing file', error)
  }
  return snap
}

/**
 * @function countNonObjectPairs
 * @description counts the key-value pairs in a nested object,
 *    excluding keys whose values are objects or arrays.
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

/**
 * @function formatWithCommas
 *
 *
 * @param {number} num - number to convert
 * @returns {string}
 * @throws an error is called with an invalid number
 */
function formatWithCommas(num) {
  if (typeof num !== 'number' || isNaN(num)) {
    throw new Error('Input must be a valid number')
  }
  return num.toLocaleString('en-US') // Formats with commas for US locale
}
