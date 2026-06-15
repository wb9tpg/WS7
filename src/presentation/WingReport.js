// @ts-check
//  ┌────────────────────────────────────────────────────────┐
//  │                      1. SNAP TIER                      │
//  │  Reads file ➔ Holds raw JSON ➔ Zero formatting/logic │
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
import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'

import PdfPrinter from 'pdfmake'

import logger from '../classes/LoggerService.js'
import Table from '../classes/WingTable.js'
import {
  helloWorld,
  generateManifestJson,
  gen3ColJson,
  gen4ColJson,
} from '../utils/tableFormatters.js'
import { tableTitleRows } from '../utils/reportFormatters.js'
import { formatValueDisplay } from '../utils/reportFormatters.js'

export default class WingReport extends Table {
  static runningHeader = {
    level1: 0,
    level2: 0,
  }

  /**
   * WingReport class constructor
   * @param {*} fileName - the snap file for this report
   */
  constructor(fileName) {
    super(fileName)
    logger.debug('Report class instance created')
    this.InitializePdfmake()

    // console.log(`Report constructor ${fileName}`)
  }

  InitializePdfmake() {
    logger.debug('Initializing Pdfmake')
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)

    this.fonts = {
      Roboto: {
        normal: path.join(
          __dirname,
          '../../node_modules/pdfmake/fonts/Roboto',
          'Roboto-Regular.ttf'
        ),
        bold: path.join(
          __dirname,
          '../../node_modules/pdfmake/fonts/Roboto',
          'Roboto-Medium.ttf'
        ),
        italics: path.join(
          __dirname,
          '../../node_modules/pdfmake/fonts/Roboto',
          'Roboto-Italic.ttf'
        ),
        bolditalics: path.join(
          __dirname,
          '../../node_modules/pdfmake/fonts/Roboto',
          'Roboto-MediumItalic.ttf'
        ),
      },
    }
    // Initializations (Security, Fonts, etc.)
    try {
      PdfPrinter.setUrlAccessPolicy(() => false)
      PdfPrinter.setLocalAccessPolicy((p) => p.includes('node_modules'))
      PdfPrinter.addFonts(this.fonts)
    } catch (/** @type {any}*/ err) {
      logger.error('Initialization failed:', err.message)
    }

    /** @type {import('pdfmake/interfaces.js').TDocumentDefinitions} */
    this.docDefinition = {
      content: [],
      defaultStyle: { font: 'Roboto', fontSize: 9 }, // Slightly smaller default for tight engine tables
      pageSize: 'LETTER',
      pageMargins: [40, 50, 40, 50],
      header: function (currentPage, pageCount) {
        // Hide the running header on the Title page (1) and TOC page (2)
        if (currentPage <= 2) return ''

        return {
          text: 'Running Header Text',
          alignment: 'right',
          style: 'headerStyle',
          margin: [0, 20, 40, 0],
        }
      },
      footer: function (currentPage, pageCount) {
        // Completely hide page numbers on the Cover Page
        if (currentPage === 1) return ''

        return {
          text: `Page ${currentPage} of ${pageCount}`,
          alignment: 'center',
          style: 'footerStyle',
          margin: [0, 0, 0, 20],
        }
      },
      styles: {
        headerStyle: { fontSize: 8, color: '#999999', italics: true },
        footerStyle: { fontSize: 8, color: '#777777' },
        // Additional styles can be defined here for consistent formatting across the report
        ioTable: {
          fontSize: 7.5, // Optimized for 12 columns in Portrait layout
          alignment: 'center',
        },
        tableHeader: {
          bold: true,
          fillColor: '#004085',
          color: 'white',
          alignment: 'center',
          // paddingLeft: function (i, node) { return 4; },
          // paddingRight: function (i, node) { return 4; },
          // paddingTop: function (i, node) { return 2; },   // Minimal vertical spacing
          // paddingBottom: function (i, node) { return 2; } // Minimal vertical spacing
        },
        tableSubHeader: {
          bold: true,
          fillColor: '#004085',
          color: 'white',
          alignment: 'center',
          fontSize: 7,
          // paddingLeft: function (i, node) { return 4; },
          // paddingRight: function (i, node) { return 4; },
          // paddingTop: function (i, node) { return 2; },   // Minimal vertical spacing
          // paddingBottom: function (i, node) { return 2; } // Minimal vertical spacing
        },

        keyCell: {
          alignment: 'left',
          bold: true,
        },
        centerCell: {
          alignment: 'center',
        },
        centerCell8pt: {
          alignment: 'center',
          fontSize: 8,
        },
      },
    }
    // PASTE HERE TODO
    return this
  }

  buildReport() {
    logger.silly('method: buildReport()')
    logger.info('Building the PDF report content...')

    this.printCoverAndToc()
      .heading('Introduction', 1, { pageBreak: undefined })
      .paragraph(
        'This report provides a comprehensive overview of the console system configuration, including detailed tables extracted from the Snap file. The following sections present the key-value pairs along with relevant excerpts from the system configuration for each parameter.'
      )

    this.printFileManifest()

    const con = { depth: 2 } // object parm for console.dir function
    // console.dir(gen3ColJson(this.snap, '', 'Audio Engine', false), con)
    // console.dir(gen4ColJson(this.snap, 'mon', { nested: false }), con) //TODO
    // console.dir(gen3ColJson(this.snap, 'solo', 'Solo System', true), con)
    // console.dir(gen3ColJson(this.snap, 'rta', 'Real Time Analyzer', true), con)
    // console.dir(gen3ColJson(this.snap, 'mtr', 'Meter System', true), con)
    // console.dir(gen3ColJson(this.snap, 'talk', 'Talkback System', false), con) //header only
    // console.dir(gen4ColJson(this.snap, 'talk', { nested: true })) // TODO
    // console.dir(gen3ColJson(this.snap, 'amix', 'Automix Settings', false), con)
  }

  printCoverAndToc() {
    // 1. GENERATE THE TITLE PAGE
    // Use an empty string with a large top margin to center your title block vertically
    logger.debug('Building the Title Page')
    this.add({ text: '', margin: [0, 150, 0, 0] })
    this.add({
      text: 'CONSOLES SYSTEM CONFIGURATION REPORT',
      fontSize: 26,
      bold: true,
      alignment: 'center',
      color: '#0056b3',
    })
    this.add({
      text: 'Comprehensive Audio Routing Diagnostic Log',
      fontSize: 14,
      alignment: 'center',
      color: '#6c757d',
      margin: [0, 8, 0, 0],
    })
    // Add metadata block at the bottom of the title canvas
    this.add({ text: '', margin: [0, 200, 0, 0] })
    this.add({
      text: `Generated: ${new Date().toLocaleDateString()}`,
      alignment: 'center',
      fontSize: 10,
      color: '#333333',
    })
    this.add({
      text: 'System Architecture Reference Profile',
      alignment: 'center',
      fontSize: 10,
      color: '#999999',
      italics: true,
    })

    // 2. FORCE A BREAK TO START THE TOC SHEET
    logger.debug('Building the TOC')
    this.add({ text: '', pageBreak: 'after' })

    // 3. INJECT THE AUTOMATIC TOC COMPONENT
    this.add({
      toc: {
        title: {
          text: 'TABLE OF CONTENTS',
          fontSize: 16,
          bold: true,
          color: '#1a1a1a',
          margin: [0, 0, 0, 15],
        },
        tocMargin: [
          [0, 5, 0, 0], // Level 1: No indent
          [20, 5, 0, 0], // Level 2: Indented 20px
          [40, 5, 0, 0], // Level 3: Indented 40px
        ],
      },
    })

    // 4. FORCE A BREAK AFTER THE TOC SO MAP 1 STARTS FRESH
    this.add({ text: '', pageBreak: 'after' })

    return this
  }

  printFileManifest() {
    this.heading('File Manifest Information', 2).paragraph(
      'The manifest contains information about the file and the equipment that created it.'
    )

    // const con = { depth: 2 } // object parm for console.dir function
    // console.dir(generateManifestJson(this.snap), con)

    const manifest = generateManifestJson(this.snap)

    const xyz = tableTitleRows(manifest.tableTitle, manifest.columnTitles)

    return this
  }

  /** Creates a PDF document based on the current document definition.
   * @returns - the PDF document instance
   */
  createPdf() {
    // 1. write the docDefinition to a file so we want look at it
    const jsonString = JSON.stringify(this.docDefinition, null, 2)
    fs.writeFileSync('./public/pdfs/docDefinition.json', jsonString)
    logger.info(
      `Document Definition successfully written to: "pdfs/docDefinition.json"`
    )

    // 2. create the document
    // @ts-ignore
    return PdfPrinter.createPdf(this.docDefinition)
  }

  /** Generates a PDF file at the specified path.
   * @param {string} filePath - the path where the PDF file will be saved
   * @returns {Promise<string>} - a promise resolving to the path of the generated PDF file
   */
  async generate(filePath) {
    return new Promise((resolve, reject) => {
      this.createPdf()
        .write(filePath)
        .then(() => {
          logger.info(`📄 PDF successfully rendered to: ${filePath}`)
          resolve(filePath)
        })
        .catch((err) => {
          logger.error(`Failed to write out PDF file structure content:`, err)
          reject(err)
        })
    })
  }

  // ========== METHODS FOR CONTENT CREATION (HEADINGS, PARAGRAPHS, TABLES, ETC.) ==========

  /** Method to add content to the document definition's content array.
   * Append to this.docDefinition.content with support for both single objects and arrays of objects, enabling method chaining for a fluent API design.
   * @param {*} c - the content to add, which can be a single object or an array of objects to be appended to the document definition's content array.
   * @returns - the current instance of PdfGenerator to allow for method chaining.
   */
  add(c) {
    Array.isArray(c)
      ? // @ts-ignore
        this.docDefinition.content.push(...c)
      : // @ts-ignore
        this.docDefinition.content.push(c)
    return this
  }

  /** Method to add a heading to the PDF document with customizable options for font size, boldness, margin, and page break behavior. It calculates default font sizes based on the heading level and includes smart defaults for keeping headings with subsequent content. The method also ensures that level 1 headings trigger a page break before them, while allowing for overrides through options.
   * Adds a heading to the document.
   * @param {*} text - the heading text
   * @param {*} lvl - the heading level (1-4)
   * @param {*} opts - additional options for the heading
   * @returns - the current instance of PdfGenerator to allow for method chaining
   */
  heading(text, lvl = 1, opts = {}) {
    const sizes = [22, 16, 13, 11]
    const smartKeepWithNext = lvl === 2
    const isH1 = lvl === 1
    const isH1orH2 = lvl === 1 || lvl === 2
    const indent = (lvl - 1) * 20 // Indent increases with heading level
    switch (lvl) {
      case 1:
        WingReport.runningHeader.level1 += 1
        WingReport.runningHeader.level2 = 0
        text = `${WingReport.runningHeader.level1}.${WingReport.runningHeader.level2} ${text}`
        break
      case 2:
        WingReport.runningHeader.level2 += 1
        text = `${WingReport.runningHeader.level1}.${WingReport.runningHeader.level2} ${text}`
        break
      default: // do nothing here
    }
    return this.add({
      text,
      fontSize: opts.fontSize || sizes[lvl - 1] || 12,
      bold: true,
      margin: [0, 8, 0, 6],
      keepWithNext:
        opts.keepWithNext !== undefined ? opts.keepWithNext : smartKeepWithNext,
      pageBreak: isH1 ? 'before' : undefined,

      // NATIVE TOC REGISTRATION:
      // Only register Level 1 section headers to keep the index layout clean [I1.4.6]
      tocItem: isH1orH2 ? true : undefined,
      tocStyle: { bold: true, fontSize: 10, color: '#0056b3' }, // Style inside the index [I1.4.6]
      tocMargin: [indent, 4, 0, 4], // Padding between index rows [I1.4.3, I1.4.6]

      ...opts,
    })
  }

  /** Method to add a paragraph to the PDF document with customizable margins.
   * @param {*} text - the paragraph text
   * @param {*} opts - additional options for the paragraph
   * @returns - the current instance of PdfGenerator to allow for method chaining
   */
  paragraph(text, opts = {}) {
    return this.add({ text, margin: [0, 3], ...opts })
  }
}
