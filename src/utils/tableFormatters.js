// @ts-check
/** @typedef {Record<string, any>} KVP */
import logger from '../classes/LoggerService.js'
import METADATA_DICTIONARY from '../../data/json/labels.json' with { type: 'json' }

export function helloWorld() {
  logger.warn('Hello World')
}

/**
 * Generate the header
 * @param {KVP} snap - the snap file
 * @returns {*} - the base key-value pairs
 */
export function generateHeaderTable(snap) {
  let { ae_data, ce_data, ...header } = snap

  const rootKeys = Object.keys(header)
  console.log(rootKeys)
  const allKeys = Array.from(rootKeys)
  // console.log(allKeys)

  const tableRows = []
  const excerptRows = []

  allKeys.forEach((key) => {
    tableRows.push([key, header[key]])

    const physicalKey = key
    const lookupKey = physicalKey.replace(/\.\d+\./, '.N.')

    const meta = METADATA_DICTIONARY[lookupKey] ?? {
      labelText: key,
      manualText: null,
    }
    if (meta.manualText) {
      excerptRows.push([meta.labelText, meta.manualText])
    }

    // console.log(meta)
  })

  // var tableRows = Object.entries(header)

  return {
    title: 'Header Information',
    headers: ['Setting', 'Value'],
    rows: tableRows,
    excerpts: excerptRows,
  }
}
