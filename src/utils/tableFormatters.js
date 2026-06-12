import logger from '../classes/LoggerService.js'

import METADATA_DICTIONARY from '../../data/json/labels.json' with { type: 'json' }

export function helloWorld() {
  logger.warn('Hello World')
}

/**
 * Extracts the Root Keys from the snap
 * @param {KVP} snap - the Behringer Wing Snap json content
 * @returns {TableSchema4Col}
 */
export function generateManifestTable(snap) {
  logger.debug('Generating Manifest JSON')

  // filter out our manifest
  let { ae_data, ce_data, ...manifest } = snap

  // Create the table with headers
  let table = []

  // process each key-value pair and add the
  // label and manual excerpt data to it
  for (const [key, value] of Object.entries(manifest)) {
    // @ts-ignore
    const meta = METADATA_DICTIONARY[key] ?? {}
    /** @type {Row4Col} */
    const tableRow = {
      setting: key,
      val1: value,
      label: meta.label ?? 'N/A',
      excerpt: meta.manualText ?? 'N/A',
      formatType: meta.formatType ?? 'none',
    }
    table.push(tableRow)
  }
  return {
    tableTitle: 'Manifest File Information',
    columnTitles: {
      setting: 'Setting',
      val1: 'Value',
      description: 'Label/Manual Excerpt',
    },
    data: table,
  }
}

/**
 *
 * @param {KVP} snap - the Behringer Wing Snap json content
 * @param {string} section - 'ae_data.cfg' or 'ae_data.cfg.{section}
 * @param {string} [title] - the report title
 * @param {boolean} nested - root keys only or fetch nested keys too
 * @returns {TableSchema4Col}
 */
export function gen3ColJson(snap, section = '', title = 'N/A', nested = false) {
  logger.debug(
    `Generaring 3 Column JSON - title: "${title}" - nested: ${nested} - section: ${section}`
  )

  // get the data requested by 'section' for this table
  var data = {}
  if (section === '') {
    data = snap.ae_data.cfg
    var baseKey = 'ae_data.cfg'
  } else {
    data = snap.ae_data.cfg[section]
    var baseKey = `ae_data.cfg.${section}`
  }

  let table = []

  let keyValuePairs = Object.entries(data)

  // const physicalKey = key

  // // not useful for these keys but leaving them in anyway
  // const lookupKey = physicalKey.replace(/\.\d+\./, '.N.')

  // process top keys
  for (const [key1, val1] of keyValuePairs) {
    if (typeof val1 !== 'object') {
      const physicalKey = `${baseKey}.${key1}`
      // const lookupKey = physicalKey.replace(/\.\d+\./, '.N.')
      const lookupKey = physicalKey.replace(/\.[12AB]\./i, '.N.')
      // @ts-ignore
      const meta = METADATA_DICTIONARY[lookupKey] ?? {}
      /** @type {Row4Col} */
      const tableRow = {
        setting: key1,
        val1: val1,
        label: meta.label ?? 'N/A',
        excerpt: meta.manualText ?? 'N/A',
        formatType: meta.formatType ?? 'none',
      }
      table.push(tableRow)
      // console.log(`key1: ${key1} - val1: ${val1} ${baseKey}.${key1}`)
    } else if (nested) {
      // process nested keys
      let keyValuePairs2 = Object.entries(val1)
      for (const [key2, val2] of keyValuePairs2) {
        const physicalKey = `${baseKey}.${key1}.${key2}`
        // const lookupKey = physicalKey.replace(/\.\d+\./, '.N.')
        const lookupKey = physicalKey.replace(/\.[12AB]\./i, '.N.')
        var tableRow = [`${key1}-${key2}`, val2]
        // @ts-ignore
        const meta = METADATA_DICTIONARY[lookupKey] ?? {}
        const tableRow2 = {
          setting: `${key1}.${key2}`,
          val1: val2,
          label: meta.label ?? 'N/A',
          excerpt: meta.manualText ?? 'N/A',
          formatType: meta.formatType ?? 'none',
        }
        table.push(tableRow2)
        // console.log(
        //   `subkey1: ${key1}-${key2} - val2: ${val2} ${baseKey}.${key1}.${key2}`
        // )
      }
    }
  }
  return {
    tableTitle: title ?? 'N/A',
    columnTitles: {
      setting: 'Setting',
      val1: 'Value',
      description: 'Label/Manual Excerpt',
    },
    data: table,
  }

  // console.dir(keyValuePairs)
}

/**
 *
 * @param {KVP} snap
 */
export function gen4ColJson(snap, section = 'mon', options = {}) {
  // setup the mapping to the correct data based on 'section'
  //

  switch (section) {
    case 'mon':
      var data1 = snap.ae_data.cfg.mon['1']
      var data2 = snap.ae_data.cfg.mon['2']
      var normalizedKey = 'ae_data.cfg.mon.N.'
      var tableTitle = 'Monitors 1 and 2 Settings'
      var data1Title = 'Monitor 1'
      var data2Title = 'Monitor 2'
      logger.debug(
        `Generaring 5 Column Monitor Table - title: "${tableTitle}" - section: ${section}`
      )
      break
    case 'talk':
      var data1 = snap.ae_data.cfg.talk['A']
      var data2 = snap.ae_data.cfg.talk['B']
      var normalizedKey = 'ae_data.cfg.talk.N.'
      var tableTitle = 'Monitors 1 and 2 Settings'
      var tableTitle = 'Talkback A and B Settings'
      var data1Title = 'Talkback A'
      var data2Title = 'Talkback B'
      logger.debug(
        `Generaring 5 Column Talkback Table - title: "${tableTitle}" - section: ${section}`
      )
      break
    default:
      logger.error(`Invalid Section - must be "mon" or "talk"`)
      return [] // return empty table
  }

  const table = [
    [tableTitle, '', '', '', ''],
    ['Setting', data1Title, 'Label', 'Excerpt', data2Title],
  ]

  // we can trust that the keys generated by the Wing are identical
  // for data1 and data2 so combine them
  const combined = preserveBothJSON(data1, data2)
  const flattened = flattenToNestedArrays(combined)
  for (const [K1, V1, V2] of flattened) {
    const metaKey = `${normalizedKey}${K1}`
    const meta = METADATA_DICTIONARY[metaKey]
    const newRow = [K1, V1, meta.labelText, meta.manualText, V2]
    table.push(newRow)
    // console.log(newRow)
  }
  return table
}

function flattenToNestedArrays(obj, currentPath = '') {
  let rows = []

  for (const [key, value] of Object.entries(obj)) {
    // Combine parent and child keys using a hyphen
    const newPath = currentPath ? `${currentPath}.${key}` : key

    // 1. If it's a nested object (like 'eq' or 'dly'), dig deeper recursively
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      rows.push(...flattenToNestedArrays(value, newPath))
    }
    // 2. If it's the array containing our two values, pack them into a new array row
    else if (Array.isArray(value)) {
      const [value1, value2] = value
      rows.push([newPath, value1, value2])
    }
    // 3. Fallback for single values
    else {
      rows.push([newPath, value, 'N/A'])
    }
  }

  return rows
}

// function processNestedKeys(obj, currentPath = '') {
//   for (const [key, value] of Object.entries(obj)) {
//     // Combine parent and child keys using a hyphen (e.g., "eq-on", "eq-1g")
//     const newPath = currentPath ? `${currentPath}.${key}` : key

//     // 1. If it is a nested object (like 'eq' or 'dly'), dig deeper recursively
//     if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
//       processNestedKeys(value, newPath)
//     }
//     // 2. If it is an array containing our two values, unpack and print them
//     else if (Array.isArray(value)) {
//       const [value1, value2] = value
//       console.log(`"${newPath}"\t"${value1}"\t"${value2}"`)
//     }
//     // 3. Fallback for unexpected flat string/number primitives
//     else {
//       console.log(`"${newPath}"\t"${value}"\t"N/A"`)
//     }
//   }
// }

// function deepMerge(target, source) {
//   for (const key in source) {
//     if (source[key] instanceof Object && key in target) {
//       Object.assign(source[key], deepMerge(target[key], source[key]))
//     }
//   }
//   return { ...target, ...source }
// }

function preserveBothJSON(objA, objB) {
  // If either is not an object, combine them into an array
  if (
    typeof objA !== 'object' ||
    objA === null ||
    typeof objB !== 'object' ||
    objB === null
  ) {
    return [objA, objB]
  }

  // Handle arrays by concatenating them
  if (Array.isArray(objA) && Array.isArray(objB)) {
    return [...objA, ...objB]
  }

  const result = {}
  // Gather all unique keys from both structures
  const allKeys = new Set([...Object.keys(objA), ...Object.keys(objB)])

  for (const key of allKeys) {
    if (key in objA && key in objB) {
      result[key] = preserveBothJSON(objA[key], objB[key])
    } else {
      result[key] = key in objA ? objA[key] : objB[key]
    }
  }
  return result
}
