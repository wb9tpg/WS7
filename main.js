import logger from './src/classes/LoggerService.js'
import WingReport from './src/presentation/WingReport.js'
import { helloWorld } from './src/utils/tableFormatters.js'
logger.info('Wing Snap Report Generator started')

const report = new WingReport('Console.json')
helloWorld()

let s = report.snap
let { ae_data, ce_data, ...s1 } = s
console.dir(s1, { depth: 1, colors: true })
