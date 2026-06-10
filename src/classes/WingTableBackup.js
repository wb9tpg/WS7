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
import METADATA_DICTIONARY from '../json/labels.json' with { type: 'json' }

export default class WingTable extends WingSnap {
  constructor(fileName) {
    super(fileName)
    logger.debug('Table class instance created')

    // console.dir(this.generateFileInformationTable(this.snapData), {
    //   depth: 3,
    //   colors: true,
    // })

    // console.dir(this.generateAudioEngineBaseConfigurationTable(this.snapData), {
    //   depth: 3,
    //   colors: true,
    // })

    console.dir(this.generateMonitorTable(this.snapData), {
      depth: 3,
      colors: true,
    })
  }

  /**
   * getBaseKeys - extract base keys from the json file
   * @returns array of key-value pairs at the base level of the json file
   */
  generateTable(snap) {
    // remove the Audio Engine and Console Engine data
    // leaving only the root keys
    // delete snap['ae_data']
    delete snap['ce_data']

    const rootKeys = Object.keys(snap)
    const allKeys = Array.from(rootKeys)

    const tableRows = []
    const excerptRows = []

    allKeys.forEach((key) => {
      const val1 = snap[key]
      console.log(`key ${key} - ${val1}`)
      const physicalKey = key

      // not useful for these keys but leaving them in anyway
      const lookupKey = physicalKey.replace(/\.\d+\./, '.N.')

      const val1Base = val1 !== undefined ? val1 : 'N/A'

      const meta = METADATA_DICTIONARY[lookupKey] ?? {
        labelText: key,
        manualText: null,
      }

      tableRows.push([meta.labelText, val1Base])
      if (meta.manualText) {
        excerptRows.push([meta.labelText, meta.manualText])
      }
    })

    const numColumns = tableRows[0].length

    return {
      title: 'File Information',
      headers: ['Setting', 'Value'],
      rows: tableRows,
      excerpts: excerptRows,
      tableRows: tableRows.length,
      tableColumns: numColumns,
    }
  }

  /**
   * getBaseKeys - extract base keys from the json file
   * @returns array of key-value pairs at the base level of the json file
   */
  generateFileInformationTable(snap) {
    // remove the Audio Engine and Console Engine data
    // leaving only the root keys
    delete snap['ae_data']
    delete snap['ce_data']

    const rootKeys = Object.keys(snap)
    const allKeys = Array.from(rootKeys)

    const tableRows = []
    const excerptRows = []

    allKeys.forEach((key) => {
      const val1 = snap[key]
      console.log(`key ${key} - ${val1}`)
      const physicalKey = key

      // not useful for these keys but leaving them in anyway
      const lookupKey = physicalKey.replace(/\.\d+\./, '.N.')

      const val1Base = val1 !== undefined ? val1 : 'N/A'

      const meta = METADATA_DICTIONARY[lookupKey] ?? {
        labelText: key,
        manualText: null,
      }

      tableRows.push([key, val1Base])
      if (meta.manualText) {
        excerptRows.push([meta.labelText, meta.manualText])
      }
    })

    const numColumns = tableRows[0].length

    return {
      title: 'File Information',
      headers: ['Setting', 'Value'],
      rows: tableRows,
      excerpts: excerptRows,
      tableRows: tableRows.length,
      tableColumns: numColumns,
    }
  }

  generateAudioEngineBaseConfigurationTable(snap) {
    // Get the Base Config key-value pairs (normally mainlink and dcamgrp)
    // const baseSection =

    // ?const xxx = this.#generateMonitorTable(snap)

    return {
      // baseCfg: baseSection,
      title: 'Audio Engine Configuration',
      headers: ['Setting', 'Value'],
      rows: Object.entries(snap?.ae_data?.cfg ?? {}).filter(
        ([key, value]) => typeof value !== 'object' || value === null
      ),
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
  // Your exact dictionary scheme

  generateMonitorTable(snapData) {
    // console.log(snapData)
    // 1. Target your structured layout fields
    const mon1Data = snapData?.ae_data?.cfg?.mon?.['1'] ?? {}
    const mon2Data = snapData?.ae_data?.cfg?.mon?.['2'] ?? {}

    const allKeys = Array.from(
      new Set([...Object.keys(mon1Data), ...Object.keys(mon2Data)])
    )

    const tableRows = []
    const excerptRows = []

    allKeys.forEach((key) => {
      const val1 = mon1Data[key]
      const val2 = mon2Data[key]

      // Handle Deep Nested Configuration Objects (like EQ)
      if (typeof val1 === 'object' && val1 !== null && !Array.isArray(val1)) {
        const subKeys = Array.from(
          new Set([...Object.keys(val1 ?? {}), ...Object.keys(val2 ?? {})])
        )

        subKeys.forEach((subKey) => {
          // Build the active structural dot-notation path
          const physicalKey = `ae_data.cfg.mon.1.${key}.${subKey}`

          // Convert 'mon.1.eq.lsg' -> 'mon.N.eq.lsg' to match the dictionary placeholder
          const lookupKey = physicalKey.replace(/\.\d+\./, '.N.')

          const val1Sub = val1?.[subKey] !== undefined ? val1[subKey] : 'N/A'
          const val2Sub = val2?.[subKey] !== undefined ? val2[subKey] : 'N/A'

          const meta = METADATA_DICTIONARY[lookupKey] ?? {
            labelText: `${key}.${subKey}`,
            manualText: null,
          }

          tableRows.push([`${key}-${subKey}`, val1Sub, val2Sub])
          if (meta.manualText) {
            excerptRows.push([meta.labelText, meta.manualText])
          }
        })
      } else {
        // Handle Standard Base Values (like lvl, inv, pan)
        // Construct the runtime absolute string format
        const physicalKey = `ae_data.cfg.mon.1.${key}`

        // Swap out the digit for 'N' (e.g., 'ae_data.cfg.mon.1.lvl' -> 'ae_data.cfg.mon.N.lvl')
        const lookupKey = physicalKey.replace(/\.\d+\./, '.N.')

        const val1Base = val1 !== undefined ? val1 : 'N/A'
        const val2Base = val2 !== undefined ? val2 : 'N/A'

        const meta = METADATA_DICTIONARY[lookupKey] ?? {
          labelText: key,
          manualText: null,
        }

        tableRows.push([key, val1Base, val2Base])
        if (meta.manualText) {
          excerptRows.push([meta.labelText, meta.manualText])
        }
      }
    })

    const numColumns = 5

    return {
      title: 'Monitor 1 and 2 Settings',
      headers: ['Setting', 'Monitor 1', 'Monitor 2'],
      rows: tableRows,
      excerpts: excerptRows,
      tableRows: tableRows.length,
      tableColumns: numColumns,
      // tableRows: tableRows.length,
      // tableColumns: numColumns,
    }
  }

  generateSingleValueTable(snapData, opts = { type: true }) {
    // 1. Safely drill down to the monitor configuration object
    const monData = snapData?.ae_data?.cfg ?? {}

    // 2. Extract the base-level keys
    const allKeys = Object.keys(monData)

    const tableRows = []
    const excerptRows = []

    allKeys.forEach((key) => {
      const val = monData[key]

      // Handle Deep Nested Configuration Objects (like EQ)
      if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
        const subKeys = Object.keys(val)

        subKeys.forEach((subKey) => {
          // Build the runtime dot-notation path
          const physicalKey = `ae_data.cfg.mon.1.${key}.${subKey}`

          // Normalize 'mon.1.eq.lsg' -> 'mon.N.eq.lsg' to match your dictionary
          const lookupKey = physicalKey.replace(/\.[\dAB]+\./i, '.N.')
          // const lookupKey = physicalKey.replace(/\.\d+\./, '.N.')
          const displayVal = val[subKey] !== undefined ? val[subKey] : 'N/A'

          // Dictionary Lookup
          const meta = METADATA_DICTIONARY[lookupKey] ?? {
            labelText: `${key}.${subKey}`,
            manualText: null,
          }

          // 2-Column row format: [Label, Value]
          tableRows.push([meta.labelText, displayVal])

          if (meta.manualText) {
            excerptRows.push([meta.labelText, meta.manualText])
          }
        })
      } else {
        // Handle Standard Base Values (like lvl, inv, pan)
        const physicalKey = `ae_data.cfg.mon.1.${key}`
        // const lookupKey = physicalKey.replace(/\.\d+\./, '.N.')
        const lookupKey = physicalKey.replace(/\.[\dAB]+\./i, '.N.')

        const displayVal = val !== undefined ? val : 'N/A'

        const meta = METADATA_DICTIONARY[lookupKey] ?? {
          labelText: key,
          manualText: null,
        }

        tableRows.push([meta.labelText, displayVal])

        if (meta.manualText) {
          excerptRows.push([meta.labelText, meta.manualText])
        }
      }
    })

    const numColumns = tableRows[0].length

    return {
      title: 'Monitor 1 Settings Profile',
      headers: ['Setting', 'Current Value'], // Updated to 2 columns
      rows: tableRows,
      excerpts: excerptRows,
      // rowLen: tableRows.length,
      // colLen: ,
    }
  }
}
