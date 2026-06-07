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

import fs from 'fs'

export default class WingSnap {
  /**
   * Constructor called from Parent Table Class
   * @param {*} fileName
   */
  constructor(fileName) {
    this.#readFile(fileName) // read the file

    const data = this.#extractAeCeData()
    this.ae_data = data.ae_data
    this.ce_data = data.ce_data

    console.dir(this.ae_data, { depth: 1, colors: true })
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
      this.snapData = JSON.parse(rawData)
    } catch (error) {
      console.error('Error reading or parsing file', error)
    }
    return this
  }

  #extractAeCeData() {
    return {
      ae_data: this.snapData['ae_data'],
      ce_data: this.snapData['ce_data'],
    }
  }
}
