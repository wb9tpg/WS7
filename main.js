import logger from './classes/LoggerService.js'
import WingReport from './classes/WingReport.js'
logger.info('Wing Snap Report Generator started')
const report = new WingReport('./snaps/Console.json')
