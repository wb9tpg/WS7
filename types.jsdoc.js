// types.jsdoc.js
// Centralized project types. No runtime code, just JSDoc definitions.

/**
 * A universal shortcut representing a standard JavaScript Key-Value Pair object.
 * @typedef {Record<string, any>} KVP
 */

/**
 * A universal layout grid representing a standard 2D array matrix table.
 * @typedef {any[][]} TableGrid
 */

/**
 * The standard structural document layout array required by pdfmake [USER].
 * @typedef {any[][]} PdfBodyGrid
 */

/**
 * Represents a single row in the user management table.
 * @typedef {Object} TableRow
 * @property {number} id - The unique user ID column.
 * @property {string} name - The user's full name column.
 * @property {string} role - The access permission column (e.g., 'admin').
 * @property {boolean} isActive - The account status column.
 */

/**
 * Represents a single metadata definition block.
 * @typedef {Object} MetadataDefinition
 * @property {string} shortKey - The abbreviated key identifier.
 * @property {string} fullKeyDebug - The full key name used for debugging.
 * @property {string} labelText - The human-readable display label.
 * @property {string} manualText - A detailed description of the field's purpose.
 * @property {FormatType} [formatType] - how to format the values
 */

/**
 * The root dictionary mapping field names to their structural definitions.
 * @typedef {Object.<string, MetadataDefinition>} ProfileMetadataSchema
 */

// /**
//  * Represents the complete user data table.
//  * @typedef {TableRow[]} UserTable
//  */

// /**
//  * A row represented as a plain array: [id, name, role, isActive]
//  * @typedef {[number, string, string, boolean]} RawRow
//  */

// /**
//  * A table represented as an array of raw array rows.
//  * @typedef {RawRow[]} RawTable
//  */

// /** @type {RawTable} */
// const rawCSVData = [
//   [1, "Alice", "admin", true],
//   [2, "Bob", "editor", false]
// ];
/**
 * Strict formatting styles handled by the presentation engine.
 * @typedef {('dB' | 'percent' | 'ms' | 'none')} FormatType
 */

/**
 * Raw 4-column data structure
 * @typedef {Object} Row4Col
 * @property {string} setting
 * @property {string} val1
 * @property {string} label
 * @property {string} excerpt
 * @property {FormatType} formatType - Moved to the end of the row structure
 */

/**
 * Raw 5-column data structure
 * @typedef {Object} Row5Col
 * @property {string} setting
 * @property {string} val1
 * @property {string} val2
 * @property {string} label
 * @property {string} excerpt
 * @property {FormatType} formatType - Moved to the end of the row structure
 */

/**
 * @typedef {Object} DisplayHeaders3Col
 * @property {string} setting
 * @property {string} val1
 * @property {string} description
 */

/**
 * @typedef {Object} TableSchema4Col
 * @property {string} tableTitle
 * @property {DisplayHeaders3Col} columnTitles
 * @property {Row4Col[]} data
 */

/**
 * @typedef {Object} DisplayHeaders4Col
 * @property {string} setting
 * @property {string} val1
 * @property {string} val2
 * @property {string} description
 */

/**
 * @typedef {Object} TableSchema5Col
 * @property {string} tableTitle
 * @property {DisplayHeaders4Col} columnTitles
 * @property {Row5Col[]} data
 */
