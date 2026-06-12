// @ts-check
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
  /** @type {KVP} */
  snap
  /**
   * Example usage tracking your file structure:
   * @type {ProfileMetadataSchema}
   */
  static METADATA = {}

  /**
   * @constructor for WingSnap class
   * @param {string} fileName - reads the filename into this.snap
   * @description reads in this json formatted snap
   */
  constructor(fileName) {
    logger.silly('method: WingSnap constructor')
    this.snap = readSnapFile(fileName)
    logger.debug('Snap class instance created')
    /** @type {ProfileMetadataSchema} */
    WingSnap.METADATA = WingSnap.importMetadata('./data/json/labels.json')
  }

  /**
   * Loads our labels and manual excerpts
   * @param {*} fileName
   * @returns {ProfileMetadataSchema}
   * @throws will throw an error if unable to read the file
   */
  static importMetadata(fileName) {
    logger.silly('method: importMetadata')
    /**
     * Example usage tracking your file structure:
     * @type {ProfileMetadataSchema}
     */
    let metaData = {}
    logger.debug('Snap class reading label and excerpts')
    try {
      const rawMetadata = fs.readFileSync(fileName, 'utf-8')
      metaData = JSON.parse(rawMetadata)
      let keyValuePairCount = formatWithCommas(countNonObjectPairs(metaData))
      logger.silly(`${keyValuePairCount} key-value pairs read from ${fileName}`)
    } catch (err) {
      // Force-cast 'err' by wrapping it in parentheses like this:
      const error = /** @type {Error} */ (err)
      console.error('Error reading or parsing file', error)
      logger.error(`Fatal Error reading ${fileName}`)
      process.exit(1)
    }
    // set the static variable with the result
    return metaData
  }
}

/**
 * Reads in the Snap file which is a JSON formatted file
 * @param {string} fileName - filename and type
 * @returns {Object} snap - json snap data
 * @throws will throw an error if unable to read file
 */
function readSnapFile(fileName) {
  logger.silly('method: readSnapFile')
  let fileNamePath = `./storage/wing-snaps/${fileName}`

  /** @type {KVP}  */
  let snap = {}

  try {
    // read the file synchronously at a UTF-8 string
    const rawData = fs.readFileSync(fileNamePath, 'utf8')

    // Parse the raw string into a JavaScript Object
    snap = JSON.parse(rawData)

    let keyValuePairCount = formatWithCommas(countNonObjectPairs(snap))
    logger.silly(`${keyValuePairCount} key-value pairs read from ${fileName}`)
  } catch (err) {
    // Force-cast 'err' by wrapping it in parentheses like this:
    const error = /** @type {Error} */ (err)
    console.error('Error reading or parsing file', error)
    logger.error(`Fatal Error reading ${fileNamePath}`)
    process.exit(1)
  }
  return snap
}

/**
 * Counts the key-value pairs in a nested object,
 * excluding keys whose values are objects or arrays.
 *
 * @param {Record<string,any>} obj - The JSON object to process
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
 * Add a comma or other character to make the number readable
 * @param {number} num - number to convert
 * @returns {string} string containing the number with proper symbols
 * @throws an error is called with an invalid number
 */
function formatWithCommas(num) {
  if (typeof num !== 'number' || isNaN(num)) {
    throw new Error('Input must be a valid number')
  }
  return num.toLocaleString('en-US') // Formats with commas for US locale
}
