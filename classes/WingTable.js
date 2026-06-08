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
import WingSnap from './WingSnap.js'

export default class WingTable extends WingSnap {
  constructor(fileName) {
    super(fileName)
    logger.debug('Table class instance created')

    console.dir(this.generateFileInformationTable(this.snapData), {
      depth: 3,
      colors: true,
    })

    // console.dir(this.generateMonitorTable(this.snapData), {
    //   depth: 3,
    //   colors: true,
    // })
  }

  /**
   * getBaseKeys - extract base keys from the json file
   * @returns array of key-value pairs at the base level of the json file
   */
  generateFileInformationTable(snap) {
    // filter out the ae_data and ce_data sections
    return {
      title: 'Snap File Information',
      headers: ['Setting', 'Value'],
      rows: Object.entries(snap).filter(
        ([key, value]) => typeof value !== 'object' || value === null
      ),
    }
  }

  generateBaseCfgTable(snap) {
    // Get the Base Config key-value pairs (normally mainlink and dcamgrp)
    const baseSection = Object.entries(snap?.ae_data?.cfg ?? {}).filter(
      ([key, value]) => typeof value !== 'object' || value === null
    )

    // ?const xxx = this.#generateMonitorTable(snap)

    return {
      baseCfg: baseSection,
      rows: xxx,
      // allKeys: allKeys,
      // return the entire section
      // allCfg: Object.entries(this.snapData.ae_data?.cfg ?? {}),
    }
  }

  /**
   * generateMonitorTable - build the table to pass to the presentation layer
   * @param {*} snapData
   * @returns object contains the table title, header and data rows
   */
  generateMonitorTable(snapData) {
    // 1. Safely extract monitor data using our bracket notation path
    const mon1Data = snapData?.ae_data?.cfg?.mon?.['1'] ?? {}
    const mon2Data = snapData?.ae_data?.cfg?.mon?.['2'] ?? {}

    // 2. Combine all unique top-level keys
    const allKeys = Array.from(
      new Set([...Object.keys(mon1Data), ...Object.keys(mon2Data)])
    )

    const rows = []

    // 3. Loop through your base keys and flatten sub-objects
    allKeys.forEach((key) => {
      const val1 = mon1Data[key]
      const val2 = mon2Data[key]

      // Check if either value is a nested configuration object (like your 'eq')
      if (typeof val1 === 'object' && val1 !== null && !Array.isArray(val1)) {
        // Get all unique sub-keys inside the object (e.g., 'on', 'lsg', '1g')
        const subKeys = Array.from(
          new Set([...Object.keys(val1 ?? {}), ...Object.keys(val2 ?? {})])
        )

        // Push a flat row for each sub-setting, labeling it clearly
        subKeys.forEach((subKey) => {
          const subVal1 = val1?.[subKey] !== undefined ? val1[subKey] : 'N/A'
          const subVal2 = val2?.[subKey] !== undefined ? val2[subKey] : 'N/A'

          // Formats the key as "eq.on", "eq.lsg", etc.
          rows.push([`${key}.${subKey}`, subVal1, subVal2])
        })
      } else {
        // It's a standard base value (like 'lvl', 'inv', 'pan') -> push directly
        const displayVal1 = val1 !== undefined ? val1 : 'N/A'
        const displayVal2 = val2 !== undefined ? val2 : 'N/A'

        rows.push([key, displayVal1, displayVal2])
      }
    })

    return {
      title: 'Monitor 1 and 2 Settings',
      headers: ['Setting', 'Monitor 1', 'Monitor 2'],
      rows: rows,
    }
  }
}
